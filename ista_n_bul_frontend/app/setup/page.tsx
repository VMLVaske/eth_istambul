"use client";

import react, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { DeployTransactionGuardModal } from "@/components/deployTransactionGuardModal";
import { ApplyTransactionGuardModal } from "@/components/applyTransactionGuardModal";
import { bold } from "@/components/primitives";
import * as Constants from "@/app/constants";
import { InfinitySpin } from "react-loader-spinner";
import factoryAbi from "@/abis/guardFactory.json";
import { BrowserProvider, ethers } from "ethers";

function Loading() {
  return <InfinitySpin width="200" color="#12FF80" />;
}

function SetupArea(props: { guardAddress: string }) {
  return (
    <div>
      <div>
        Before we can start, we need to setup a{" "}
        <a
          href="https://help.safe.global/en/articles/40809-what-is-a-transaction-guard"
          target="_blank"
        >
          transaction guard
        </a>{" "}
        to your safe. This happens in two steps: </div>
      <div className="items-center justify-center">First, we need to deploy your
        very own transaction guard.
        <br />
        <div className="py-4">
          <span className={bold()}>Step 1: </span>
          <DeployTransactionGuardModal guardAddress={props.guardAddress} />
        </div>
      </div>
      <div>
        In the second step, we need to add the new
        guard to your safe.
        <br />
        <div className="py-4"></div>
        <span className={bold()}>Step 2: </span>
        <ApplyTransactionGuardModal guardAddress={props.guardAddress} />
      </div>
    </div>
  );
}

function SetupPage(props) {
  const { sdk, connected, safe } = useSafeAppsSDK();
  const [guardAddress, setGuardAddress] = useState<string | null>(null);

  useEffect(() => {
    const execute = async () => {
      const constants = Constants.getConstants(safe.chainId);

      // @ts-ignore
      if (window.ethereum) {
        // @ts-ignore
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // @ts-ignore
        const provider = new BrowserProvider(window.ethereum);

        const factoryContract = new ethers.Contract(
          constants.FACTORY_ADDRESS,
          factoryAbi,
          provider
        );

        const guard = await factoryContract.getGuard(safe.safeAddress);
        setGuardAddress(guard);
      }
    };

    execute();
  }, [safe, guardAddress]);

  return (
    <div>
      <div>
        This app helps you setting multiple user permissions for the different
        owners of your SAFE. This uses SAFE's guard feature to restrict specific
        users and give them a whitelist of things they can do on-chain.
      </div>
      {guardAddress == null ? (
        <Loading />
      ) : (
        <SetupArea guardAddress={guardAddress} />
      )}
      </div>
  );
}

export default SetupPage;

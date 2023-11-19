"use client";

import NextLink from "next/link";
import { Link } from "@nextui-org/link";

import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle, bold } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Button, TableColumn } from "@nextui-org/react";
import { CreateUserRoleModal } from "@/components/createUserRoleModal";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { ethers, BrowserProvider } from "ethers";
import React, { useEffect, useState } from "react";
import safeAbi from "../abis/gnosisSafe.json";
import SetupPage from "@/app/setup/page";
import OverviewPage from "@/app/overview/page";

function noGuard() {
  return (
    <div>
      <div>
        This app helps you setting multiple user permissions for the different
        owners of your SAFE. This uses SAFE's guard feature to restrict specific
        users and give them a whitelist of things they can do on-chain.
      </div>
      <div>
        Before we can start, we need to setup a{" "}
        <a
          href="https://help.safe.global/en/articles/40809-what-is-a-transaction-guard"
          target="_blank"
        >
          transaction guard
        </a>{" "}
        to your safe. Please push the next button to do this.
      </div>
      <div>
        <Button color="success" title="Install Transaction Guard" />
      </div>
    </div>
  );
}

function GuardAvailable(props: {
  provider: BrowserProvider;
  guard: string;
  userRoles: string[];
}) {
  return (
    <div>
      <div>Guard Address: {props.guard}</div>
      <h2>User Roles</h2>
      {props.userRoles.map((userRole) => (
        <li>{userRole}</li>
      ))}
    </div>
  );
}

export default function Home() {
  const { sdk, connected, safe } = useSafeAppsSDK();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [guardAddress, setGuardAddress] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        // check if guard is installed
        const safeContract = new ethers.Contract(
          safe.safeAddress,
          safeAbi,
          provider
        );

        const guard = await safeContract
          .getStorageAt(
            "0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8",
            1
          )
          .catch(
            () =>
              "0x0000000000000000000000000000000000000000000000000000000000000000"
          );
        // console.log(guard);
        setGuardAddress(guard);

        // if (guard != "") {
        //   const guardContract = new ethers.Contract(
        //     guardAddress,
        //     safeAbi,
        //     provider
        //   );
        // }
        // TODO
        // setUserRoles(["test role"]);
      }
    };

    initializeProvider();
  }, [safe, guardAddress]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>An &nbsp;</h1>
        <h1 className={title({ color: "green" })}>Istanbülülü&nbsp;</h1>
        <h1 className={title()}>Project</h1>
        <h2 className={subtitle({ class: "mt-4" })}>by jörg and valerie</h2>
        <div>safe address: {safe.safeAddress}</div>
      </div>
      <div className="flex flex-col gap-4 py-8 items-center justify-center">
        {(() => {
          if (
            guardAddress !=
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            return <OverviewPage />;
          } else {
            return <SetupPage />;
          }
        })()}
      </div>
    </section>
  );
}

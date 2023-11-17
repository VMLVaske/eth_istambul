import "./App.css";

import React, { useEffect, useState } from "react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { ethers, BrowserProvider } from "ethers";
import safeAbi from "./abis/gnosisSafe.json";

import { Button } from "react-native";

function App() {
  const { sdk, connected, safe } = useSafeAppsSDK();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [guardAddress, setGuardAddress] = useState("");
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
          .catch(() => "");
        setGuardAddress(guard);

        if (guard != "") {
          const guardContract = new ethers.Contract(
            guardAddress,
            safeAbi,
            provider
          );
        }
        // TODO
        setUserRoles(["test role"]);
      }
    };

    initializeProvider();
  }, [safe, guardAddress]);

  return (
    <div className="App">
      <header className="App-header">
        <div>Manage owner access permissions</div>
      </header>
      <body className="App-body">
        {(() => {
          if (guardAddress == "") {
            return GuardAvailable({ provider: provider!, guard: guardAddress, userRoles });
          } else {
            return noGuard();
          }
        })()}
      </body>
    </div>
  );
}

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
        <Button title="Install Transaction Guard" />
      </div>
    </div>
  );
}

function GuardAvailable(props: { provider: BrowserProvider; guard: string, userRoles: string[] }) {
  return (
    <div>
      <h2>User Roles</h2>
      {props.userRoles.map((userRole) => (
        <li>{userRole}</li>
      ))}
    </div>
  );
}
export default App;

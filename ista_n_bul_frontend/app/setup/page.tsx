"use client";

import react, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { DeployTransactionGuardModal } from "@/components/deployTransactionGuardModal";
import { ApplyTransactionGuardModal } from "@/components/applyTransactionGuardModal";
import { bold } from "@/components/primitives";

function SetupPage() {
  const router = useRouter();

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
        to your safe. This happens in two steps: </div>

      <div className="items-center justify-center">First, we need to deploy your
        very own transaction guard.
        <br />
        <div className="py-4">
          <span className={bold()}>Step 1: </span>
          <DeployTransactionGuardModal />
        </div>
      </div>
      <div>
        In the second step, we need to add the new
        guard to your safe.
        <br />
        <div className="py-4"></div>
        <span className={bold()}>Step 2: </span>
        <ApplyTransactionGuardModal />
      </div>
    </div >
  );
}

export default SetupPage;

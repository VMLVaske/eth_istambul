"use client";

import React from "react";
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
import { useEffect, useState } from "react";
import safeAbi from "../abis/gnosisSafe.json";
import { BrowserProvider, ethers } from "ethers";
import { BaseTransaction } from "@safe-global/safe-apps-sdk";
import * as Constants from "@/app/constants";

export const ApplyTransactionGuardModal = (props: { guardAddress: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { sdk, connected, safe } = useSafeAppsSDK();

  const startTransaction = async (safe: any, guardAddress: any) => {
    const constants = Constants.getConstants(safe.chainId);

    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);

      const safeContract = new ethers.Contract(
        safe.safeAddress,
        safeAbi,
        provider
      );

      console.log(safe.safeAddress);
      console.log(guardAddress);
      const txs: BaseTransaction[] = [
        {
          to: safe.safeAddress,
          value: "0",
          data: safeContract.interface.encodeFunctionData("setGuard", [
            guardAddress,
          ]),
        },
      ];

      const safeTxHash: string = await sdk.txs.send({ txs });

    }
  };

  console.log("my guard: " + props.guardAddress);
  const firstStepDone =
    props.guardAddress !=
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  return (
    <span>
      <Button color="primary" onPress={onOpen} isDisabled={!firstStepDone}>
        Apply Guard to SAFE
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Apply Transaction Guard to your SAFE
              </ModalHeader>
              <ModalBody>
                <span>
                  This will propose a new Transaction to your SAFE to actually
                  apply the new guard to your SAFE.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => startTransaction(safe, props.guardAddress)}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

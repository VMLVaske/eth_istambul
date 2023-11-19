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

export const UpdateUserGroup = (props: { guardAddress: string }) => {
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
  return (
    <span>
      <Button className="button" color="success" onPress={onOpen}>
        Save Changes
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update User Role
              </ModalHeader>
              <ModalBody>Save all changes?</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="button"
                  color="primary"
                  onPress={() => {
                    startTransaction(safe, props.guardAddress);
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

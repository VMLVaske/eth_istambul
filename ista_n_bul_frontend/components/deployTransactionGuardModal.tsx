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
import factoryAbi from "../abis/guardFactory.json";
import { BrowserProvider, ethers } from "ethers";
import { BaseTransaction } from "@safe-global/safe-apps-sdk";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import * as Constants from "@/app/constants";

export const DeployTransactionGuardModal = (props: {
  guardAddress: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { sdk, connected, safe } = useSafeAppsSDK();

  const startTransaction = async (safe: any) => {
    const constants = getConstants(safe.chainId);

    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);

      // console.log(provider);
      const factoryContract = new ethers.Contract(
        constants.FACTORY_ADDRESS,
        factoryAbi,
        provider
      );

      const txs: BaseTransaction[] = [
        {
          to: constants.FACTORY_ADDRESS,
          value: "0",
          data: factoryContract.interface.encodeFunctionData("createGuard", [
            safe.safeAddress,
          ]),
        },
      ];

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: provider,
      });
      const safeService = new SafeApiKit({
        txServiceUrl: constants.GNOSIS_SERVICE,
        ethAdapter,
      });

      console.log(safe.safeAddress);
      // const safeSdk = await Safe.create({
      //   ethAdapter,
      //   safeAddress: safe.safeAddress,
      // });
      // console.log(safeSdk);
      // Returns a hash to identify the Safe transaction
      // const transaction = sdk.safe.
      console.log("Sending tx now!")
      const safeTxHash = await sdk.txs.send({ txs });
      console.log("Tx sent: ", safeTxHash);

      // const deployTransactionGuard =
      //   await factoryContract.populateTransaction.createGuard(
      //     safe.safeAddress
      //   );
    }
  };

  const firstStepDone =
    props.guardAddress !=
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  return (
    <span>
      <Button className="button" color="success" onPress={onOpen} isDisabled={firstStepDone}>
        Deploy Transaction Guard
      </Button>
      <span
        style={{
          marginLeft: "16px",
          display: firstStepDone ? "inline" : "none",
        }}
      >
        &#x2714; done
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deploying Transaction Guard
              </ModalHeader>
              <ModalBody className="modalbody">
                <span>
                  This will propose a new Transaction to your SAFE to deploy the
                  guard, please execute it.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="button" color="success" onPress={() => startTransaction(safe)}>
                  Deploy
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

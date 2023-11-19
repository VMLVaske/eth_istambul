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
import { BrowserProvider, ethers } from "ethers";
import factoryAbi from "@/abis/guardFactory.json";
import guardAbi from "@/abis/transactionGuard.json";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import * as Constants from "@/app/constants";

export const CreateUserRoleModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { sdk, connected, safe } = useSafeAppsSDK();

  const [value, setValue] = React.useState("");
  const startTransaction = async (safe: any) => {
    const constants = Constants.getConstants(safe.chainId);

    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);

      // console.log(provider);
      const factoryContract = new ethers.Contract(
        constants.FACTORY_ADDRESS,
        factoryAbi,
        provider
      );

      const guardAddress = await factoryContract.getGuard(safe.safeAddress);
      const guardContract = new ethers.Contract(
        guardAddress,
        guardAbi,
        provider
      );

      const txs: BaseTransaction[] = [
        {
          to: guardAddress,
          value: "0",
          data: guardContract.interface.encodeFunctionData("createRoleGroup", [
            value,
            [],
            [],
          ]),
        },
      ];

      console.log("Sending tx now!");
      const safeTxHash = await sdk.txs.send({ txs });
      console.log("Tx sent: ", safeTxHash);
    }
  };

  return (
    <span
      style={{
        width: "100%",
        textAlign: "end",
      }}
    >
      <Button className="button" color="success" onPress={onOpen}>
        Create New User Role
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New User Role
              </ModalHeader>
              <ModalBody className="modalbody">
                <Input
                  label="Role Name"
                  labelPlacement="outside-left"
                  value={value}
                  onValueChange={setValue}
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="button"
                  color="success"
                  onPress={() => startTransaction(safe)}
                  isDisabled={value.length <= 0}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

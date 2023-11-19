"use client";

import React from "react";
import react, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";

export const AddOwnerModal = ({ onAdd }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [address, setAddress] = useState("");

  const { sdk, connected, safe } = useSafeAppsSDK();

  function onSubmit() {
    onAdd({ name, address });
  }

  return (
    <span
      style={{
        width: "100%",
        textAlign: "end",
      }}
    >
      <Button className="button" color="success" onPress={onOpen}>
        Add Owner
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Owner
              </ModalHeader>
              <ModalBody className="modalbody">
                <Select
                  label="Select an owner"
                  labelPlacement="outside-left"
                  className="max-w-xs"
                  onSelectionChange={setAddress}
                >
                  {safe.owners.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="button"
                  color="success"
                  isDisabled={address.length <= 0}
                  onPress={() => {
                    onSubmit();
                    onClose();
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

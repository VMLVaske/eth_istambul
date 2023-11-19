"use client";

import React, { useState } from "react";
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
import { isValidEthAddress } from "@/tools/validateEthAddress";

export const AddContractModal = ({ onAdd }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: any) => {
    const input = e.target.value;
    setAddress(input);
    setIsValid(!input || isValidEthAddress(input)); // Check validity
  };

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
        Add Contract
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Contract
              </ModalHeader>
              <ModalBody className="modalbody">
                <Input
                  label="Name"
                  value={name}
                  onValueChange={setName}
                  labelPlacement="outside-left"
                />
                <span
                  style={{
                    margin: "0px",
                    padding: "0px",
                    color: "red",
                    visibility: isValid ? "hidden" : "visible",
                    fontSize: "smaller",
                  }}
                >
                  Please enter a valid ethereum address
                </span>
                <Input
                  type="string"
                  label="Address"
                  value={address}
                  onChange={handleChange}
                  labelPlacement="outside-left"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="button"
                  color="success"
                  onPress={() => {
                    onSubmit();
                    onClose();
                  }}
                  isDisabled={!isValid || name.length <= 0}
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

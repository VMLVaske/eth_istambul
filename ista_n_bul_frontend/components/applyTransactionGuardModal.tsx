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

export const ApplyTransactionGuardModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <span>
      <Button className="button" color="success" onPress={onOpen}>
        Apply Guard to your SAFE
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deploying Transaction Guard
              </ModalHeader>
              <ModalBody className="modalbody">
                <span>
                  A new Transaction is proposed to your SAFE to apply your Guard to your SAFE, please execute it.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="button" color="success" onPress={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
};

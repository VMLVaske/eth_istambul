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

export const DeployTransactionGuardModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <span>
      <Button color="primary" onPress={onOpen}>
        Deploy Transaction Guard
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deploying Transaction Guard
              </ModalHeader>
              <ModalBody>
                <span>
                  A new Transaction is proposed to your SAFE to deploy the
                  guard, please execute it.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
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

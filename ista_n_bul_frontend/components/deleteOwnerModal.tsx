"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react"
import { isValidEthAddress } from "@/tools/validateEthAddress";

export const DeleteOwnerModal = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <span>
            <Button color="danger" variant="light" onPress={onOpen}>Delete</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete User</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to delete this user?</p>
                                <p>This action is permanent. </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </span>
    )
};

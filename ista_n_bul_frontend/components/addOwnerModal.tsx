"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

export const AddOwnerModal = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <span>
            <Button className="button" color="success" onPress={onOpen}>Add Owner</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Owner</ModalHeader>
                            <ModalBody className="modalbody">
                                <Input label="Owner"/>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className="button" color="success" onPress={onClose}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </span>
    )
};

"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

export const CreateUserRoleModal = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <span>
            <Button className="button" color="success" onPress={onOpen}>Create New User Role</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create New User Role</ModalHeader>
                            <ModalBody className="modalbody">
                                <Input label="Role Name" labelPlacement="outside-left"></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className="button" color="success" onPress={onClose}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </span>
    )
};

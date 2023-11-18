"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react"
import { isValidEthAddress } from "@/tools/validateEthAddress";

export const AddContractModal = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [address, setAddress] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e: any) => {
        const input = e.target.value;
        setAddress(input);
        setIsValid(!input || isValidEthAddress(input)); // Check validity
    };

    return (
        <span>
            <Button color="primary" onPress={onOpen}>Add Contract</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Contract</ModalHeader>
                            <ModalBody>
                                <Input label="Name" />
                                <Input
                                    type="string"
                                    label="Address"
                                    value={address}
                                    onChange={handleChange}
                                    isInvalid={!isValid}
                                    errorMessage="Please enter a valid ethereum address" />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
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

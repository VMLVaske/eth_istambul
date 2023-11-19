"use client";

import { Button, Divider, user } from "@nextui-org/react";
import react, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { title, bold } from "@/components/primitives";

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue,
} from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
// @ts-ignore
import { UpdateUserGroup } from "@/components/updateUserGroup";
import { DeleteContractModal } from "@/components/deleteContractModal";
import { DeleteOwnerModal } from "@/components/deleteOwnerModal";
import { ethers, BrowserProvider } from "ethers";
import * as Constants from "@/app/constants";
import factoryAbi from "@/abis/guardFactory.json";
import guardAbi from "@/abis/transactionGuard.json";
import { InfinitySpin } from "react-loader-spinner";

import { allowedContractsColumns, allowedUsersColumns } from "./tableColumns";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import React from "react";

function DetailsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [groupId, setGroupId] = useState(pathname.split("/")[2]);

    const [groupData, setGroupData] = useState(null);

    const [allowedContractsRows, setAllowedContractsRows] = useState([]);
    const [allowedUserRows, setAllowedUserRows] = useState([]);

    const { sdk, connected, safe } = useSafeAppsSDK();
    const [guardAddress, setGuardAddress] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    function updateTableData(newGroupData) {
        const allowedContracts = [];
        const includedUser = [];

        console.log("groupData: ", newGroupData);
        // if (groupData === null) {
        //   return;
        // }

        newGroupData.whitelistedContracts.forEach((contract) => {
            allowedContracts.push({
                id: contract.contractAddress,
                name: contract.name,
                address: contract.contractAddress,
                delete: contract.contractAddress,
            });
        });

        newGroupData.users.forEach((user) => {
            includedUser.push({
                id: user.address,
                address: user.address,
                delete: user.address,
            });
        });

        console.log("allowedContracts: ", allowedContracts);
        console.log("includedUser: ", includedUser);
        setAllowedContractsRows(allowedContracts);
        setAllowedUserRows(includedUser);
        // });
    }

    useEffect(() => {
        const execute = async () => {
            const constants = Constants.getConstants(safe.chainId);

            // @ts-ignore
            if (window.ethereum) {
                // @ts-ignore
                await window.ethereum.request({ method: "eth_requestAccounts" });
                // @ts-ignore
                const provider = new BrowserProvider(window.ethereum);

                const factoryContract = new ethers.Contract(
                    constants.FACTORY_ADDRESS,
                    factoryAbi,
                    provider
                );

                //console.log("factory contract: ", factoryContract)
                //console.log("Safe address: ", safe.safeAddress)

                const guardAddress = await factoryContract.getGuard(safe.safeAddress);
                //console.log("GuardAddress: ", guardAddress)
                setGuardAddress(guardAddress);

                const guardContract = new ethers.Contract(
                    guardAddress,
                    guardAbi,
                    provider
                );
                //console.log("GuardContract: ", guardContract)
                const userGroup = await guardContract.getRoleGroup(groupId);
                const whitelistedContracts = userGroup.whitelistedContracts.map(
                    (contract) => {
                        return {
                            name: contract.name,
                            contractAddress: contract.contractAddress,
                        };
                    }
                );
                const users = userGroup.users.map((user) => {
                    return {
                        address: user,
                    };
                });
                //const userGroups = await guardContract.getRoleGroup(groupId);
                const newGroupData = {
                    name: userGroup.name,
                    whitelistedContracts,
                    users,
                };
                console.log("useEffect groupData: ", newGroupData);
                setGroupData(newGroupData);

                // setUserGroups(userGroups)
                //console.log("Iser Groups: ", userGroups.toString());

                updateTableData(newGroupData);
                setLoading(false);
            }
            console.log("Starting to execute...");
        };
        execute();
    }, [groupId]);

    function receiveNewContract(item: { name: string; address: string }) {
        console.log("received contract ", item.name, " ", item.address);
        const newGroupData = {
            ...groupData,
            whitelistedContracts: [
                ...groupData.whitelistedContracts,
                { name: item.name, contractAddress: item.address },
            ],
        };
        setGroupData(newGroupData);
        updateTableData(newGroupData);
    }

    function receiveNewUser(item: { address: string }) {
        console.log("received user ", item.address);
        const newGroupData = {
            ...groupData,
            users: [...groupData.users, { address: item.address }],
        };
        setGroupData(newGroupData);
        updateTableData(newGroupData);
    }

    function removeContract(address: string) {
        console.log("received contract ", address);
        console.log("groupData: ", groupData);
        const newGroupData = {
            ...groupData,
            whitelistedContracts: groupData.whitelistedContracts.filter(
                (contract) => contract.contractAddress != address
            ),
        };
        setGroupData(newGroupData);
        updateTableData(newGroupData);
    }

    function removeUser(address: string) {
        console.log("received user ", address);
        console.log("groupData: ", groupData);
        const newGroupData = {
            ...groupData,
            users: groupData.users.filter((user) => user.address != address),
        };
        setGroupData(newGroupData);
        updateTableData(newGroupData);
    }

    const renderContractCell = React.useCallback(
        (item, columnKey) => {
            const cellValue = item[columnKey];

            switch (columnKey) {
                case "name":
                    return (
                        <span
                            style={{
                                display: "inline-block",
                            }}
                        >
                            {item.name}
                        </span>
                    );
                case "address":
                    return (
                        <span
                            style={{
                                display: "inline-block",
                            }}
                        >
                            {item.address}
                        </span>
                    );
                case "delete":
                    return (
                        <Button
                            isIconOnly
                            color="danger"
                            onClick={() => removeContract(item.address)}
                        >
                            <DeleteIcon />
                        </Button>
                    );
                default:
                    return cellValue;
            }
        },
        [groupData]
    );

    const renderUserCell = React.useCallback(
        (item, columnKey) => {
            const cellValue = item[columnKey];

            console.log("renderUserCell: ", item, " ", columnKey);
            switch (columnKey) {
                case "address":
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: "400px",
                            }}
                        >
                            {item.address}
                        </span>
                    );
                case "delete":
                    return (
                        <Button
                            isIconOnly
                            color="danger"
                            onClick={() => removeUser(item.address)}
                        >
                            <DeleteIcon />
                        </Button>
                    );
                default:
                    return cellValue;
            }
        },
        [groupData]
    );

    return (
        <div>
            {isLoading ? (
                <InfinitySpin width="200" color="#12FF80" />
            ) : (
                <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                    <h1 className={title()}>{groupData.name}</h1>
                    <h2 className={bold()}>Allowed Contracts</h2>
                    <Table hideHeader aria-label="user roles table">
                        <TableHeader columns={allowedContractsColumns}>
                            {(column) => (
                                <TableColumn key={column.key}>{column.label}</TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={allowedContractsRows}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderContractCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <AddContractModal onAdd={receiveNewContract} />
                    <Divider />
                    <h2 className={bold()}>Included Users</h2>
                    <Table hideHeader aria-label="user roles table">
                        <TableHeader columns={allowedUsersColumns}>
                            {(column) => (
                                <TableColumn key={column.key}>{column.label}</TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={allowedUserRows}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderUserCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <AddOwnerModal onAdd={receiveNewUser} />
                    <Divider />
                    <UpdateUserGroup guardAddress={guardAddress} />
                </section>
            )}
        </div>
    );
}

export default DetailsPage;

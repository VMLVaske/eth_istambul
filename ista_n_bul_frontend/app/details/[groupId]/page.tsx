'use client';

import { Button, Divider } from "@nextui-org/react";
import react, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { title, bold } from "@/components/primitives";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
import { DeleteContractModal } from "@/components/deleteContractModal";
import { DeleteOwnerModal } from "@/components/deleteOwnerModal";
import { ethers } from "ethers";

import { allowedContractsColumns, allowedUsersColumns } from "./tableColumns";

const allowedContractsRows = [{
    key: "1",
    name: "contract name a",
    address: "contract address a",
    delete: <DeleteContractModal />
}, {
    key: "2",
    name: "contract name b",
    address: "contract address b",
    delete: <DeleteContractModal />
}, {
    key: "3",
    name: "contract name c",
    address: "contract address c",
    delete: <DeleteContractModal />
}]

const allowedUserRows = [{
    key: "1",
    address: "user address a",
    delete: <DeleteOwnerModal />
}, {
    key: "2",
    address: "user address b",
    delete: <DeleteOwnerModal />
}, {
    key: "3",
    address: "user address c",
    delete: <DeleteOwnerModal />
}];

const fetchNumGroups = async (contract: ethers.Contract) => {
    try {
        const numGroups = await contract.numUserRoleGroups();
        return numGroups;
    } catch (error) {
        console.error("Error fetching data:", error);
        return 0;
    }
}

const fetchUserGroups = async (contract: ethers.Contract, numGroups: number) => {
    try {
        // Iterate over the mapping and fetch each user role group
        const userGroups = [];
        for (let i = 0; i < numGroups; i++) {
            const group = await contract.userGroups(i);
            userGroups.push(group);
        }

        return userGroups;
    } catch (error) {
        console.error("Error fetching data:", error);
        return { userGroups: [] };
    }
};

function DetailsPage() {

    const router = useRouter();
    const [groupId, setGroupId] = useState('123');
    const [allowedContractsRows, setAllowedContractsRows] = useState([]);
    const [allowedUserRows, setAllowedUserRows] = useState([]);
    const [numGroups, setNumGroups] = useState(0);

    const contractAddress = "0x00...";
    const contractABI = ["..."];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    useEffect(() => {
        fetchNumGroups(contract).then(fetchedNumGroups => setNumGroups(fetchedNumGroups));
        console.log("numGroups: ", numGroups)
        fetchUserGroups(contract, numGroups).then(fetchedUserGroups => setAllowedUserRows(fetchedUserGroups));
        console.log("allowedContractsRows: ", allowedContractsRows)
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className={title()}>Role {groupId}</h1>
            <h2 className={bold()}>Allowed Contracts</h2>
            <Table hideHeader aria-label="allowed contracts table">
                <TableHeader columns={allowedContractsColumns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={allowedContractsRows}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AddContractModal />
            <Divider />
            <h2 className={bold()}>Allowed Users</h2>
            <Table hideHeader aria-label="allowed contracts table">
                <TableHeader columns={allowedUsersColumns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={allowedUserRows}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AddOwnerModal />
        </section>

    );
}

export default DetailsPage;
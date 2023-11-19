'use client';

import { Button, Divider } from "@nextui-org/react";
import react, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { title, bold } from "@/components/primitives";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
import { DeleteContractModal } from "@/components/deleteContractModal";
import { DeleteOwnerModal } from "@/components/deleteOwnerModal";
import { ethers, BrowserProvider } from "ethers";
import * as Constants from "@/app/constants";
import factoryAbi from "@/abis/guardFactory.json";
import guardAbi from "@/abis/transactionGuard.json";

import { allowedContractsColumns, allowedUsersColumns } from "./tableColumns";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";

function DetailsPage() {

    const router = useRouter();
    const pathname = usePathname();
    const [groupId, setGroupId] = useState(pathname.split('/')[2]);

    const [userGroups, setUserGroups] = useState([]);
    const [allowedContractsRows, setAllowedContractsRows] = useState([]);
    const [allowedUserRows, setAllowedUserRows] = useState([]);

    const { sdk, connected, safe } = useSafeAppsSDK();
    const [guardAddress, setGuardAddress] = useState<string | null>(null);

    const MOCKallowedContractsRows = [{
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
    }];

    const MOCKallowedUserRows = [{
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

    /* useEffect(() => {
        fetchNumGroups(contract).then(fetchedNumGroups => setNumGroups(fetchedNumGroups));
        console.log("numGroups: ", numGroups)
        fetchUserGroups(contract, numGroups).then(fetchedUserGroups => setAllowedUserRows(fetchedUserGroups));
        console.log("allowedContractsRows: ", allowedContractsRows)
    }, []); */

    useEffect(() => {
        const execute = async () => {
            console.log("Executing...")
            const constants = Constants.getConstants(safe.chainId);
            //console.log("Constants: ", constants)

            if (window.ethereum) {
                await window.ethereum.request({ method: "eth_requestAccounts" });
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
                const userGroups = await guardContract.getRoleGroup(1)
                //const userGroups = await guardContract.getRoleGroup(groupId);
                setUserGroups(userGroups)
                //console.log("Iser Groups: ", userGroups.toString());

                // ----- data processing for table formatting ----- 
                let conData = [];
                let usrData = [];
                let contractKey = 1;
                let userKey = 1;

                userGroups.forEach((entry) => {
                    const [username, status, userAddress, contractName, contractAddress] = entry.split(',');
                    conData.push({
                        key: contractKey.toString(),
                        name: contractName,
                        address: contractAddress,
                        delete: <DeleteContractModal />
                    });
                    contractKey++;

                    usrData.push({
                        key: userKey.toString(),
                        address: userAddress,
                        delete: <DeleteOwnerModal />
                    });
                    userKey++;

                    setAllowedContractsRows(conData);
                    //console.log("allowedContractsRows: ", allowedContractsRows)
                    setAllowedUserRows(usrData);
                    //console.log("allowedUserRows: ", allowedUserRows);
                    //return { contractData, userData };
                });
            };
            console.log("Starting to execute...")
            execute();
        }
        execute();
    });

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
                <TableBody items={MOCKallowedUserRows}>
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
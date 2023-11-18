'use client';

import { Button } from "@nextui-org/react";
import react, { useState } from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons";

import { CreateUserRoleModal } from "@/components/createUserRoleModal";

import { ethers } from "ethers";

function OverviewPage(props: { contract: ethers.Contract }) {

    const [groupId, setGroupId] = useState('');
    const router = useRouter();

    const tmpGroupId = 721;

    const fetchData = async () => {
        try {
            const data = await contract.getData();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className={title()}>User Roles</h1>
            <CreateUserRoleModal />
            <Table hideHeader aria-label="user roles table">
                <TableHeader>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>FUNCTION</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>user role A</TableCell>
                        <TableCell>
                            <div className="relative flex items-center gap-2">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Button
                                        color="default"
                                        variant="ghost"
                                        onClick={() => router.push(`/details/${tmpGroupId}`)}>
                                        Details
                                    </Button>
                                </span>
                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <Button
                                        isIconOnly
                                        onClick={() => router.push(`/details/${tmpGroupId}`)}
                                        color="danger">
                                        <DeleteIcon />
                                    </Button>
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>user role A</TableCell>
                        <TableCell>
                            <div className="relative flex items-center gap-2">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Button
                                        color="default"
                                        variant="ghost"
                                        onClick={() => router.push(`/details/${tmpGroupId}`)}>
                                        Details
                                    </Button>
                                </span>
                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <Button
                                        isIconOnly
                                        onClick={() => router.push(`/details/${tmpGroupId}`)}
                                        color="danger">
                                        <DeleteIcon />
                                    </Button>
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>

    );
}

export default OverviewPage;
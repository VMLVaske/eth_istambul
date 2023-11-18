'use client';

import { Button, Divider } from "@nextui-org/react";
import react, { useState } from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
import { DeleteContractModal } from "@/components/deleteContractModal";
import { DeleteOwnerModal } from "@/components/deleteOwnerModal";

function DetailsPage() {


    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className={title()}>Role A</h1>
            <h2 className={subtitle({ class: "mt-4" })}>Allowed Contracts</h2>
            <Table hideHeader aria-label="allowed contracts table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ADDRESS</TableColumn>
                    <TableColumn>DELETE</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>contract name a</TableCell>
                        <TableCell>contract address a</TableCell>
                        <TableCell>
                            <DeleteContractModal />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>contract name b</TableCell>
                        <TableCell>contract address b</TableCell>
                        <TableCell>
                            <DeleteContractModal />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <AddContractModal />
            <Divider />
            <Table hideHeader aria-label="allowed contracts table">
                <TableHeader>
                    <TableColumn>ADDRESS</TableColumn>
                    <TableColumn>DELETE</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>user address a</TableCell>
                        <TableCell>
                            <DeleteOwnerModal />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>user address b</TableCell>
                        <TableCell>
                            <DeleteOwnerModal />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <AddOwnerModal />
        </section>

    );
}

export default DetailsPage;
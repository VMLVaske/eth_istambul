"use client";

import { Button } from "@nextui-org/react";
import react, { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { CreateUserRoleModal } from "@/components/createUserRoleModal";
import * as Constants from "@/app/constants";
import { InfinitySpin } from "react-loader-spinner";
import factoryAbi from "@/abis/guardFactory.json";
import guardAbi from "@/abis/transactionGuard.json";
import { BrowserProvider, ethers } from "ethers";

import { userGroupsColumns } from "./tableColumns";

function OverviewPage(props: any) {
  const router = useRouter();

  const [userGroups, setUserGroups] = useState<
    [{ name: string; id: number }] | null
  >(null);

  const { sdk, connected, safe } = useSafeAppsSDK();
  const [guardAddress, setGuardAddress] = useState([]);
  const [isLoading, setLoading] = useState<boolean>(true);

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

        const guardAddress = await factoryContract.getGuard(safe.safeAddress);
        setGuardAddress(guardAddress);

        const guardContract = new ethers.Contract(
          guardAddress,
          guardAbi,
          provider
        );

        const fetchedGroups = await guardContract.getRoleGroups();
        const userGroups = fetchedGroups.map((group: any) => {
          return {
            name: group.name,
            id: group.id,
            details: group.id,
            delete: group.id,
          };
        });
        setUserGroups(userGroups);
        console.log(userGroups);
        setLoading(false);
      }
    };

    execute();
  }, [safe, guardAddress]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <span
            style={{
              display: "inline-block",
              width: "200px",
            }}
          >
            {item.name}
          </span>
        );
      case "details":
        return (
          <Button
            color="default"
            variant="ghost"
            onClick={() => router.push(`/details/${item.id}`)}
          >
            Details
          </Button>
        );
      case "delete":
        return (
          <Button
            isIconOnly
            onClick={() => router.push(`/details/${item.id}`)}
            color="danger"
          >
            <DeleteIcon />
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      {isLoading ? (
        <InfinitySpin width="200" color="#12FF80" />
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <h2 className={title()}>Existing User Roles</h2>
          <Table hideHeader aria-label="user roles table">
            <TableHeader columns={userGroupsColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={userGroups}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <CreateUserRoleModal />
        </section>
      )}
    </div>
  );
}

export default OverviewPage;

"use client";

import { Button } from "@nextui-org/react";
import react, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { CreateUserRoleModal } from "@/components/createUserRoleModal";
import * as Constants from "@/app/constants";
import { InfinitySpin } from "react-loader-spinner";
import factoryAbi from "@/abis/guardFactory.json";
import guardAbi from "@/abis/transactionGuard.json";
import { BrowserProvider, ethers } from "ethers";

function OverviewPage(props: { contract: ethers.Contract }) {
  const [groupId, setGroupId] = useState("");
  const router = useRouter();

  const tmpGroupId = 721;

  const { sdk, connected, safe } = useSafeAppsSDK();
  const [guardAddress, setGuardAddress] = useState<string | null>(null);

  useEffect(() => {
    const execute = async () => {
      const constants = Constants.getConstants(safe.chainId);

      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
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

        const userGroups = await guardContract.getRoleGroups();
        console.log(userGroups);
      }
    };

    execute();
  }, [safe, guardAddress]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className={title()}>User Roles</h1>
      <div>Guard Address: {guardAddress}</div>
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
                    onClick={() => router.push(`/details/${tmpGroupId}`)}
                  >
                    Details
                  </Button>
                </span>
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Button
                    isIconOnly
                    onClick={() => router.push(`/details/${tmpGroupId}`)}
                    color="danger"
                  >
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
                    onClick={() => router.push(`/details/${tmpGroupId}`)}
                  >
                    Details
                  </Button>
                </span>
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Button
                    isIconOnly
                    onClick={() => router.push(`/details/${tmpGroupId}`)}
                    color="danger"
                  >
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

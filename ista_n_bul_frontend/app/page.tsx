"use client";

import NextLink from "next/link";
import { Link } from "@nextui-org/link";

import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Button } from "@nextui-org/react";
import { CreateUserRoleModal } from "@/components/createUserRoleModal";
import { AddContractModal } from "@/components/addContractModal";
import { AddOwnerModal } from "@/components/addOwnerModal";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";

export default function Home() {
  const { sdk, connected, safe } = useSafeAppsSDK();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>An &nbsp;</h1>
        <h1 className={title({ color: "violet" })}>EthIstanbul&nbsp;</h1>
        <h1 className={title()}>Project</h1>
        <h2 className={subtitle({ class: "mt-4" })}>by jörg and valerie</h2>
        <div>safe address: {safe.safeAddress}</div>
      </div>
      <div>
        <CreateUserRoleModal />
        <AddContractModal />
        <AddOwnerModal />
      </div>
    </section>
  );
}

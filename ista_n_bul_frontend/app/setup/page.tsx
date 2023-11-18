"use client";

import { Button, Divider } from "@nextui-org/react";
import react, { useState } from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

function SetupPage() {
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();

  const handleChange = (e: any) => {
    const input = e.target.value;
    setAddress(input);
  };

  return (
    <div>
      <div>
        This app helps you setting multiple user permissions for the different
        owners of your SAFE. This uses SAFE's guard feature to restrict specific
        users and give them a whitelist of things they can do on-chain.
      </div>
      <div>
        Before we can start, we need to setup a{" "}
        <a
          href="https://help.safe.global/en/articles/40809-what-is-a-transaction-guard"
          target="_blank"
        >
          transaction guard
        </a>{" "}
        to your safe. This happens in two steps. First, we need to deploy your
        very own transaction guard. In the second step, we need to add the new
        guard to your safe.
      </div>
      <div>
        <span>Step 1: </span>
        <Button>Deploy Transaction Guard</Button>
      </div>
      <div>
        <span>Step 2: </span>
        <Button>Apply Guard to your SAFE</Button>
      </div>
    </div>
  );
}

export default SetupPage;

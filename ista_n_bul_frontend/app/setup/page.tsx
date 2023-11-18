'use client';

import { Button, Divider } from "@nextui-org/react";
import react, { useState } from "react";
import { useRouter } from "next/navigation";
import { title, subtitle } from "@/components/primitives";

function SetupPage() {

    const [address, setAddress] = useState('');
    const [isValid, setIsValid] = useState(true);
    const router = useRouter();

    const handleChange = (e: any) => {
        const input = e.target.value;
        setAddress(input);
    };

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className={title()}>Deploy</h1>
            <h2 className={subtitle({ class: "mt-4" })}>Some explanatory text</h2>
            <div>
				<Button>Deploy</Button>
			</div>

            <Divider />

            <h1 className={title()}>Setup</h1>
            <h2 className={subtitle({ class: "mt-4" })}>Some more explanatory text</h2>
            <div>
				<Button>Setup</Button>
			</div>
        </section>

    );
}

export default SetupPage;
"use client";

import LoginFrom from "@/components/login-form";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const { data, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (data?.session && data?.user) {
            router.push("/");
        }
    }, [data]);

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-between h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <LoginFrom />
        </div>
    );
};

export default Page;

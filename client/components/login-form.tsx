"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const LoginFrom = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="flex flex-col gap-6 justify-center itmes-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Image
                    src={"/login.svg"}
                    alt="login"
                    width={500}
                    height={500}
                />
                <h1 className="text-6xl font-extrabold text-indigo-400">
                    Welcom Back! to Trent Cli
                </h1>
                <p className="text-base font-medium text-zinc-400">
                    Login to your account for allowing device flow
                </p>
            </div>
            <Card className="border-dashed border-2">
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant={"outline"}
                                className="w-full h-full"
                                type="button"
                                onClick={() =>
                                    authClient.signIn.social({
                                        provider: "github",
                                        callbackURL: "http://localhost:3000",
                                    })
                                }
                            >
                                <Image
                                    src={"/github.svg"}
                                    alt="github"
                                    height={16}
                                    width={16}
                                    className="size-4 dark:invert"
                                />
                                Continue With Github
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginFrom;

"use client";

import { authClient } from "@/lib/auth-client";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeviceAuthorizationPage = () => {
    const [userCode, setUserCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const formattedCode = userCode
                .trim()
                .replace(/-/g, "")
                .toUpperCase();

            const response = await authClient.device({
                query: { user_code: formattedCode },
            });

            if (response.data) {
                // Redirect to approval page
                router.push(`/approve?user_code=${formattedCode}`);
            }
        } catch (error) {
            setError("Invalid or Expired Code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (value.length > 4) {
            value = value.slice(0, 4) + "-" + value.slice(4, 8);
        }
        setUserCode(value);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <div className="p-3 rounded-lg border-2 border-dashed border-zinc-700">
                        <ShieldAlert className="w-8 h-8 text-yellow-300" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Device Authorization
                        </h1>
                        <p className="text-muted-foreground">
                            Enter Your device code to continue
                        </p>
                    </div>
                </div>
                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="border-2 border-dashed p-6 border-zinc-700 rounded-xl  backdrop-blur-sm"
                >
                    <div className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label
                                htmlFor="code"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Device Code
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={userCode}
                                onChange={handleCodeChange}
                                placeholder="XXXX-XXXX"
                                maxLength={9}
                                className="w-full px-4 py-3 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-zinc-600 font-mono text-center text-lg tracking-widest"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Find this code on the device you want to
                                authorize
                            </p>
                        </div>
                        {/* Error Message  */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-950 border-red-900 text-red-200  text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || userCode.length === 0}
                            className="w-full py-3 px-4 bg-zinc-100 text-zinc-900 font-semibold rounded-lg hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Verifying..." : "Continue"}
                        </button>
                        {/* Info Box */}

                        <div className="p-4 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This Code is unique to your device and will
                                expire shortly. Keep it confidential and never
                                share with anyone.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeviceAuthorizationPage;

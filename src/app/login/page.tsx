"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState<User>({ email: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const onLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isValid = user.email.length > 0 && user.password.length > 0;
        setButtonDisabled(!isValid);
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold">{loading ? "Processing..." : "Login"}</h1>
            <hr className="my-4" />
            <form>
                <label className="block mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="p-2 border w-full border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                />
                <label className="block mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className="p-2 border w-full border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="password"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder="password"
                />
                <button
                    onClick={onLogin}
                    className={`p-2 border border-gray-300 w-full rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${buttonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                        }`}
                    disabled={buttonDisabled}
                >
                    {buttonDisabled ? "Login" : "Login"}
                </button>
            </form>
            <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                Don&apos;t have an account? Sign up
            </Link>
        </div>
    );
}
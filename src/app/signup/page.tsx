"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignup = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
        } catch (error: any) {
            console.log("Signup failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold mb-4">{loading ? "Processing..." : "Sign up"}</h1>
            <hr className="mb-4" />
            <form>
                <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-200"
                >
                    Username
                </label>
                <input
                    className="p-2 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Username"
                />
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-200"
                >
                    Email
                </label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Email"
                />
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-200"
                >
                    Password
                </label>
                <input
                    className="p-2 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                />
                <button
                    onClick={onSignup}
                    className={`w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${buttonDisabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                    disabled={buttonDisabled}
                >
                    {loading ? "Processing..." : "Sign up"}
                </button>
            </form>
            <p className="text-sm text-gray-600">
                Already have an account? <Link className="hover:font-bold hover:text-white" href="/login">Log in</Link>
            </p>
        </div>
    );
}
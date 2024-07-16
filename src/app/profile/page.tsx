'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const response = await axios.get('/api/users/me');
            setUserData(response.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success('Logout successful!');
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <hr className="mb-4" />
            <p className="text-lg">Profile page</p>
            {userData ? (
                <h2 className="p-1 rounded bg-green-500 mb-4">
                    <Link href={`/profile/${userData._id}`}>{userData._id}</Link>
                </h2>
            ) : (
                <h2 className="p-1 rounded bg-gray-500 mb-4">No data available</h2>
            )}
            <hr className="mb-4" />
            <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Logout
            </button>
            <button
                onClick={getUserData}
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Get User Details
            </button>
        </div>
    );
};

export default ProfilePage;
'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function VerifyEmailPage() {
    const [token, setToken] = useState('')
    const [error, setError] = useState(false)
    const [verified, setVerifies] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail',  {token})
            setVerifies(true)
            setError(false)
            } catch (error: any) {
                setError(true)
                console.log(error.response.data); 
            }
    }

    useEffect(()=>{
        const token = window.location.search.split('=')[1]
        setToken(token || "")
    },[])

    useEffect(()=>{
        if(token.length > 0) {
            verifyUserEmail()
        }
    },[token])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <h1 className="text-4xl">Verify Email</h1>
    <h2 className="p-2 bg-orange-500 my-2 text-black">{token ? `${token}` : "no token"}</h2>
    {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    
                </div>
            )}
        </div>

  )
}


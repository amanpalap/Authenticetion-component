import { connectDB } from "@/dbconfig/dbConfig";
import User from "@/Models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";
import { Verify } from "crypto";
import jwt from 'jsonwebtoken'

connectDB()

export async function POST(request: NextRequest) {
    try {
        // taking data from request
        const reqBody = await request.json()
        const { email, password } = reqBody
        // validation is to be don here
        console.log(reqBody)

        // checking for user exists
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({message: "User does not exists"}, {status: 400})
        }
        console.log("User exists")

        // validating password
        const validPassword = await bcryptjs.compare(password, user.password) //return boolean values

        if(!validPassword){
            return NextResponse.json({message: "Invalid Password"}, {status: 400})
        }

        //creating token data(data to be inserte in token)
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        }

        //generating signed token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

        const response =  NextResponse.json({
            message: "Logedin Successfully",
            success: true
            })
        
        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
import { connectDB } from "@/dbconfig/dbConfig";
import User from "@/Models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";


connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        
        const { username, email, password} = reqBody
           // TODO: Validation
        const user = await User.findOne({email})
        console.log(reqBody)

        if(user){
            return NextResponse.json({message: "User already exists"}, {status: 400})
        }
        
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
                username,
                email,
                password: hashedPassword,
        })

        const savedUser = await newUser.save()  
        console.log(savedUser);

        // email for verification
        const userId = savedUser._id
        await sendEmail({email, emailType: "verify", userId: userId})
        
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        }, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})   
    }
}
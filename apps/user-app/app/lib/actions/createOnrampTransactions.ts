"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import jwt from 'jsonwebtoken'

export async function createOnrampTransactions(provider: string, amount: number) {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user?.id) {
        return { message: "unauthenicated message!" }
    }

    const token = (Math.random() * 1000).toString();
    let value
    try
    {
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token: token, // problem hai ....
                userId: Number(session?.user?.id),
                amount: amount
            }
        })


        if(!process.env.JWT_SECRET)
        {
            throw new Error('jwt not found!')
        }

        
        try
        {
            value = jwt.sign({userId : session?.user?.id, amount : amount as number},process.env.JWT_SECRET as string)
        }
        catch(e)
        {
            console.error(e)
        }
        
    }
    catch(e)
    {
        console.error(e)
    }
    

    return {
        msg: "Done",
        redirectUrl : `http://localhost:3000/api/redirect?userDetails=${value}`
    }
}
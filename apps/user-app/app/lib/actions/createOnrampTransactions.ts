"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function createOnrampTransactions(provider: string, amount: number) {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user?.id) {
        return { message: "unauthenicated message!" }
    }

    const token = (Math.random() * 1000).toString();
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
    }
    catch(e)
    {
        console.error(e)
    }
    

    return {
        msg: "Done",
        redirectUrl : `http://localhost:3000/api/username?userId=${session?.user?.id}&amount=${amount}`
    }
}
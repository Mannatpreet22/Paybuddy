"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client"

export async function p2pTransfer(to : string, amount : number)
{
    const session = await getServerSession(authOptions)
    const from = session?.user?.id

    if(!from)
    {
        return {
            msg  : "User not found!"
        }
    }


    const toUser = await db.user.findFirst({
        where : {
            number : to
        }
    })

    if(!toUser)
    {
        return {
            msg : "User doesnot exist!"
        }
    }

    await db.$transaction(async (tx) => {

        // "locking" in db for chronological transactions
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`

        const fromBalance = await tx.balance.findFirst({
            where : {
                userId : Number(from)
            }
        })

        if(!fromBalance || fromBalance.amount < amount)
        {
            throw new Error("Insufficient Funds!")
        }

        await tx.balance.update({
            where : {
                userId : Number(from)
            },
            data : {
                amount : {
                    decrement : amount
                }
            }
        })

        await tx.balance.update({
            where : {
                userId : Number(toUser.id)
            },
            data  : {
                amount : {
                    increment : amount
                }
            }
        })

        await tx.p2pTransfer.create({
            data : {
                fromUserId : Number(from),
                toUserId : Number(toUser.id),
                amount,
                timestamp : new Date(),
            }
        })

        return {
            msg : "Transfer Successful"
        }
    })

    return {
        msg : "Transfer Failed"
    }
}
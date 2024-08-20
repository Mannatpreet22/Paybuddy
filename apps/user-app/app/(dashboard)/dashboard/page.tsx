import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"


async function getBalance(){

    const session = await getServerSession(authOptions)

    const balance = await prisma.balance.findFirst({
        where : {
            userId : Number(session?.user?.id)
        },
        select : {
            amount : true
        }
    })

    return balance
}

export default async function ()
{
    const balance = await getBalance()

    if(!balance)
    {
        return <div>Balance not found</div>
    }
    
    return <div className="w-full text-4xl flex items-center justify-center">
        Balance - ${balance?.amount/100}
    </div>
}
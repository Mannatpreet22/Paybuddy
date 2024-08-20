import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import prisma from "@repo/db/client"
import { AllTransaction } from "../../../components/AllTransaction"

async function getTransactions(){
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2pTransfer.findMany({
        where : {
            fromUserId : Number(session?.user?.id)
        },
        include : {
            toUser: true
        }
    })

    return txns.map(t => ({
        time : t.timestamp,
        amount : t.amount,
        to : {
            name :t.toUser?.name
        }
    }))
}

export default async function(){
    const transactions = await getTransactions()

    return <div className="w-full p-2">
        <AllTransaction transactions={transactions} />
    </div>
}
import Signin from "@/components/Signin"
import { NextApiRequest, NextApiResponse } from "next"
//import useBalance from "@repo/store/balance"

export default function POST(req: NextApiRequest , res: NextApiResponse)
{
    //const amount = Number(req.headers['amount'] ? req.headers['amount'] : 1)

    // if(!userId || !amount)
    // {
    //     return null
    // }
    
    return <div>
        <Signin></Signin>
    </div>
}
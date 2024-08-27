import { NextRequest, NextResponse } from 'next/server';

let userId = 0
let amount = 0
export async function POST(req: NextRequest) {
    const data = await req.json()
    userId = Number(data.userId)
    amount = Number(data.amount)

    if (!userId || !amount) {
        return NextResponse.json({
            msg: "userId and amount not found!"
        }, { status: 400 })
    }

    return NextResponse.json({
        msg: "Success",
    })
}

export {userId,amount}
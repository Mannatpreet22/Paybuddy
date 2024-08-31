'use server'

import db from "@repo/db/client"
import axios from "axios"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { verify } from 'jsonwebtoken'

type TransferFunds = {
    userDetails : string,
    cardNumber : string,
    password : string
}

interface JwtPayload {
    userId: string
    amount: number
}

export default async function transferAmount({userDetails,cardNumber,password} : TransferFunds){
    const data = decodeJWT(userDetails)
    const userId = data?.userId
    const amount = data?.amount

    if(!userId || !amount)
    {
        throw new Error('userId not found!')
    }

    // find user

    const exisitingUser = await db.bankMock.findFirst({
        where : {
            cardNumber : cardNumber,
        }
    })

    if(!exisitingUser)
    {
        return {
            msg : "User doesnot exist"
        }
    }

    const checkUserPassword = await bcrypt.compare(password,exisitingUser.password)
    if(!checkUserPassword)
    {
        return {
            msg : "Password doesnot match!"
        }
    }

   
    await db.$transaction(async (tnx)=>{
        if(amount > exisitingUser.balance)
        {
            throw new Error("Insufficient Funds!")
        }

        await tnx.bankMock.update({
            where : {
                id : exisitingUser.id
            },
            data : {
                balance : {
                    decrement : amount
                }
            }
        })

        const token = generateRandomToken()
        //const token = "7.947394074054204"
        
        await tnx.bankTransactions.create({
            data : {
                to : "Paybuddy",
                amount : amount,
                timestamp : new Date(),
                userId : exisitingUser.id,
                token : token
            }
        })     

        try{
            await axios.post("http://localhost:3003/HDFCwebhook", {
                token,
                user_identifier : userId,
                amount
            })

        }
        catch(err) {
            console.error(err)
        }
        
    })
    
    return {
        msg : "Funds Transfered!"
    }

}

function generateRandomToken()
{
    const randomValue = crypto.randomBytes(16).toString('hex')
    const date = new Date().toISOString()
    const dataToHash = `${randomValue}-${date}`
    const token = crypto.createHash('sha256').update(dataToHash).digest('hex')

    return token
}

const decodeJWT = (userDetails: string): JwtPayload | null => {
    if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
        throw new Error('Secret not found!')
    }

    try {
        const data =  verify(userDetails, process.env.NEXT_PUBLIC_JWT_SECRET) as JwtPayload
        console.log(data)
        return data
    } catch (e) {
       
        console.error('unknown error',e)
        return null
    }
}
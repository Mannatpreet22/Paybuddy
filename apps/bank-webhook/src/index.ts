import express from "express";
import db from "@repo/db/client";

const app = express()

app.use(express.json())

app.post('/HDFCwebhook',async (req,res) =>{
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }

    console.log(paymentInformation.amount)
    const userInfo = await db.onRampTransaction.findFirst({
        where : {
            userId : Number(paymentInformation.userId),
            status : "Processing",
            amount : paymentInformation.amount
        }           
    })

    if(!userInfo){
        return res.status(411).json({
            message: "Error while processing webhook"
        })
    }

    //updating db
    try { 
        await db.$transaction([
            // checking if the onRamptransactions status is processing or not.

            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            })
        ])

        await db.onRampTransaction.update({
            where : {
                //token : paymentInformation.token,
                id: userInfo.id
            },
            data : {
                status : "Success",
                token : paymentInformation.token
            }
        })

        res.status(200).json({
            msg  : "Transaction Captured!"
        })
    }
    catch(e : any) {
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

    
    
})

app.listen(3003)
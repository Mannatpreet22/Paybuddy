"use client"

import transferAmount from '@/app/lib/actions/transferAmount'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string
    amount: number
}

export default function () {
    const params = useSearchParams()
    const userDetails : string = params.get('userDetails') || ''

    const [userId,setUserId] = useState<number>(0)
    const [amount,setAmount] = useState<number>(0)

    useEffect(()=>{
        if(!userDetails)
            {
                throw new Error('url incorrect!')
            }
        
            if(!process.env.NEXT_PUBLIC_JWT_SECRET)
            {
                throw new Error('secret not found!')
            }
            
            let data
            try
            {   
                data = jwt.verify(userDetails,process.env.NEXT_PUBLIC_JWT_SECRET) as JwtPayload
                setUserId(Number(data.userId))
                setAmount(Number(data.amount))
            }
            catch(e)
            {
                console.log(e)
            }
    },[userId,amount])
    

    console.log(userId)
    console.log(amount)

    const [cardNumber, setCardNumber] = useState("")
    const [password, setPassword] = useState("")

    const handleTransferAmount = async () => {
        try {
            await transferAmount({ userId, amount, cardNumber, password });
        } catch (error) {
            console.error("Error transferring amount:", error);
        }
    };

    return <div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center">
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
                </div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Bank Account Number
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=" XXXXXXXXXXXX1234"
                                onChange={(e) => {
                                    e.preventDefault()
                                    setCardNumber(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=" johndoe@123"
                                onChange={(e) => {
                                    e.preventDefault()
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleTransferAmount}
                        >
                            Sign in
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
}

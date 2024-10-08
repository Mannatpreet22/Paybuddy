"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnrampTransactions } from "../app/lib/actions/createOnrampTransactions";


const SUPPORTED_BANKS = [{
    name: "Scotia Bank",
    redirectUrl: "https://www.scotiabank.com"
}, {
    name: "TD Bank",
    redirectUrl: "https://www.td.com"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl)
    const [value,setValue] = useState(0)
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
            setValue(Number(value))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value : any) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={() => {
                handleOnrampTransactions(provider,value)
            }}>
            Add Money
            </Button>
        </div>
    </div>
</Card>

async function handleOnrampTransactions(provider : string,value : number)
{
    const response = await createOnrampTransactions(provider,value * 100)
    if(response.redirectUrl)
    {
        window.location.href = response.redirectUrl;
    }
    else
    {
        alert(response.message || "Transaction failed!");
    }

}
}
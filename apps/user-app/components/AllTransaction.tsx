import { Card } from "@repo/ui/card"

export const AllTransaction = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        to : { name : string | null }
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Activity
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div className="p-2">
                    <div className="text-sm">
                        {t.to.name? t.to.name[0]?.toUpperCase() + t.to.name.slice(1,t.to.name.length) : "" }
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    - $ {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}
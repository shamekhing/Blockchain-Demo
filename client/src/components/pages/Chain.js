import React from 'react'
import Transactions from '../transactions/Transactions'
import TransactionsFilter from '../transactions/TransactionsFilter'
import Blocks from '../transactions/Blocks'
import BlockTransactions from '../transactions/BlockTransactions'

const Chain = () => {
    return (
        <div className="grid-2 container">
            <div>
                <TransactionsFilter/>
                <Blocks/>
            </div>
            <div>
                <BlockTransactions/>
            </div>
        </div>
    )
}

export default Chain

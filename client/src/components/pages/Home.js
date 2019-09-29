import React from 'react'
import Transactions from '../transactions/Transactions'
import TransactionForm from '../transactions/TransactionForm'
import TransactionsFilter from '../transactions/TransactionsFilter'
const Home = () => {
    return (
        <div className="grid-2 container">
            <div>
                <TransactionForm/>
            </div>
            <div>
                <TransactionsFilter/>
                <Transactions/> 
            </div>
        </div>
    )
}

export default Home

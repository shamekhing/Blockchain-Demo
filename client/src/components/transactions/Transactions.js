import React, {Fragment, useContext,useEffect} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'
import TransactionItem from './TransactionItem'
import Spinner from '../layout/Spinner'

const Transactions = () => {
    
    const transactionsContext = useContext(TransactionsContext) 
    const {transactions, filtered, loading, getTx} = transactionsContext;
    
    //console.log(transactions)
    //console.log(transactionsContext.state)

    useEffect(()=>{
        getTx()
        //console.log(transactions)
    },[])
    return (
        <Fragment>
            {transactions !== null && !loading ?
                <Fragment>
                    {
                    filtered !== null ? 
                    filtered.map(transaction => <TransactionItem key={transaction._id} transaction={transaction}/>) : 
                    transactions.map((transaction,id) => <TransactionItem key={id} transaction={transaction}/>)
                    }
                </Fragment>: 
                <Spinner/> 
            }
        </Fragment>
    )
}

export default Transactions

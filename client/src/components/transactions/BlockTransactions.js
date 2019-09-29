import React, {Fragment, useContext,useEffect} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'
import TransactionItem from './TransactionItem'
import Spinner from '../layout/Spinner'

const BlockTransactions = () => {
    
    const transactionsContext = useContext(TransactionsContext) 
    const {currentBlock, filtered, loading, getChain} = transactionsContext;
    
    //console.log(transactions)
    //console.log(transactionsContext.state)

    useEffect(()=>{
        getChain()
        //console.log(transactions)
    },[])
    return (
        <Fragment>
            {currentBlock !== null && !loading ?
                <Fragment>
                    {
                    filtered !== null ? 
                    filtered.map(transaction => <TransactionItem key={transaction._id} msg="mined" hide={"True"} transaction={transaction}/>) : 
                    currentBlock.map((transaction,id) => <TransactionItem key={id} msg="mined" hide={"True"} transaction={transaction}/>)
                    }
                </Fragment>: 
                <Spinner/> 
            }
        </Fragment>
    )
}

export default BlockTransactions

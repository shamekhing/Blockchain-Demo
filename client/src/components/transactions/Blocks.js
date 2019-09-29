import React, {Fragment, useContext,useEffect} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'
import BlocksItem from './BlocksItem'
import Spinner from '../layout/Spinner'

const Blocks = () => {
    
    const transactionsContext = useContext(TransactionsContext) 
    const {transactions, filtered, loading, getChain} = transactionsContext;
    
    //console.log(transactions)
    //console.log(transactionsContext.state)

    useEffect(()=>{
        getChain()
        //console.log(transactions)
    },[])
    return (
        <Fragment>
            {transactions !== null && !loading ?
                <Fragment>
                    {
                    filtered !== null ? 
                    filtered.map(block => <BlocksItem key={block._id} block={block}/>) : 
                    transactions.map((block,id) => <BlocksItem key={id} block={block}/>)
                    }
                </Fragment>: 
                <Spinner/> 
            }
        </Fragment>
    )
}

export default Blocks

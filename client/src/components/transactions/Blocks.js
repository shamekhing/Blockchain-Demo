import React, {Fragment, useContext,useEffect} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'
import BlocksItem from './BlocksItem'
import Spinner from '../layout/Spinner'

const Blocks = () => {
    
    const transactionsContext = useContext(TransactionsContext) 
    const {chain, filteredBlocks, loading, getChain} = transactionsContext;
    
    //console.log(transactions)
    //console.log(transactionsContext.state)

    useEffect(()=>{
        getChain()
        //console.log(transactions)
    },[])
    return (
        <Fragment>
            {chain !== null && !loading ?
                <Fragment>
                    {
                    filteredBlocks !== null ? 
                    filteredBlocks.map(block => <BlocksItem key={block._id} block={block}/>) : 
                    chain.map(block => <BlocksItem key={block._id} block={block}/>)
                    }
                </Fragment>: 
                <Spinner/> 
            }
        </Fragment>
    )
}

export default Blocks

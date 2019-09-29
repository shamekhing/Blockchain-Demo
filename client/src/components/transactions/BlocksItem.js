import React, {useContext} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'

const BlocksItem = ({block}) => {
    //console.log(transaction)
    const transactionsContext = useContext(TransactionsContext);
    const {deleteTx, setCurrentBlock, clearCurrent} = transactionsContext
    const {_id,index,timestamp,proof,transactions,previous_hash} = block
    //console.log(block)

    return (
        <div className="card bg-light">
            <h3 className="text-primary text-left">{_id}</h3>
            <span className="badge badge-success">Mined</span>
            <ul className="list">
                <li><i className="fas fa-list-ol"></i> {index}</li>
                <li><i className="fas fa-clock"></i> {timestamp}</li>
                <li><i className="fas fa-search-dollar"></i> {proof}</li>
                <li><i className="fas fa-hashtag"></i> {previous_hash}</li>
            </ul>
            <p>
                <button
                className='btn btn-dark btn-sm'
                    onClick={() => setCurrentBlock(transactions)}
                >
                Show Transactions
                </button>
            </p>
        </div>
    )
}

export default BlocksItem
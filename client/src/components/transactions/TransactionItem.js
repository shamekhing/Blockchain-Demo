import React, {useContext, Fragment} from 'react'
import TransactionsContext from '../../context/transactions/transactionsContext'

const TransactionItem = ({transaction}) => {
    //console.log(transaction)
    const transactionsContext = useContext(TransactionsContext);
    const {deleteTx, setCurrent, clearCurrent} = transactionsContext
    const {_id, sender, receiver, amount} = transaction
    //console.log(_id)
    
    const onDelete = () => {
        deleteTx(_id);
        clearCurrent();
    };

    return (
        <div className="card bg-light">
            <h3 className="text-primary text-left">{_id}</h3>
            <span className="badge badge-danger">Bending</span>
            <ul className="list">
                <li><i className="fas fa-share"></i> {sender}</li>
                <li><i className="fas fa-share-square"></i> { receiver}</li>
                <li><i className="fas fa-hand-holding-usd"></i> { amount}</li>
            </ul>
         
             <p>
                <button
                className='btn btn-dark btn-sm'
                    onClick={() => setCurrent(transaction)}
                >
                Edit
                </button>
                <button className='btn btn-danger btn-sm' 
                    onClick={onDelete}
                >
                Delete
                </button>
            </p>
        </div>
    )
}

export default TransactionItem
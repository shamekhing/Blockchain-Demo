import React, { useState, useContext, useEffect } from 'react';
import TransactionsContext from '../../context/transactions/transactionsContext'


const TransactionForm = () => {
  
    const transactionsContext = useContext(TransactionsContext);

    const { current, clearCurrent,updateTx,mineBlock } = transactionsContext;

  useEffect(() => {

    /*if(sender===''||receiver===''|amount===''){

    }
    else*/
    {
      if (current !== null) {
        setTransaction(current);
      } 
      else 
      {
        setTransaction({
          sender: '',
          receiver: '',
          amount: '',
        });
      }
    }
  }, [transactionsContext, current]);


  const [transaction, setTransaction] = useState({
    sender: '',
    receiver: '',
    amount: ''
  });

  const { sender, receiver, amount } = transaction;

  const onChange = e =>
    setTransaction({ ...transaction, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      transactionsContext.addTx(transaction);
    } else {
      updateTx(transaction);
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };
  
  
  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
      {current ? 'Edit Transaction' : 'Add Transaction'} 
      </h2>
      <input
        type='text'
        placeholder='sender'
        name='sender'
        value={sender}
        onChange={onChange}
      />
      <input
        type='text'
        placeholder='receiver'
        name='receiver'
        value={receiver}
        onChange={onChange}
      />
      <input
        type='text'
        placeholder='amount'
        name='amount'
        value={amount}
        onChange={onChange}
      />
      
      <div>
        <input
          type='submit'
          value={current ? 'Edit Transaction' : 'Add Transaction'}
          className='btn btn-primary btn-block'
        />
        <button
          className='btn btn-dark btn-sm'
          onClick={() =>  mineBlock()}
        >
          Mine Block
        </button>
      </div>
      {current && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default TransactionForm;

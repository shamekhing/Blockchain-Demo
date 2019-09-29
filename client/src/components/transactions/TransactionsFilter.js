import React, { useContext, useRef, useEffect } from 'react';
import TransactionsContext from '../../context/transactions/transactionsContext';

const ContactFilter = () => {
  const transactionsContext = useContext(TransactionsContext);
  const text = useRef('');

  const { filterTx, clearFilter, filtered } = transactionsContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = e => {
    if (text.current.value !== '') {
      filterTx(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Transactions...'
        onChange={onChange}
      />
    </form>
  );
};

export default ContactFilter;

import React, { useContext, useRef, useEffect } from 'react';
import TransactionsContext from '../../context/transactions/transactionsContext';

const BlocksFilter = () => {
  const transactionsContext = useContext(TransactionsContext);
  const text = useRef('');

  const { filterBlocks , filteredBlocks } = transactionsContext;

  useEffect(() => {
    if (filteredBlocks === null) {
      text.current.value = '';
    }
  });

  const onChange = e => {
    if (text.current.value !== '') {
      filterBlocks(e.target.value);
    } else {
    }
  };

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Blocks...'
        onChange={onChange}
      />
    </form>
  );
};

export default BlocksFilter;

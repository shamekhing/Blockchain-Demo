import React, {useReducer} from 'react';
import axios from 'axios' 
import TransactionsContext from './transactionsContext'
import transactionsReducer from './transactionsReducer'

import {
    ADD_Tx,
    DELETE_Tx,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_Tx,
    FILTER_Tx,
    CLEAR_FILTER,
    Tx_ERROR,
    GET_Txs,
    CLEAR_Txs,
    MINE_BLOCK,
    GET_CHAIN,
    CURRENT_BLOCK,
} from '../types'

const TransactionsState = (props) => {
    const intialState = {
        transactions: [],
        chain: [],
        current: null,
        filtered: null,
        error: null,
        loading: false,
        currentBlock: []
    }
    const [state, dispatch] = useReducer(transactionsReducer, intialState)
    // actions

    // get Txs
    // add Tx    
    const getTx = async () => {

        try {
            const res = await axios.get('http://localhost:5000/get_transactions');
            //console.log(res)
            //state.loading=true
            dispatch({
                type: GET_Txs, 
                payload: res.data.chain
            })
            
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
    }
    // Get Contacts
  
    // add Tx    
    const addTx = async (transaction) => {
        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        };     
        
        try {
            const res = await axios.post('http://localhost:5000/add_transaction', transaction, config);
            dispatch({
                type: ADD_Tx, 
                payload: res.data.chain
            })
            //console.log(res.data.chain)
            //console.log(state)
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
    }
    // del Tx
    const deleteTx = async(_id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/delete_transaction?_id=${_id}`);
            dispatch({
                type: DELETE_Tx, 
                payload: _id
            })
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
        getTx()
    }
     // upd Tx
     const updateTx = async(transaction) => {
        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        };     
        const {sender, receiver, amount} = transaction
        console.log(transaction)
        const data = {
            sender:sender,
            receiver:receiver,
            amount:amount
        }
        try {
            const res = await axios.put(`http://localhost:5000/update_transaction?_id=${transaction._id}`, data, config);
            dispatch({
                type: UPDATE_Tx, 
                payload: transaction
            })
            getTx()
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
        
    }
    // set current Tx
    const setCurrent = (transaction) => {
        dispatch({type: SET_CURRENT, payload: transaction})
    }
    // set current Tx
    const clearCurrent = () => {
        dispatch({type: CLEAR_CURRENT})
    }
    // fil Tx
    const filterTx = (text) => {
        dispatch({type: FILTER_Tx, payload: text})
    }
    // cle filter
    const clearFilter = (text) => {
        dispatch({type: CLEAR_FILTER})
    }
    // mine block
    const mineBlock = async(transaction) => {
        //console.log(transaction)
        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        };     
        try {
            const res = await axios.post('http://localhost:5000/mine_block', transaction, config);
            dispatch({
                type: MINE_BLOCK, 
                payload: res
            })
            //console.log(res.data.chain)
            console.log(res)
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
    }
    const getChain = async() => {
        try {
            const res = await axios.get('http://localhost:5000/get_chain');
            console.log(res)
            //state.loading=true
            dispatch({
                type: GET_CHAIN, 
                payload: res.data.chain
            })
            
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
            getChain()
        }
    }
    const setCurrentBlock = (transactions) => {
        console.log(transactions)
        dispatch({
            type: CURRENT_BLOCK,
            payload: transactions
          });
    }

    return (
        <TransactionsContext.Provider
            value = {{
                transactions: state.transactions,
                filtered : state.filtered,
                current: state.current,
                error: state.error,
                currentBlock:state.currentBlock,
                addTx,
                deleteTx,
                updateTx,
                filterTx,
                setCurrent,
                clearCurrent,
                clearFilter,
                getTx,
                mineBlock,
                getChain,
                setCurrentBlock,
            }}
        >
            {props.children}
        </TransactionsContext.Provider>
    )
}

export default TransactionsState
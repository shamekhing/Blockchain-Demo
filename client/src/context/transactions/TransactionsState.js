import React, {useReducer, useContext} from 'react';
import axios from 'axios' 
import TransactionsContext from './transactionsContext'
import transactionsReducer from './transactionsReducer'

import AlertContext from '../alert/alertContext';

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
    MINE_BLOCK,
    GET_CHAIN,
    CURRENT_BLOCK,
    FILTER_BLOCKS
} from '../types'

const TransactionsState = (props) => {
    const intialState = {
        chain: [],
        transactions: [],
        filtered: null,
        filteredBlocks : null,
        current: null,
        currentBlock: [],
        error: null,
        loading: false,
    }
    const [state, dispatch] = useReducer(transactionsReducer, intialState)
 
    // alerts
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

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
            setAlert(res.data.msg)
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
    }
    // check if any field empty
    const checkProperties = (obj) => {
        for (var key in obj) {
            if (obj[key] === null && obj[key] == "")
                return true;
        }
        return false;
    }
    // add Tx    
    const addTx = async (transaction) => {
        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        };     
        const {sender, receiver, amount} = transaction
        if (sender ==''|| receiver==''|| amount==''){
            setAlert("please enter all fields")
        }
        else
        {
            try {
                const res = await axios.post('http://localhost:5000/add_transaction', transaction, config);
                dispatch({
                    type: ADD_Tx, 
                    payload: res.data.chain
                })
                setAlert(res.data.msg)
            } 
            catch (err) {
                dispatch({
                type: Tx_ERROR,
                payload: err.response.msg
                });
            }
            getChain()
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
            setAlert(res.data.msg)
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
        //console.log(transaction)
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
            setAlert(res.data.msg)
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
    const mineBlock = async() => {
        //console.log(transaction)
        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        };     
        try {
            const res = await axios.post('http://localhost:5000/mine_block', {"sender":"system","receiver":"miner","amount":"reward"}, config);
            dispatch({
                type: MINE_BLOCK, 
                payload: res
            })
            setAlert(res.data.msg)
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
        getChain()
    }
    const getChain = async() => {
        try {
            const res = await axios.get('http://localhost:5000/get_chain');
            //console.log(res)
            //state.loading=true
            dispatch({
                type: GET_CHAIN, 
                payload: res.data.chain
            })
            setAlert(res.data.msg)
        } 
        catch (err) {
            dispatch({
              type: Tx_ERROR,
              payload: err.response.msg
            });
        }
    }
    // bring selected block transactions
    const setCurrentBlock = (transactions) => {
        //console.log(transactions)
        dispatch({
            type: CURRENT_BLOCK,
            payload: transactions
          });
          console.log(state)
    }
    // filter blocks
    const filterBlocks = (text) => {
        dispatch({type: FILTER_BLOCKS, payload: text})
        //console.log(state.filterBlocks)
    }
    return (
        <TransactionsContext.Provider
            value = {{
                chain:state.chain,
                transactions: state.transactions,
                filtered : state.filtered,
                filteredBlocks: state.filteredBlocks,
                current: state.current,
                currentBlock:state.currentBlock,
                error: state.error,
                
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
                filterBlocks,
            }}
        >
            {props.children}
        </TransactionsContext.Provider>
    )
}

export default TransactionsState
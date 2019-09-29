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
    FILTER_BLOCKS,
} from '../types'

export default (state, action) => {
    switch (action.type) {
        case GET_Txs:
            return {
                ...state,
                loading: false,
                transactions: action.payload,
            }
        case ADD_Tx:
            return {
                ...state,
                loading: false,
                transactions: action.payload,
            } 
        case UPDATE_Tx:
            return {
                ...state,
                loading: false,
                transactions: state.transactions.map(transaction => 
                    transaction._id === action.payload._id ? action.payload : transaction)
            }
        case DELETE_Tx:
            return {
                ...state,
                loading: false,
                transactions: state.transactions.filter(
                    transaction => transaction._id !== action.payload
                )
            } 
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT:
                return {
                    ...state,
                    current: null
                }
        case FILTER_Tx:
            return {
                ...state,
                filtered: state.transactions.filter(transaction => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return transaction._id.match(regex) || transaction.sender.match(regex);
                })
            };
        case FILTER_BLOCKS:
            console.log(state)
            return {
                ...state,
                filteredBlocks: state.chain.filter(block => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return block._id.match(regex) //|| block.index.match(regex);
                })
            };
        case CLEAR_FILTER:
            return {
            ...state,
            filtered: null
            };
        case Tx_ERROR:
                return {
                    ...state,
                    error: action.payload
            };
        case MINE_BLOCK: 
            return {
                ...state,
                transactions:[],
                currentBlock:[]
            }
        case GET_CHAIN:
            return{
                ...state,
                chain: action.payload
            }
        case CURRENT_BLOCK:
            return{
                ...state,
                currentBlock: action.payload
            }
        default: 
            return state
    }
}
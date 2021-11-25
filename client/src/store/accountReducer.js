// action - state management
import { ACCOUNT_INITIALIZE, SPLITTERS_LOADED, SPLITTER_CREATED } from './actions';

export const initialState = {
    address: '',
    splitters: [],

};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { account } = action.payload;
            return {
                ...state,
                address: account
            };
        }
        case SPLITTERS_LOADED: {
            const { splitters } = action.payload;

            return {
                ...state,
                splitters: splitters
            };
        }
        case SPLITTER_CREATED: {
            const { splitter } = action.payload;
            const newList = [splitter, ...state.splitters]
            console.log('newList', newList);
            return {
                ...state,
                splitters: newList
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;

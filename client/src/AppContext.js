import React, {createContext, useReducer} from 'react';

const initialContext = {
    ethBalance: '--',
    setEthBalance: () => {
    },
    cTokenBalance: '--',
    setCTokenBalance: () => {
    },
    exchangeRate: 0,
    setExchangeRate: () => {
    },
    isWalletConnectionModalOpen: false,
    setWalletConnectModal: () => {
    },
    txnStatus: 'NOT_SUBMITTED',
    setTxnStatus: () => {
    },
    nft: { },
    setNFT: () => { },
    proxyAddress: '',
    setProxyAddress: () => { },
    errorMessage: '',
    setErrorMessage: () => { }
};

const appReducer = (state, {type, payload}) => {
    switch (type) {

        case 'SET_NFT':
            return {
                ...state,
                nft: payload,
            };
        case 'SET_PROXY_ADDRESS':
            return {
                ...state,
                proxyAddress: payload,
            };
        case 'SET_ERROR_MESSAGE':
            return {
                ...state,
                errorMessage: payload,
            };


        case 'SET_EXCHANGE_RATE':
            return {
                ...state,
                exchangeRate: payload,
            };

        case 'SET_WALLET_MODAL':
            return {
                ...state,
                isWalletConnectModalOpen: payload,
            };

        case 'SET_TXN_STATUS':
            return {
                ...state,
                txnStatus: payload,
            };
        default:
            return state;
    }
};

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({children}) => {
    const [store, dispatch] = useReducer(appReducer, initialContext);

    const contextValue = {

        nft: store.nft,
        setNFT: (nft) => {
            dispatch({type: 'SET_NFT', payload: nft});
        },
        proxyAddress: store.proxyAddress,
        setProxyAddress: (address) => {
            dispatch({type: 'SET_PROXY_ADDRESS', payload: address});
        },

        isWalletConnectModalOpen: store.isWalletConnectModalOpen,
        setWalletConnectModal: (open) => {
            dispatch({type: 'SET_WALLET_MODAL', payload: open});
        },
        txnStatus: store.txnStatus,
        setTxnStatus: (status) => {
            dispatch({type: 'SET_TXN_STATUS', payload: status});
        },
        errorMessage: store.errorMessage,
        setErrorMessage: (status) => {
            dispatch({type: 'SET_ERROR_MESSAGE', payload: status});
        }
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

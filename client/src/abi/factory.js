import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';


const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO: remove hardcoded address
    const address = '0xd952634001501f45c84bFCC6f5CAFDC198d11BFb';

    return {abi, address};
}

export default Factory;
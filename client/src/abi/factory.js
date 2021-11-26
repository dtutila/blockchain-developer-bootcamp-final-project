import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO:remove hardcoded address
    const address = '0xbAa6Dc9eDeE873bB4bfC4A4ae6b37ecca79eFAda';

    return {abi, address};
}

export default Factory;
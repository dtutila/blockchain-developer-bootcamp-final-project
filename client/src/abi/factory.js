import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO:remove hardcoded address
    const address = '0x72D7553A3CA643FC6a81Dd97f4f28A7793Ed74A2';

    return {abi, address};
}

export default Factory;
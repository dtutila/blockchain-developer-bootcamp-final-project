import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO:remove hardcoded address
    const address = '0x6916178ea7F5a383C401B57F4Daa2141A9d021c0';

    return {abi, address};
}

export default Factory;
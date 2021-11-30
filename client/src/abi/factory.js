import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';


const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO: remove hardcoded address
    const address = '0xEF2d9C56b7a66Dee65B8De5402cb9E8f9Ef9Bd83';

    return {abi, address};
}

export default Factory;
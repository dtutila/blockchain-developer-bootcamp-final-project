import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';


const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO: remove hardcoded address
    const address = '0xfE58F03a14a92Ad9030E40FD1dDBaD33b42c2C0D';

    return {abi, address};
}

export default Factory;
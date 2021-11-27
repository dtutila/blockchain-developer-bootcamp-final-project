import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO:remove hardcoded address
    const address = '0x791a28968Ea6EAb6B41f7E66246Ba955E8274C93';

    return {abi, address};
}

export default Factory;
import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;
    //TODO:remove hardcoded address
    const address = '0xE3Ddd7f0198ed115E88b5941f6968e273e058457';

    return {abi, address};
}

export default Factory;
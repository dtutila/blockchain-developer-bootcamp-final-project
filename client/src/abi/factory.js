import React from 'react';
import  factoryJSON from './NFTSplitterFactory.json';
import {useWeb3React} from '@web3-react/core';

const Factory = () => {
    const { chainId } = useWeb3React();
    const abi = factoryJSON.abi;

    const address = '0x87D5644eB6d578eeA49409Cee1316833fc1ead62'; //factoryJSON.networks[chainId].address;// '0x4e454Fe262E43AdA42cB874f0419DCfb38d36329';

    return {abi, address};
}

export default Factory;
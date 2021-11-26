import React from 'react';
import  contractJSON from './NFTSplitter.json';


const NFTSplitter = () => {
  //  const { chainId } = useWeb3React();
    const abi = contractJSON.abi;

 //   const address = '0x87D5644eB6d578eeA49409Cee1316833fc1ead62'; //factoryJSON.networks[chainId].address;// '0x4e454Fe262E43AdA42cB874f0419DCfb38d36329';

    return {abi};
}

export default NFTSplitter;
import React from 'react';
import  contractJSON from './ERC1155.json';


const NFT = () => {
  //  const { chainId } = useWeb3React();
    const abi = contractJSON.abi;
    return {abi};
}

export default NFT;
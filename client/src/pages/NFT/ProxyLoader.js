import React, { useEffect, useState} from 'react';
import NFTTradeCard from './NFTTradeCard';
import {useParams} from 'react-router-dom';
import useTransaction from '../../hooks/useTransaction';
import {useAppContext} from '../../AppContext';
import {useSplitterFactory} from '../../hooks/useSplitterFactory';
import {useWeb3React} from '@web3-react/core';

const ProxyLoader = () => {
    const params = useParams();
    const {  setTxnStatus } = useTransaction();
    const { setNFT } = useAppContext();
     // const [prxAddress, setPrxAddress] = useState('');
    const [nftAddress, setNFTAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const {getProxyAddressByNFT} = useSplitterFactory();
    const { account } = useWeb3React();
    const {proxyAddress, setProxyAddress} = useAppContext();

    useEffect(() => {
        if (account) {
            console.log('proxy....')
            if (!proxyAddress){
                getProxyAddressByNFT(params.nftAddress, params.tokenId);
                console.log('no proxy ....')
            }
            if (proxyAddress) {

            }
        }


    },[account, proxyAddress])
    //setProxyAddress(proxy);
    const successHandler = () => {
        setTxnStatus('NOT_SUBMITTED');
        history.push(`/nft/${nftAddress}/${tokenId}`);
    }


    return (
        <React.Fragment>
        { proxyAddress &&  <NFTTradeCard proxyAddress={proxyAddress}
                      nftAddress={params.nftAddress}
                      tokenId={params.tokenId}


        />}
    { !proxyAddress &&
        <h1>no poxy</h1>
    }</React.Fragment>
    );

}

export default ProxyLoader;
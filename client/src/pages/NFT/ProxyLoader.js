import React, {useEffect, useState} from 'react';
import NFTTradeCard from './NFTTradeCard';
import {useParams} from 'react-router-dom';
import useTransaction from '../../hooks/useTransaction';
import {useAppContext} from '../../AppContext';
import {useSplitterFactory} from '../../hooks/useSplitterFactory';
import {useWeb3React} from '@web3-react/core';
import {AddressZero} from '@ethersproject/constants';
import SplitterCard from '../Splitter/SplitterCard';
import Text from '../../components/Text';
import {Container} from 'react-bootstrap';

const ProxyLoader = () => {
    const params = useParams();
    const {setTxnStatus} = useTransaction();
    const {setNFT} = useAppContext();
    const [validAddress, setValidAddress] = useState(false);
    const [nftAddress, setNFTAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const {getProxyAddressByNFT} = useSplitterFactory();
    const {account} = useWeb3React();
    const {proxyAddress, setProxyAddress} = useAppContext();

    useEffect(() => {
        if (account) {
            console.log('proxy....');
            if (!proxyAddress) {
                getProxyAddressByNFT(params.nftAddress, params.tokenId);
                console.log('no proxy ....');
            }
            if (proxyAddress) {

            }
            setValidAddress(proxyAddress && proxyAddress !== AddressZero);
        }


    }, [account, proxyAddress]);
    //setProxyAddress(proxy);
    const successHandler = () => {
        setTxnStatus('NOT_SUBMITTED');
        history.push(`/nft/${nftAddress}/${tokenId}`);
    };


    return (
        <React.Fragment>
            {validAddress && <NFTTradeCard proxyAddress={proxyAddress}
                                           nftAddress={params.nftAddress}
                                           tokenId={params.tokenId}


            />}
           {!validAddress &&
           <Container>
           <Text > Connect wallet to continue!! </Text></Container>
            }

        </React.Fragment>
    );

};

export default ProxyLoader;
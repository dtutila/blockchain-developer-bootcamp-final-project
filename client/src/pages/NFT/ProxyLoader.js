import React, {useEffect, useState} from 'react';
import NFTTradeCard from './NFTTradeCard';
import {useParams} from 'react-router-dom';
import useTransaction from '../../hooks/useTransaction';
import {useAppContext} from '../../AppContext';
import {useSplitterFactory} from '../../hooks/useSplitterFactory';
import {useWeb3React} from '@web3-react/core';
import {AddressZero} from '@ethersproject/constants';
import Text from '../../components/Text';
import {Container} from 'react-bootstrap';
import useIsValidNetwork from '../../hooks/useIsValidNetwork';

const ProxyLoader = () => {
    const params = useParams();
    const { isValidNetwork } = useIsValidNetwork();
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

    if (!isValidNetwork) {
        return (<Text> Connect to Rinkeby test network or a local network!! </Text>);
    }
    return (
        <React.Fragment>
            {validAddress && <NFTTradeCard proxyAddress={proxyAddress}
                                           nftAddress={params.nftAddress}
                                           tokenId={params.tokenId}


            />}
           {!validAddress &&
           <Container>
           <Text > Create a Splitter for this NFT!! </Text></Container>
            }

        </React.Fragment>
    );

};

export default ProxyLoader;
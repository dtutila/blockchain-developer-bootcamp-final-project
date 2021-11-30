import React, {useEffect, useState} from 'react';
import Text from './Text';
import Card from './Card';
import {colors} from '../theme';
import {useWeb3React} from '@web3-react/core';
import {useAppContext} from '../AppContext';
import {shortenAddress} from '../utils/shortenAddress';
import styled from 'styled-components';

const A = styled.a`

  color: white;

`;
const BalanceCard = () => {
    const {account} = useWeb3React();

    const {nft} = useAppContext();
    const [nftInfo, setNFTInfo] = useState({});

    useEffect(() => {
        if (account) {
            console.log('info', nft);
            setNFTInfo(nft);
        }
    }, [nft]);

    return (
        <React.Fragment>
        {nftInfo.tokenId && account && <Card style={{maxWidth: 420}}>
                     <Text block bold t8 color={colors.primary_light}>
                Name: {nftInfo.name}
            </Text>
                <Text
             block t8 color={colors.primary_light}>
                Original NFT Address: {shortenAddress(nftInfo.nftAddress).toUpperCase()}
            </Text>

             <Text block bold t8 color={colors.primary_light}>
                Token Id: {shortenAddress(nftInfo.tokenId)}
            </Text>
            <Text
                block t8 color={colors.primary_light}>
                Proxy Address: <A href={`https://testnets.opensea.io/assets/${nftInfo.splitterAddress}/${nftInfo.tokenId}`} target={'_blank'}>{shortenAddress(nftInfo.splitterAddress).toUpperCase()}</A>
            </Text>
            <Text block t8 color={colors.primary_light}>
                Owner: { account === nftInfo.originalOwner ? 'YOU' : shortenAddress(nftInfo.originalOwner).toUpperCase()}
            </Text>
            <Text block t8 color={colors.primary_light}>
                Unit Price: {nftInfo.unitPrice} ETH
            </Text>
            <Text block t8 color={colors.primary_light}>
                You own: {nftInfo.nftBalance} of {nftInfo.pieces} pieces.
            </Text>
            <Text block t8 color={colors.primary_light}>
                Extra percentage: {nftInfo.percentage}%
            </Text>

        </Card>
} <div/>
        </React.Fragment>
    )};

export default BalanceCard;

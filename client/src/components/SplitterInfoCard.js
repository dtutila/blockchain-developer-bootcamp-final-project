import React, {useEffect, useState} from 'react';
import Text from './Text';
import Card from './Card';
import {colors} from '../theme';
import {useWeb3React} from '@web3-react/core';
import {useAppContext} from '../AppContext';
import {shortenAddress} from '../utils/shortenAddress';

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

        <Card style={{maxWidth: 320}}>
            <Text block color={colors.primary_light}>
                Name: {nftInfo.name}
            </Text>
            <Text block color={colors.primary_light}>
                Unit Price: {nftInfo.unitPrice} ETH
            </Text>
            <Text block color={colors.primary_light}>
                Pieces: {nftInfo.pieces}
            </Text>
            <Text block color={colors.primary_light}>
                Extra percentage: {nftInfo.percentage}%
            </Text>
            <Text block color={colors.primary_light}>
                Original NFT Address: {shortenAddress(nftInfo.nftAddress).toUpperCase()}
            </Text>
        </Card>

    );
};

export default BalanceCard;

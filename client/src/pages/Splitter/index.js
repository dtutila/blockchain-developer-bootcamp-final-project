import React from 'react';
import {Container} from 'react-bootstrap';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import SplitterCard from './SplitterCard';
import NFTCard from './NFTCard';

const Splitter = () => {
    const {isWalletConnectModalOpen} = useWalletConnectionModal();
    return (
        <Container className="container-fluid mt-2">
            {isWalletConnectModalOpen && <ConnectWalletModal />}
            <SplitterCard nftAddress="" tokenId="" tittle="Create a new Splitter (1/3)" />
        </Container>
    );
};

export default Splitter;

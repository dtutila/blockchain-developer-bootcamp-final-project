import React from 'react';
import { Container } from 'react-bootstrap';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import SplitterCard from './SplitterCard';
import NFTCard from './NFTCard';

const Splitter = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="container-fluid mt-2">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      <SplitterCard />
      <NFTCard nftAddress={'0x40D1B812F292DfA3F7a31716f3b368329e17899e'}
               tokenId={'2'}
               proxyAddress={"0xda629203739135cED8C7842aF9f73890E479C827"}/>
    </Container>
  );
};

export default Splitter;

import React from 'react';
import { Container } from 'react-bootstrap';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import SplitterCard from './SplitterCard';

const Splitter = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="mt-2">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      <SplitterCard />
    </Container>
  );
};

export default Splitter;

import React from 'react';
import { Container } from 'react-bootstrap';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import ProxyLoader from './ProxyLoader';



const Splitter = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="container-fluid mt-2">
        <ProxyLoader/>
    </Container>
  );
};

export default Splitter;

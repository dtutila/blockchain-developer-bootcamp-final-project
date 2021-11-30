import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import MetamaskConnectButton from './MetamaskConnectButton';
import BalancesCard from './BalancesCard';
import SplitterInfoCard from './SplitterInfoCard';
import Text from './Text';


const Header = () => {
  return (
    <Navbar className="justify-content-between">
      <SplitterInfoCard />
        {window.ethereum &&
      <MetamaskConnectButton />}
        {!window.ethereum && <div><Text>No Ethereum provider detected!</Text><br/>
            <Text>Please install MetaMask!</Text></div>}
    </Navbar>
  );
};

export default Header;

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import MetamaskConnectButton from './MetamaskConnectButton';
import BalancesCard from './BalancesCard';
import SplitterInfoCard from './SplitterInfoCard';

const Header = () => {
  return (
    <Navbar className="justify-content-between">
      <SplitterInfoCard />
      <MetamaskConnectButton />
    </Navbar>
  );
};

export default Header;

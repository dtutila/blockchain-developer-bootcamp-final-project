import React, {useEffect} from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import MMLogo from '../static/metamask-logo.svg';
import Text from './Text';
import Card from './Card';
import { injected } from '../connectors';
import { shortenAddress } from '../utils/shortenAddress';
import {colors} from '../theme';
import {useAppContext} from '../AppContext';

const MetamaskLogo = styled.img.attrs({
  src: MMLogo,
})`
  height: 32px;
`;

const ConnectBtn2 = styled(Button).attrs({ variant: 'outline-dark' })``;
const ConnectBtn = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${colors.primary_dark};
  color: white;
  font-size: 1em;
  border: 2px solid;
  border-radius: 3px;

`;


const MetamaskConnectButton = () => {
  const { activate, active, account, deactivate } = useWeb3React();
    const { setNFT, setTxnStatus, setErrorMessage } = useAppContext();
  const logOut = () => {
    setNFT({});
    setTxnStatus('');
    setErrorMessage('');
  }

  if (active) {
    return (
      <Card className="d-flex flex-row justify-content-between" style={{ width: 350 }}>
        <MetamaskLogo />
        <Text uppercase color="#E3F2FD" t3 lineHeight="40px" className="mx-4">
          {shortenAddress(account)}
        </Text>
        <ConnectBtn onClick={deactivate} >Log Out</ConnectBtn>
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-row justify-content-between" style={{ width: 200 }}>
      <MetamaskLogo />

      <ConnectBtn primary onClick={() => activate(injected)}>Connect</ConnectBtn>
    </Card>
  );
};

export default MetamaskConnectButton;

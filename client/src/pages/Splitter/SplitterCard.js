import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Text from '../../components/Text';
import BalanceInput from '../../components/BalanceInput';
import Card from '../../components/Card';
// import Button from 'react-bootstrap/Button';

import { ArrowDown } from 'react-bootstrap-icons';
import { useCToken } from '../../hooks/useCToken';
import { useAppContext } from '../../AppContext';
import Spinner from 'react-bootstrap/Spinner';
import useEth from '../../hooks/useEth';
import useTransaction from '../../hooks/useTransaction';
import FieldInput from '../../components/FieldInput';
import { colors } from '../../theme';
import {useSplitterFactory} from '../../hooks/useSplitterFactory';
import {useHistory} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 20px;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${colors.primary_dark};
  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid ;
  border-radius: 3px;
`;

const SplitterCard = (props) => {
  const [nftAddress, setNFTAddress] = useState(props.nftAddress);
  const [tokenId, setTokenId] = useState(props.tokenId);
  const { createSplitter } = useSplitterFactory();
  const history = useHistory();

  const { txnStatus, setTxnStatus } = useTransaction();
  const handleCreationSubmit = () => createSplitter(nftAddress, tokenId);
 const successHandler = () => {
   setTxnStatus('NOT_SUBMITTED');
   history.push(`/nft/${nftAddress}/${tokenId}`);
 }

  if (txnStatus === 'LOADING') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 300 }}>
          <Spinner animation="border" role="status" className="m-auto" />
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'COMPLETE') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 300 }}>
          <Text block center className="mb-5">
            Transaction was successful!
          </Text>
          <Button primary onClick={successHandler}>Continue</Button>
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'ERROR') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 300 }}>
          <Text>Txn ERROR</Text>
          <Button onClick={() => setTxnStatus('NOT_SUBMITTED')}>Go Back</Button>
        </Card>
      </Container>
    );
  }
  return (
    <Container show>
      <Card style={{ maxWidth: 420, minHeight: 300 }}>
        <Text bold block t2  color={colors.primary_light} className="mb-3 text-center">
            {props.tittle}
        </Text>
        <FieldInput value={nftAddress} setValue={setNFTAddress} title="NFT Address:"/>

        <FieldInput value={tokenId} setValue={setTokenId} title="Token Id:" />
        <Button primary  className="mt-3" onClick={handleCreationSubmit}>
         Create
        </Button>
      </Card>
    </Container>
  );
};

export default SplitterCard;

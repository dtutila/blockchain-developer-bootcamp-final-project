import React, { useEffect, useMemo, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import styled from 'styled-components';
import Text from '../../components/Text';
import Card from '../../components/Card';



import { useAppContext } from '../../AppContext';
import Spinner from 'react-bootstrap/Spinner';

import useTransaction from '../../hooks/useTransaction';
import FieldInput from '../../components/FieldInput';
import { colors } from '../../theme';
import {useNFT} from '../../hooks/useNFT';
import {useSplitterContract} from '../../hooks/useNFTSplitter';
import {useWeb3React} from '@web3-react/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
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

const NFTCard = ({proxyAddress, nftAddress, tokenId, ...props}) => {
  const { txnStatus, setTxnStatus } = useTransaction();
  const [price, setPrice ] = useState('');
  const [percentage, setPercentage ] = useState('');
  const [approved, setApproved ] = useState(false);
  const [pieces, setPieces ] = useState('');
  const [value, setValue ] = useState('');
  const { approve } = useNFT(nftAddress);
  const {nft} = useAppContext();
  const { account } = useWeb3React();
  const { splitMyNFT,
      buyBackPieces,
      buyPiecesFromOwner,
      withdrawOriginalNFT,
      getSplitterInfo } = useSplitterContract(proxyAddress);
  //loading
  const account2 = '0xd94550a14B94E8D56142f7874413EA74239bB997';
    console.log('prx', proxyAddress);

    useEffect(()=>{
        getSplitterInfo(nftAddress, tokenId);
    }, []);
    useEffect(()=>{
        console.log('trader =>', nft);
    }, [nft]);

  const handleNFTApprovalSubmit = () => {
     approve(nftAddress, tokenId, proxyAddress).then( () => {
           setTxnStatus('APPROVED');
           console.log('approved!! ')
           setApproved(true);
         }
     );
  }

    const handleSplitSubmit = () => {
      //(tokenId, price, percentage, pieces, initialSupply, lockTime)
        splitMyNFT( tokenId, price, percentage, pieces, pieces, 0).then( () => {
                setTxnStatus('READY');
                console.log('approved!!')
                setApproved(true);
            }
        );
    }
    const handleBuySubmit = () => {
        //(tokenId, price, percentage, pieces, initialSupply, lockTime)
        buyPiecesFromOwner( pieces, value).then( () => {
                setTxnStatus('READY');
                console.log('handleBuySubmit!!')
                setApproved(true);
            }
        );
    }
    const handleBuyBackSubmit = () => {

        buyBackPieces( account2, pieces, value, 0).then( () => {
                setTxnStatus('READY');
                console.log('buyBackPieces!!')
                setApproved(true);
            }
        );
    }
    const handleWithdrawSubmit = () => {
        //(tokenId, price, percentage, pieces, initialSupply, lockTime)
        withdrawOriginalNFT( ).then( () => {
                setTxnStatus('READY');
                console.log('handleWithdrawSubmit!!')
                setApproved(true);
            }
        );
    }


    if (txnStatus === 'LOADING') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Spinner animation="border" role="status" className="m-auto" />
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'COMPLETE') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Text block center className="mb-5">
            Txn Was successful!
          </Text>
          <Button onClick={() => setTxnStatus('NOT_SUBMITTED')}>Go Back</Button>
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'ERROR') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Text>Txn ERROR</Text>
          <Button onClick={() => setTxnStatus('NOT_SUBMITTED')}>Go Back</Button>
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'PENDING_APPROVAL') {
    return (
        <Container show>
          <Card style={{maxWidth: 420, minHeight: 400}}>
            <Text bold block t2 color={colors.primary_light} className="mb-3">
              Approve Splitter Contract
            </Text>

              <Text bold block t4 color={colors.primary_light} className="mb-3">
                  NFT:  <a href={`https://testnets.opensea.io/assets/${nftAddress}/${tokenId}`} target="_blank"> {nftAddress} </a>
              </Text>

              <Text bold block t4 color={colors.primary_light} className="mb-3">
                  Token Id: {tokenId}
              </Text>

            <Button primary className="mt-3" onClick={handleNFTApprovalSubmit}>
              Approve
            </Button>
          </Card>
        </Container>
    );
  }

  if (txnStatus === 'APPROVED') {
      return (
          <Container show>
              <Card style={{maxWidth: 420, minHeight: 400}}>
                  <Text bold block t2 color={colors.primary_light} className="mb-3">
                      Split my NFT
                  </Text>
                  <FieldInput value={pieces} setValue={setPieces} title="Pieces" />
                  <FieldInput value={price} setValue={setPrice} title="Price" />
                  <FieldInput value={percentage} setValue={setPercentage} title="Percentage" />

                  <Button primary className="mt-3" onClick={handleSplitSubmit}>
                      Split
                  </Button>
              </Card>
          </Container>
      );

  }


    if (txnStatus === 'READY') {
        return (
            <Container show>
                <Card style={{maxWidth: 420, minHeight: 400}}>
                    <Text bold block t2 color={colors.primary_light} className="mb-3">
                        Trade {nft.name}
                    </Text>
                    <FieldInput value={pieces} setValue={setPieces} title="Pieces" />
                    <FieldInput value={value} setValue={setValue} title="eth" />


                    <Button primary className="mt-3" onClick={handleBuySubmit}>
                        Buy Pieces
                    </Button>
                    <Button primary className="mt-3" onClick={handleBuyBackSubmit}>
                        Buy BACK
                    </Button>
                    <Button primary className="mt-3" onClick={handleWithdrawSubmit}>
                        Withdraw
                    </Button>
                </Card>
            </Container>
        );

    }

    return (
        <Container show>
          <Card style={{maxWidth: 420, minHeight: 400}}>
            <Text bold block t2 color={colors.primary_light} className="mb-3">
             -------
            </Text>


            <Button primary className="mt-3" onClick={handleNFTApprovalSubmit}>
              Approve
            </Button>
          </Card>
        </Container>
    );



};

export default NFTCard;

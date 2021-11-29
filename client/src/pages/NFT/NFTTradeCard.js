import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Text from '../../components/Text';
import Card from '../../components/Card';


import {useAppContext} from '../../AppContext';
import Spinner from 'react-bootstrap/Spinner';

import useTransaction from '../../hooks/useTransaction';
import FieldInput from '../../components/FieldInput';
import {colors} from '../../theme';
import {useNFT} from '../../hooks/useNFT';
import {useSplitterContract} from '../../hooks/useNFTSplitter';
import {useWeb3React} from '@web3-react/core';
import OwnersCard from './OwnersCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 10px;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 10px;
  padding-left: 10px;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${colors.primary_dark};
  color: ${props => props.primary ? 'white' : 'palevioletred'};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid;
  border-radius: 3px;
`;

const NFTCard = ({proxyAddress, nftAddress, tokenId, ...props}) => {
    const {txnStatus, setTxnStatus} = useTransaction();
    const [price, setPrice] = useState('');
    const [percentage, setPercentage] = useState('');
    const [approved, setApproved] = useState(false);
    const [pieces, setPieces] = useState('');
    const [value, setValue] = useState('');
    const {approve} = useNFT(nftAddress);
    const {nft, errorMessage, setErrorMessage} = useAppContext();
    const {account} = useWeb3React();

    const {
        splitMyNFT,
        buyBackPieces,
        buyPiecesFromOwner,
        withdrawOriginalNFT,
        getSplitterInfo
    } = useSplitterContract(proxyAddress);

    console.log('txnStatus', txnStatus);


    useEffect(() => {
        getSplitterInfo(nftAddress, tokenId);
    }, []);
    useEffect(() => {
        console.log('trader =>', nft);
        console.log('errorMessage =>', errorMessage);
    }, [nft, errorMessage]);

    const continueHandler = () => {
        setTxnStatus('NOT_SUBMITTED')
        getSplitterInfo(nftAddress, tokenId);
    }

    const handleNFTApprovalSubmit = () => {
        approve(nftAddress, tokenId, proxyAddress).then(() => {
               // setTxnStatus('APPROVED');
                console.log('approved!! ');
                setApproved(true);
            }
        );
    };

    const handleSplitSubmit = () => {
        //(tokenId, price, percentage, pieces, initialSupply, lockTime)
        splitMyNFT(tokenId, price, percentage, pieces, pieces, 0).then(() => {

                console.log('approved!!');
                setApproved(true);
            }
        );
    };
    const handleBuySubmit = (from, pieces, value) => {
        //(tokenId, price, percentage, pieces, initialSupply, lockTime)
        buyPiecesFromOwner(pieces, value).then(() => {
                console.log('handleBuySubmit!!');
                setApproved(true);
            }
        );
    };
    const handleBuyBackSubmit = (from, pieces, value) => {
        setTxnStatus('LOADING');
        console.log('handleBuyBackSubmit!!', from, pieces, value);
        buyBackPieces(from, pieces, value).then(() => {
                console.log('buyBackPieces!!');
                setApproved(true);
            }
        );
    };
    const handleWithdrawSubmit = () => {
        withdrawOriginalNFT().then(() => {

                console.log('handleWithdrawSubmit!!');
                setApproved(true);
            }
        );
    };


    if (txnStatus === 'LOADING') {
        return (
            <Container show>
                <Card style={{maxWidth: 420, minHeight: 400}}>
                    <Spinner animation="border" role="status" className="m-auto"/>
                </Card>
            </Container>
        );
    }

    if (txnStatus === 'COMPLETE'  ) {
        return (
            <Container show>
                <Card style={{maxWidth: 420, minHeight: 200}}>
                    <Text block center className="mb-5">
                        Txn Was successful!
                    </Text>
                    <Button onClick={continueHandler}>Continue</Button>
                </Card>
            </Container>
        );
    }

    if (txnStatus === 'ERROR') {
        return (
            <Container show>
                <Card style={{maxWidth: 420, minHeight: 250}}>
                    <Text>Txn ERROR: </Text>
                    <Text> {errorMessage}</Text>
                    <Button onClick={() => {setTxnStatus('NOT_SUBMITTED'); setErrorMessage('');}}>Go Back</Button>
                </Card>
            </Container>
        );
    }



    if ( (txnStatus === 'COMPLETE' || txnStatus === 'NOT_SUBMITTED' )&& nft.status === 'APPROVED') {
        return (
            <Container show>
                <Card style={{maxWidth: 420, minHeight: 400}}>
                    <Text bold block t2 center color={colors.primary_light} className="mb-3">
                        Create Split (3/3)
                    </Text>
                    <FieldInput value={pieces} setValue={setPieces} title="Pieces"/>
                    <FieldInput value={price} setValue={setPrice} title={`Unit Price ${price ? '(Total price: ' + pieces * price+ ')': ''}`}/>
                    <FieldInput value={percentage} setValue={setPercentage} title="Percentage" />
                    <Text bold block p12 center color={colors.primary_light} className="mb-3">
                        {`${percentage ? '(You will pay: ' + (price * (price /100) + 1) +  ')': ''}`}
                    </Text>
                    <Button primary className="mt-3" onClick={handleSplitSubmit}>
                        Split
                    </Button>
                </Card>
            </Container>
        );

    }


    if ((txnStatus === 'COMPLETE' || txnStatus === 'NOT_SUBMITTED' )&& nft.status === 'READY') {
        return (
            <Container show>


                {nft.pieces === nft.nftBalance && <Card style={{maxWidth: 420, minHeight: 200}}>
                    <Text bold block t2 center color={colors.primary_light} className="mb-3">
                        You Own All Pieces!! <br/>
                        {nft.name}
                    </Text>

                    <Button primary className="mt-3" onClick={handleWithdrawSubmit}>
                        Withdraw
                    </Button>
                </Card>
                }

                {nft.pieces !== nft.nftBalance  && <OwnersCard nftInfo={nft} buyHandler={nft.isOriginalOwner? handleBuyBackSubmit : handleBuySubmit}/>}


            </Container>
        );

    }

    return (
        <Container show>
            <Card style={{maxWidth: 480, minHeight: 160}}>
                <Text bold block t2 color={colors.primary_light} className="mb-3">
                    Approve contract  (Step 2/3)
                </Text>


                <Button primary className="mt-3" onClick={handleNFTApprovalSubmit}>
                    Approve
                </Button>
            </Card>
        </Container>

    );


};

export default NFTCard;

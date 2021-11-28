import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';

import getSplitter from '../abi/nftsplitter';
import {useAppContext} from '../AppContext';
import {Contract} from '@ethersproject/contracts';
import getNFT from '../abi/nft';
const {abi: nftabi} = getNFT();

export const useSplitterContract = (splitterAddress) => {

  const { account, library } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const { abi} = getSplitter();
  const splitterContract = useContract(splitterAddress, abi);
  const { setNFT, setTxnStatus } = useAppContext();

  const getSplitterInfo = async ( nftAddress, tokenId) => {

    try {
      setTxnStatus('LOADING');
      if (account && isValidNetwork) {
        const originalOwner = await splitterContract.originalOwner();
        const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;
        const nftContract = new Contract(nftAddress, nftabi, signerOrProvider);
        const approved = await nftContract.isApprovedForAll(originalOwner, splitterAddress);
        const nftName = await splitterContract.name();
        const nftBalance = await splitterContract.balanceOf(account, tokenId);

        console.log('approved ->', approved, nftName, nftBalance);

        if (approved){
          console.log('loading splitters');
          const name = await splitterContract.name();
          const pieces = await splitterContract.pieces();
          const unitPrice = await splitterContract.unitPrice();
          const percentage = await splitterContract.buyPercentage();
         // console.log('loaded', name, pieces.toNumber(), unitPrice.toNumber(), percentage.toNumber());
          setNFT({ nftName, nftBalance, name, pieces, unitPrice, percentage, approved});
          console.log(pieces > 0);
          if (pieces > 0) {
            setTxnStatus('READY');
          } else {
            setTxnStatus('APPROVED');
          }

        } else {
          setNFT({ nftName, nftBalance, approved});
          setTxnStatus('PENDING_APPROVAL');
        }


      }
    } catch (error) {
      console.log(error);
      setTxnStatus('ERROR');
    }

  };

  const splitMyNFT = async (tokenId, price, percentage, pieces) => {
    try {
      if (account && isValidNetwork) {
        setTxnStatus('LOADING');
        console.log('loading splitMyNFT ===> ', parseEther(price).toString());

        const trx = await splitterContract.splitMyNFT(tokenId, parseEther(price), percentage, pieces,  {
          from: account
        });
        trx.wait(1).then(
            res => {

              console.log('splitMyNFT NFT ->', res);

            }
        );

        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      console.log(error);
    }
  };

  const buyBackPieces = async (from, amount, paymentAmount) => {
    try {
      if (account && isValidNetwork) {
        setTxnStatus('LOADING');
        console.log('buyBackPieces');
        const trx = await splitterContract.splitMyNFT(from, amount, {
          from: account,
          value: parseEther(paymentAmount)
        });
        trx.wait(1).then(
            res => {

              console.log('buyBackPieces res ->', res);
              /* dispatcher({
                 type: SPLITTER_CREATED,
                 payload: { splitter:  splitterAddress}
               });*/
            }
        );

        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      console.log(error);
    }
  };

  const buyPiecesFromOwner = async ( amount, paymentAmount) => {
    try {
      if (account && isValidNetwork) {
        setTxnStatus('LOADING');
        console.log('buyPiecesFromOwner -> ', amount, parseEther(paymentAmount));
        const trx = await splitterContract.buyPiecesFromOwner( amount, {
          from: account,
          value: parseEther(paymentAmount)
        });
        trx.wait(1).then(
            res => {

              console.log('buyPiecesFromOwner res ->', res);
              /* dispatcher({
                 type: SPLITTER_CREATED,
                 payload: { splitter:  splitterAddress}
               });*/
            }
        );
        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      console.log(error);
    }
  };

  const withdrawOriginalNFT = async ( ) => {
    try {
      if (account && isValidNetwork) {
        console.log('withdrawOriginalNFT');
        const trx = await splitterContract.withdrawOriginalNFT( {
          from: account
        });
        trx.wait(1).then(
            res => {

              console.log('withdrawOriginalNFT res ->', res);
              /* dispatcher({
                 type: SPLITTER_CREATED,
                 payload: { splitter:  splitterAddress}
               });*/
            }
        );
        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      console.log(error);
    }
  };

 /* useEffect(() => {
    if (account && setNFT) {
      //geInfo();
    }
  }, [setNFT]);
*/
  return {
    splitMyNFT,
    buyBackPieces,
    buyPiecesFromOwner,
    withdrawOriginalNFT,
    getSplitterInfo
  };
};

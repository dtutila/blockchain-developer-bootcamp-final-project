import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';

import getSplitter from '../abi/nftsplitter';
import {useAppContext} from '../AppContext';


export const useSplitterContract = (splitterAddress) => {
  const {  setTxnStatus } = useAppContext();
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const { abi} = getSplitter();
  const splitterContract = useContract(splitterAddress, abi);
  let name = '';
  let pieces = '';
  let price = '';
  let percentage = '';
  let owners = '';

  // const fetchCTokenBalance = async () => {
  //   const cTokenBalance = await cTokenContract.balanceOf(account);
  //   setCTokenBalance(formatUnits(cTokenBalance, 8));
  // };
  const geInfo = async () => {




    try {
      if (account && isValidNetwork) {
        console.log('loading splitters');
        name = await splitterContract.name();
        pieces = await splitterContract.pieces();
        price = await splitterContract.NFTPrice();
        percentage = await splitterContract.buyPercentage();

      }
    } catch (error) {
      console.log(error);
    }
    return { name, price, pieces, percentage }
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

              console.log('splitMyNFT nft ->', res);

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

/*  useEffect(() => {
    if (account) {
      getCTokenExchangeRate();
    }
  }, [account]);*/

  return {
    splitMyNFT,
    buyBackPieces,
    buyPiecesFromOwner,
    withdrawOriginalNFT
  };
};

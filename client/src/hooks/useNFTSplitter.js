import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';

import getSplitter from '../abi/nftsplitter';
import {SPLITTER_CREATED, SPLITTERS_LOADED} from '../store/actions';


export const useSplitterContract = (splitterAddress) => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const { abi} = getSplitter();
  const splitterContract = useContract(splitterAddress, abi);
  const dispatcher = useDispatch();
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

  const splitMyNFT = async (tokenId, price, percentage, pieces, initialSupply, lockTime) => {
    try {
      if (account && isValidNetwork) {
        console.log('loading splitters');
        const trx = await splitterContract.splitMyNFT(tokenId, price, percentage, pieces, initialSupply, lockTime, {
          from: account
        });
        trx.wait(1).then(
            res => {

              console.log('approve nft ->', res);
              /* dispatcher({
                 type: SPLITTER_CREATED,
                 payload: { splitter:  splitterAddress}
               });*/
            }
        );


      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyBackPieces = async (from, amount, paymentAmount) => {
    try {
      if (account && isValidNetwork) {
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


      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyPiecesFromOwner = async ( amount, paymentAmount) => {
    try {
      if (account && isValidNetwork) {
        console.log('buyPiecesFromOwner');
        const trx = await splitterContract.buyPiecesFromOwner(from, amount, {
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
      }
    } catch (error) {
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
      }
    } catch (error) {
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

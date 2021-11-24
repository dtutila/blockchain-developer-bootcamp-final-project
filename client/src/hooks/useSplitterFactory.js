import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';

import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';
import factory  from '../abi/factory';

export const useSplitterFactory = () => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

  const factoryContract = useContract(factory.address, factory.abi);


  // const fetchCTokenBalance = async () => {
  //   const cTokenBalance = await cTokenContract.balanceOf(account);
  //   setCTokenBalance(formatUnits(cTokenBalance, 8));
  // };

  // const getCTokenExchangeRate = async () => {
  //   try {
  //     let exchangeRateCurrent = await cTokenContract.callStatic.exchangeRateCurrent();
  //     exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + 18 - 8);
  //     setExchangeRate(exchangeRateCurrent);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const createSplitter = async (nftAddress) => {
    console.log('account', account);
    console.log('isValidNetwork', isValidNetwork);
    if (account && isValidNetwork) {
      try {
      //  setTxnStatus('LOADING');
        console.log('sending');
        const txn = await factoryContract.createNFTSplitter(nftAddress, {
          from: account
        });
        await txn.wait(1);
        console.log('done');
        //await fetchCTokenBalance();
        //setTxnStatus('COMPLETE');
      } catch (error) {
       // setTxnStatus('ERROR');
        console.log('error', error);
      }
    }
  };

/*  useEffect(() => {
    if (account) {
      getCTokenExchangeRate();
    }
  }, [account]);*/

  return {
    createSplitter
  };
};

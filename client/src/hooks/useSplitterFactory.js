import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';

import getFactory from '../abi/factory';
import {SPLITTER_CREATED, SPLITTERS_LOADED} from '../store/actions';


export const useSplitterFactory = () => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const {address, abi} = getFactory();
  const factoryContract = useContract(address, abi);
  const dispatcher = useDispatch();
  const user = useSelector((state) => state.account);
  const { splitters } = user;


  // const fetchCTokenBalance = async () => {
  //   const cTokenBalance = await cTokenContract.balanceOf(account);
  //   setCTokenBalance(formatUnits(cTokenBalance, 8));
  // };

  const getSplitters = async () => {
    try {
      if (account && isValidNetwork) {
        console.log('loading splitters');
        let splitters = await factoryContract.getNFTSplitters();
        console.log('initial splitters ->', splitters);
        dispatcher({
          type: SPLITTERS_LOADED,
          payload: {splitters: ['TEST']}
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSplitter = async (nftAddress) => {
    console.log('account', account);
    console.log('splitters', splitters);
    console.log('user', user);
    console.log('isValidNetwork', isValidNetwork);
    let splitterAddress = '';
    if (account && isValidNetwork) {
      try {
      //  setTxnStatus('LOADING');
        console.log('sending');
        const txn = await factoryContract.createNFTSplitter(nftAddress, {
          from: account
        });
         txn.wait(1).then(
             res => {
               splitterAddress = res.events.filter(x => x.event && x.event === 'ProxyCreated')[0].args[1];
               console.log('splitterAddress', splitterAddress);
               dispatcher({
                 type: SPLITTER_CREATED,
                 payload: { splitter:  splitterAddress}
               });
             }
         );

        console.log('done', txn);
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
    getSplitters,
    createSplitter
  };
};

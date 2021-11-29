import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import getFactory from '../abi/factory';




export const useSplitterFactory = () => {
  const { setTxnStatus, setProxyAddress, setErrorMessage } = useAppContext();
  const { account, library } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const {address, abi} = getFactory();
  const factoryContract = useContract(address, abi);




  const getProxyAddressByNFT = async (nftAddress, tokenId) => {
    let proxy ;
    try {
      if (account && isValidNetwork) {
        let proxy = await factoryContract.getProxyAddressByNFT(nftAddress, tokenId);
        console.log('proxy ->', proxy);
        setProxyAddress(proxy);

      }
    } catch (error) {
      console.log(error);
    }

  };

  const getSplitters = async () => {
    try {
      if (account && isValidNetwork) {
        console.log('loading splitters');
        let splitters = await factoryContract.getNFTSplitters();
        console.log('initial splitters ->', splitters);

      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSplitter = async (nftAddress, tokenId) => {
    console.log('account', account);
     console.log('isValidNetwork', isValidNetwork);
    let splitterAddress = '';
    if (account && isValidNetwork) {
      try {
        setTxnStatus('LOADING');
        console.log('sending');
        const txn = await factoryContract.createNFTSplitter(nftAddress, tokenId, {
          from: account
        });
         txn.wait(1).then(
             res => {
               splitterAddress = res.events.filter(x => x.event && x.event === 'ProxyCreated')[0].args[1];
               console.log('splitterAddress', splitterAddress);

             }
         );

        console.log('done', txn);
        //await fetchCTokenBalance();
        setTxnStatus('COMPLETE');
      } catch (error) {
        setTxnStatus('ERROR');
        console.log('error', error);
        if (error) setErrorMessage(error.message );
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
    createSplitter,
    getProxyAddressByNFT
  };
};

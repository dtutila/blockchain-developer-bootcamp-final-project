import { useContract } from './useContract';
import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import getNFT from '../abi/nft';
import {useAppContext} from '../AppContext';

export const useNFT = (nftAddress) => {
  const {  setTxnStatus } = useAppContext();
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const {abi} = getNFT();
  const nftContract = useContract(nftAddress, abi);
  let name = '';
  let isApproved = false;

  const getNFTInfo = async (nftAddress, tokenId, splitterAddress) => {
    try {
      if (account && isValidNetwork) {
        console.log('loading splitters');
        name = await nftContract.name();
        isApproved = await nftContract.isApprovedForAll(account, splitterAddress);
        console.log('name ->', name);
        console.log('isApproved ->', isApproved);

      }
    } catch (error) {
      console.log(error);
    }
    return { name, isApproved }
  };

  const approve = async (nftAddress, tokenId, splitterAddress) => {
    try {
      if (account && isValidNetwork) {
        console.log('approving');
        setTxnStatus('LOADING');
        const trx =  await nftContract.setApprovalForAll(splitterAddress, true, {
          from: account
        });
        await trx.wait(1).then(
            res => {
              console.log('approve NFT ->', res);
            }
        );
        console.log('approved done');

        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      console.log(error);
    }

  };

  return {
    getNFTInfo,
    approve
  };
};

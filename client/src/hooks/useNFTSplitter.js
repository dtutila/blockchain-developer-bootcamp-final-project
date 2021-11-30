import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import {formatEther, formatUnits, parseEther} from '@ethersproject/units';
import { useEffect } from 'react';

import getSplitter from '../abi/nftsplitter';
import {useAppContext} from '../AppContext';
import {Contract} from '@ethersproject/contracts';
import getNFT from '../abi/nft';
const {abi: nftabi} = getNFT();
const confirmations = 1;
export const useSplitterContract = (splitterAddress) => {

  const { account, library } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const { abi} = getSplitter();
  const splitterContract = useContract(splitterAddress, abi);
  const { setNFT, setTxnStatus, setErrorMessage, nft } = useAppContext();

  const getSplitterInfo = async ( nftAddress, tokenId) => {

    try {
      setTxnStatus('LOADING');
      if (account && isValidNetwork) {
        const originalOwner = await splitterContract.originalOwner();
        const tokenId = await splitterContract.tokenId();
        const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;
        const nftContract = new Contract(nftAddress, nftabi, signerOrProvider);
        const approved = await nftContract.isApprovedForAll(originalOwner, splitterAddress);
        const nftName = await splitterContract.name();
        const nftBalance = await splitterContract.balanceOf(account, tokenId);
        //TransferSingle
        const isOriginalOwner = account === originalOwner;
        console.log('approved ->', approved, nftName, nftBalance, isOriginalOwner);

        if (approved){
          console.log('loading splitters');
          const name = await splitterContract.name();
          const pieces = await splitterContract.pieces();
          const unitPrice = await splitterContract.unitPrice();
          const percentage = await splitterContract.buyPercentage();


          //setNFT({ nftName, nftBalance, name, pieces, unitPrice, percentage, approved});
          console.log(pieces > 0);
          if (pieces > 0) {
            let eventFilter = splitterContract.filters.TransferSingle()
            let events = await splitterContract.queryFilter(eventFilter)
            const userAddresses = events.map(event => {return event.args} ).map( arg => {return { owner: arg[0]}});
            const ownersRes = userAddresses.filter(e => e.owner !== account).map(o => {return o.owner});
            const uniq = a => [...new Set(a)];
            const uniqueOwners = uniq(ownersRes);
            const owners = await Promise.all(uniqueOwners.map( async owner => {
              const balance =  await splitterContract.balanceOf(owner, tokenId);
              return {
                owner: owner,
                pieces: balance.toString()
              }
            }));
            console.log('events ->', owners );

            setNFT({ status: 'READY', originalOwner, isOriginalOwner, nftName, tokenId: tokenId.toString(), nftAddress, nftBalance:  nftBalance.toString(), approved, owners:owners, percentage: percentage.toString(), unitPrice: parseFloat(formatEther(unitPrice)).toPrecision(2), pieces: pieces.toString(), name  });
            //setTxnStatus('READY');
          } else {
            setNFT({ status: 'APPROVED', originalOwner, nftName, isOriginalOwner, tokenId: tokenId.toString(), nftAddress, nftBalance: nftBalance.toString(), approved, owners: [], percentage: percentage.toString(), unitPrice: parseFloat(formatEther(unitPrice)).toPrecision(2), pieces: pieces.toString(), name  });

          }

        } else {
          setNFT({ status: 'PENDING_APPROVAL', nftName, tokenId: tokenId.toString(), nftBalance: nftBalance.toString(), approved, originalOwner, isOriginalOwner});

        }

        setTxnStatus('NOT_SUBMITTED');
      }
    } catch (error) {
      if (error){ setErrorMessage(error.message );
        console.log(error);}
      setTxnStatus('ERROR');
      setNFT({ status: 'ERROR', owners: []});

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
        await trx.wait(confirmations).then(
            res => {

              console.log('splitMyNFT NFT ->', res);

            }
        );

        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      if (error){ setErrorMessage(error.message );
      console.log(error);}
    }
  };

  const buyBackPieces = async (from, amount, paymentAmount) => {
    try {
      if (account && isValidNetwork) {
        setTxnStatus('LOADING');
        console.log('buyBackPieces', from, amount, paymentAmount);
        const trx = await splitterContract.buyBackPieces(from, amount, {
          from: account,
          value: parseEther(paymentAmount)
        });
        await trx.wait(confirmations).then(
            res => {
              console.log('buyBackPieces res ->', res);
                  }
        );

        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      if (error){ setErrorMessage(error.message );
        console.log(error);}
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
        await trx.wait(confirmations).then(
            res => {
              console.log('buyPiecesFromOwner res ->', res);
               }
        );
        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      if (error){ setErrorMessage(error.message );
        console.log(error);}
    }
  };

  const withdrawOriginalNFT = async ( ) => {
    try {
      if (account && isValidNetwork) {
        console.log('withdrawOriginalNFT');
        const trx = await splitterContract.withdrawOriginalNFT( {
          from: account
        });
        await trx.wait(confirmations).then(
            res => {
              console.log('withdrawOriginalNFT res ->', res);
            }
        );
        setTxnStatus('COMPLETE');
      }
    } catch (error) {
      setTxnStatus('ERROR');
      if (error){ setErrorMessage(error.message );
        console.log(error);}
    }
  };

  useEffect(() => {
    if (account && nft.nftAddress && nft.tokenId) {
      console.log('new account: ', account, nft.nftAddress, nft.tokenId);
      getSplitterInfo(nft.nftAddress, nft.tokenId);
    }
  }, [account]);

  return {
    splitMyNFT,
    buyBackPieces,
    buyPiecesFromOwner,
    withdrawOriginalNFT,
    getSplitterInfo
  };
};

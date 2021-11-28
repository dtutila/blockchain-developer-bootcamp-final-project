import { useContract } from './useContract';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import {formatEther, formatUnits, parseEther} from '@ethersproject/units';
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
        //TransferSingle

        console.log('approved ->', approved, nftName, nftBalance);

        if (approved){
          console.log('loading splitters');
          const name = await splitterContract.name();
          const pieces = await splitterContract.pieces();
          const unitPrice = await splitterContract.unitPrice();
          const percentage = await splitterContract.buyPercentage();

          setNFT({ nftName, nftBalance, name, pieces, unitPrice, percentage, approved});
          console.log(pieces > 0);
          if (pieces > 0) {
            let eventFilter = splitterContract.filters.TransferSingle()
            let events = await splitterContract.queryFilter(eventFilter)

            const userAddresses = events.map(event => {return event.args} ).map( arg => {return { owner: arg[0]}});
           // let users;
            const owners = await Promise.all(userAddresses.map( async user => {
                const balance =  await splitterContract.balanceOf(user.owner, tokenId);
                return {
                  owner: user.owner,
                  pieces: balance.toString()
                }
            }));
            //console.log('events ->', owners );
            setNFT({ nftName, nftBalance, approved, owners, percentage: percentage.toString(), unitPrice, pieces: pieces.toString(), name  });
            setTxnStatus('READY');
          } else {
            setNFT({ nftName, nftBalance, approved, owners: [], percentage: percentage.toString(), unitPrice, pieces: pieces.toString(), name  });
            setTxnStatus('APPROVED');
          }

        } else {
          setNFT({ nftName, nftBalance, approved});
          setTxnStatus('PENDING_APPROVAL');
        }

       // setTxnStatus('COMPLETE');
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

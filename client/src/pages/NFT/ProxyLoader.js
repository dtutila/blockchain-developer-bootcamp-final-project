import {react, useEffect} from 'react';
import NFTTradeCard from './NFTTradeCard';
import {useParams} from 'react-router-dom';
import useTransaction from '../../hooks/useTransaction';
import {useAppContext} from '../../AppContext';

const ProxyLoader = () => {
    const params = useParams();
    const {  setTxnStatus } = useTransaction();
    const { setNFT } = useAppContext();

    const successHandler = () => {
        setTxnStatus('NOT_SUBMITTED');
        history.push(`/nft/${nftAddress}/${tokenId}`);
    }
    useEffect(() => {
        setNFT({
            nftAddress: params.nftAddress,
            tokenId: params.tokenId
        });

    },[]);

    return (
        <NFTTradeCard proxyAddress={'0x751a14B2328741E5085a4E19Dfb6B953F531A79A'}
                      nftAddress={params.nftAddress}
                      tokenId={params.tokenId}
        />
    );

}

export default ProxyLoader;
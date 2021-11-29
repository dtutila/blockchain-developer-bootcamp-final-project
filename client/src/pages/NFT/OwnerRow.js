import React, {useState} from 'react';
import {shortenAddress} from '../../utils/shortenAddress';
import {colors} from '../../theme';
import Text from '../../components/Text';
import styled from 'styled-components';

const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 4px;
  padding-left: 4px;
  -webkit-box-align: start;
  align-items: start;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const OwnerRow = ({owner, pieces, buyPiecesHandler, isOwner, unitPrice, percentaje}) => {
    const [selectedPieces, setSelectedPieces] = useState('1');
    // const [selectedPrice, setSelectedPrice] = useState('0');
    const rowOwner = shortenAddress(owner);
    const buyHandler = ( ) => {

        const value = isOwner ? (selectedPieces * unitPrice) : (selectedPieces * unitPrice) * (1+ percentaje /100);
        console.log('row', owner, selectedPieces, value);
        buyPiecesHandler(owner, selectedPieces, value.toString());
    };
    const onPiecesSelected = (event) => {
        setSelectedPieces(  event.target.value)
    }
    return (
        <ContainerRow key={owner + 'li' + pieces}>
            <Text block t12  center color={colors.primary_light} className="mb-3">{rowOwner} {pieces}</Text>
            <select key={owner + 'select' + pieces} value={selectedPieces} onChange={onPiecesSelected}>
                {Array(parseInt(pieces)).fill(1).map((x, i) =>{
                    return <option value={i+1}>{i+1}</option>
                })
                }</select>
            {isOwner && <button onClick={buyHandler} key={owner + 'b' + pieces}>Buy Back ({selectedPieces * unitPrice} ETH)</button>}
            {!isOwner && <button onClick={buyHandler} key={owner + 'b' + pieces}>Buy ({selectedPieces * (unitPrice + ( percentaje /100))} ETH)</button>}
        </ContainerRow>
    );
}

export default OwnerRow;
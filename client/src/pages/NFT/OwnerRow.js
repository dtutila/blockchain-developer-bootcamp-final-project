import React, {useEffect, useState} from 'react';
import {shortenAddress} from '../../utils/shortenAddress';
import {colors} from '../../theme';
import Text from '../../components/Text';
import styled from 'styled-components';
import {BigNumber} from 'bignumber.js';
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
const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${colors.primary_dark};
  margin-left: 0.5em;

  color:  white;
  font-size: 1em;
  border: 2px solid;
  border-radius: 3px;
  
`;
const Select = styled.select`
  font-size: 1em;
  background: ${colors.primary_dark};
  margin-left: 0.5em;
  color:  white;
  border: 2px solid;
`;
const OwnerRow = ({owner, pieces,  unitPrice, buyPiecesHandler, isOwner, percentage}) => {
    const [selectedPieces, setSelectedPieces] = useState('1');
     const [selectedPrice, setSelectedPrice] = useState('1');
    const rowOwner = shortenAddress(owner);
    useEffect(() => {
        const value = getPrice().toString();
        setSelectedPrice(value + ' ETH')
    },[selectedPieces])
    console.log('OwnerRow', owner, pieces,  unitPrice, percentage);
    const getPrice = () =>{
        const pieces = new BigNumber(selectedPieces);
        const price = new BigNumber(unitPrice);
        const percentageBN = new BigNumber(percentage);
        const  extra = percentageBN.multipliedBy(price).multipliedBy(pieces).dividedBy(100);
        const buyValue = pieces.multipliedBy(price);
        const buyBackValue = buyValue.plus(extra);

        return isOwner ? buyBackValue : buyValue;
    }
    const buyHandler = ( ) => {
        const value = getPrice();
        console.log('row', owner, selectedPieces, value.toNumber());
        buyPiecesHandler(owner, selectedPieces, value.toString());
    };
    const onPiecesSelected = (event) => {
        setSelectedPieces(  event.target.value)

    }
    return (
        <ContainerRow key={owner + 'li' + pieces} style={{minWidth: 600 }}>
            <Text block t12  center color={colors.primary_light} className="mb-3">{rowOwner} [{pieces} pieces]</Text>
            <Select key={owner + 'select' + pieces} value={selectedPieces} onChange={onPiecesSelected}>
                {Array(parseInt(pieces)).fill(1).map((x, i) =>{
                    return <option value={i+1}>{i+1}</option>
                })
                }</Select>
            {isOwner && <Button onClick={buyHandler} key={owner + 'b' + pieces}>Buy Back ({selectedPrice})</Button>}
            {!isOwner && <Button onClick={buyHandler} key={owner + 'b' + pieces}>Buy ({selectedPrice})</Button>}
        </ContainerRow>
    );
}

export default OwnerRow;
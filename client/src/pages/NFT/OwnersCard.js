import React, {useState} from 'react';
import Card from '../../components/Card';
import Text from '../../components/Text';
import {colors} from '../../theme';
import OwnerRow from './OwnerRow';
import styled from 'styled-components';
const Ul = styled.div`

  -webkit-box-align: center;
  align-items: center;

`;

const OwnersCard = (props) => {
    console.log('props', props);
    const {enteredPrice, setEnteredPrice} = useState('');
    const {selectedPieces, setSelectedPieces} = useState('1');
    const buyPiecesHandler = (address, amount, value) => {
        console.log('buyPiecesHandler',address, amount, value);
        props.buyHandler(address, amount, value);
    }
    console.log('owners', props.nftInfo.owners);
    return (
        <Card style={{maxWidth: 420, minHeight: 400}}>
            <Text bold block t2  center color={colors.primary_light} className="mb-3">
                 { props.nftInfo.isOriginalOwner ? 'Buy Back' : ' Buy Pieces'}
            </Text>

                <Ul key={props.nftInfo.isOriginalOwner+ 'rowUL'} >
                  {props.nftInfo.owners.map(e => {
                    return (
                     <OwnerRow key={e.owner+ 'row'} owner={e.owner}
                               isOwner={props.nftInfo.isOriginalOwner}
                               pieces={e.pieces}
                               unitPrice={props.nftInfo.unitPrice}
                               percentage={props.nftInfo.percentage}
                               buyPiecesHandler={buyPiecesHandler}/>

                    )})

                }
                </Ul>

        </Card>
    )
}


export default OwnersCard;
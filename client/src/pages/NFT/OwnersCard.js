import React, {useState} from 'react';
import Card from '../../components/Card';
import Text from '../../components/Text';
import {colors} from '../../theme';
import OwnerRow from './OwnerRow';

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
                Buy From  { props.nftInfo.isOriginalOwner ? ' Other Owners' : ' Original Owner'}
            </Text>

                <ul>
                  {props.nftInfo.owners.map(e => {
                    return (
                     <OwnerRow key={e.owner+ 'row'} owner={e.owner}
                               pieces={e.pieces}
                               unitPrice={props.nftInfo.unitPrice}
                               percentaje={props.nftInfo.percentage}
                               buyPiecesHandler={buyPiecesHandler}/>

                    )})

                }
                </ul>

        </Card>
    )
}


export default OwnersCard;
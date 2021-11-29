import React, {useState} from 'react';
import Card from '../../components/Card';
import Text from '../../components/Text';
import {colors} from '../../theme';
import FieldInput from '../../components/FieldInput';
import OwnerRow from './OwnerRow';

const OwnersCard = (props) => {
    console.log('props', props);
   // const {nft, setNFT} = useState(props.nftInfo);
    const {enteredPrice, setEnteredPrice} = useState('');
    const {selectedPieces, setSelectedPieces} = useState('1');
    const buyPiecesHandler = (address, amount) => {
        console.log(address, amount);
    }
    console.log('owners', props.nftInfo.owners);
    return (
        <Card style={{maxWidth: 420, minHeight: 400}}>
            <Text bold block t2  center color={colors.primary_light} className="mb-3">
                Owners
            </Text>

                <ul>
                  {props.nftInfo.owners.map(e => {
                    return (
                     <OwnerRow key={e.owner+ 'row'} owner={e.owner} pieces={e.pieces} buyPiecesHandler={buyPiecesHandler}/>

                    )})

                }
                </ul>

           {/* <FieldInput value={pieces} setValue={setPieces} title="Pieces"/>
            <FieldInput value={value} setValue={setValue} title="eth"/>


            <Button primary className="mt-3" onClick={handleBuySubmit}>
                Buy Pieces
            </Button>
            <Button primary className="mt-3" onClick={handleBuyBackSubmit}>
                Buy BACK
            </Button>
            <Button primary className="mt-3" onClick={handleWithdrawSubmit}>
                Withdraw
            </Button>*/}
        </Card>
    )
}


export default OwnersCard;
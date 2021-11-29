import React, {useState} from 'react';

const OwnerRow = ({owner, pieces, buyPiecesHandler}) => {
    const [selectedPieces, setSelectedPieces] = useState('1');
    const buyHandler = ( ) => {
        console.log('row', owner, selectedPieces);
        buyPiecesHandler(owner, selectedPieces);
    };
    const onPiecesSelected = (event) => {
        setSelectedPieces(  event.target.value)
    }
    return (
        <li key={owner + 'li'}> {owner} {pieces}
            <select key={owner + 'select'} value={selectedPieces} onChange={onPiecesSelected}>
                {Array(parseInt(pieces)).fill(1).map((x, i) =>{
                    return <option value={i+1}>{i+1}</option>
                })
                }</select>
            <button onClick={buyHandler} key={owner + 'b'}>Buy</button>
        </li>
    );
}

export default OwnerRow;
const abi =[
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_settings",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nft",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "proxyAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "NFTOwner",
                "type": "address"
            }
        ],
        "name": "ProxyCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_nft",
                "type": "address"
            }
        ],
        "name": "createNFTSplitter",
        "outputs": [
            {
                "internalType": "contract NFTSplitterProxy",
                "name": "prx",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [],
        "name": "getNFTSplitterBase",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

const address = '0x4e454Fe262E43AdA42cB874f0419DCfb38d36329';
export default {abi, address};
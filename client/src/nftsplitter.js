import web3 from './web3';

const abi = [
    {
        'inputs': [],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'operator',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'bool',
                'name': 'approved',
                'type': 'bool'
            }
        ],
        'name': 'ApprovalForAll',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'originalNFTAddress',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            },
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'pieces',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'price',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'percentage',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'lockTime',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'string',
                'name': 'name',
                'type': 'string'
            }
        ],
        'name': 'NFTSplit',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'originalNFTAddress',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'buyer',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'price',
                'type': 'uint256'
            }
        ],
        'name': 'NFTSplitBuyBack',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'originalNFTAddress',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'buyer',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'price',
                'type': 'uint256'
            }
        ],
        'name': 'NFTSplitSold',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'operator',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256[]',
                'name': 'ids',
                'type': 'uint256[]'
            },
            {
                'indexed': false,
                'internalType': 'uint256[]',
                'name': 'values',
                'type': 'uint256[]'
            }
        ],
        'name': 'TransferBatch',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'operator',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'TransferSingle',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'string',
                'name': 'value',
                'type': 'string'
            },
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            }
        ],
        'name': 'URI',
        'type': 'event'
    },
    {
        'stateMutability': 'payable',
        'type': 'fallback'
    },
    {
        'inputs': [],
        'name': 'NFTPrice',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            }
        ],
        'name': 'balanceOf',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address[]',
                'name': 'accounts',
                'type': 'address[]'
            },
            {
                'internalType': 'uint256[]',
                'name': 'ids',
                'type': 'uint256[]'
            }
        ],
        'name': 'balanceOfBatch',
        'outputs': [
            {
                'internalType': 'uint256[]',
                'name': '',
                'type': 'uint256[]'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'buyPercentage',
        'outputs': [
            {
                'internalType': 'uint128',
                'name': '',
                'type': 'uint128'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'initialSellAmount',
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'operator',
                'type': 'address'
            }
        ],
        'name': 'isApprovedForAll',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'lockEndDate',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'name',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'originalNFT',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'originalOwner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'pieces',
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256[]',
                'name': 'ids',
                'type': 'uint256[]'
            },
            {
                'internalType': 'uint256[]',
                'name': 'amounts',
                'type': 'uint256[]'
            },
            {
                'internalType': 'bytes',
                'name': 'data',
                'type': 'bytes'
            }
        ],
        'name': 'safeBatchTransferFrom',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'operator',
                'type': 'address'
            },
            {
                'internalType': 'bool',
                'name': 'approved',
                'type': 'bool'
            }
        ],
        'name': 'setApprovalForAll',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'settings',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'symbol',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'tokenId',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'version',
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'stateMutability': 'payable',
        'type': 'receive'
    },
    {
        'inputs': [
            {
                'internalType': 'string',
                'name': 'newuri',
                'type': 'string'
            }
        ],
        'name': 'setURI',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes',
                'name': 'data',
                'type': 'bytes'
            }
        ],
        'name': 'mint',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256[]',
                'name': 'ids',
                'type': 'uint256[]'
            },
            {
                'internalType': 'uint256[]',
                'name': 'amounts',
                'type': 'uint256[]'
            },
            {
                'internalType': 'bytes',
                'name': 'data',
                'type': 'bytes'
            }
        ],
        'name': 'mintBatch',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'bytes4',
                'name': 'interfaceId',
                'type': 'bytes4'
            }
        ],
        'name': 'supportsInterface',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            }
        ],
        'name': 'uri',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'burn',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            },
            {
                'internalType': 'uint256[]',
                'name': 'ids',
                'type': 'uint256[]'
            },
            {
                'internalType': 'uint256[]',
                'name': 'values',
                'type': 'uint256[]'
            }
        ],
        'name': 'burnBatch',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'id',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes',
                'name': 'data',
                'type': 'bytes'
            }
        ],
        'name': 'safeTransferFrom',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_tokenId',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_price',
                'type': 'uint256'
            },
            {
                'internalType': 'uint128',
                'name': '_buyPercentage',
                'type': 'uint128'
            },
            {
                'internalType': 'uint8',
                'name': '_pieces',
                'type': 'uint8'
            },
            {
                'internalType': 'uint8',
                'name': '_initialSellAmount',
                'type': 'uint8'
            },
            {
                'internalType': 'uint256',
                'name': '_lockTimeInDays',
                'type': 'uint256'
            }
        ],
        'name': 'splitMyNFT',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'pieceId',
                'type': 'uint256'
            }
        ],
        'name': 'buyBackPiece',
        'outputs': [],
        'stateMutability': 'payable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'buyer',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'pieceId',
                'type': 'uint256'
            }
        ],
        'name': 'buyPiece',
        'outputs': [],
        'stateMutability': 'payable',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'glueAllTogether',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': '_id',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            },
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            }
        ],
        'name': 'onERC1155Received',
        'outputs': [
            {
                'internalType': 'bytes4',
                'name': '',
                'type': 'bytes4'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            },
            {
                'internalType': 'uint256[]',
                'name': '',
                'type': 'uint256[]'
            },
            {
                'internalType': 'uint256[]',
                'name': '',
                'type': 'uint256[]'
            },
            {
                'internalType': 'bytes',
                'name': '',
                'type': 'bytes'
            }
        ],
        'name': 'onERC1155BatchReceived',
        'outputs': [
            {
                'internalType': 'bytes4',
                'name': '',
                'type': 'bytes4'
            }
        ],
        'stateMutability': 'pure',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'getBalance',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    }
];

const address = '';
export default new web3.eth.Contract(abi, address);
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NFTSplitterAdmin {
    bytes32 public constant PAUSED = keccak256("ADMIN_PAUSED");
    bytes32 public constant NFTSPLITTER_ADDRESS = keccak256("NFTSPLITTER_ADDRESS");
    bytes32 public constant FACTORY_ADDRESS = keccak256("FACTORY_ADDRESS");
    string public constant PROXY = "PROXY";

    address private owner;
    mapping(bytes32 => address) private addressStorage;
    mapping(bytes32 => bool) private boolStorage;

    modifier onlyOwner() {
        require(msg.sender == owner, "NFTSplitterAdmin: Only owner can run this method.");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == addressStorage[FACTORY_ADDRESS], "NFTSplitterAdmin: Only Factory can run this method.");
        _;
    }

    modifier onlyOwnerOrFactory() {
        require(msg.sender == owner || msg.sender == addressStorage[FACTORY_ADDRESS],
            "NFTSplitterAdmin: Only owner or factory can run this method.");
        _;
    }

    event ProxyRegistered (
        address indexed proxyAddress,
        address indexed nftAddress
    );

    constructor() {
        owner = msg.sender;
        boolStorage[PAUSED] = false;
    }

    function setAddressSettings(bytes32 _key, address _value)
        external
        onlyOwner
    {
        addressStorage[_key] = _value;
    }

    function registerProxy(address _nft, address _proxy)
    external
    onlyOwnerOrFactory
    {
        boolStorage[keccak256(abi.encodePacked(PROXY, _nft, _proxy))] = true;
        emit ProxyRegistered (_proxy, _nft);

    }

    function registerFactory(address _value)
    external
    onlyOwner
    {
        addressStorage[FACTORY_ADDRESS]= _value;
    }

    function isValidProxy(address _nft, address proxyAddress)
    external
    returns (bool)
    {
        return boolStorage[keccak256(abi.encodePacked(PROXY, _nft, proxyAddress))] ;
    }



    function setBoolSettings(bytes32 _key, bool _value) external onlyOwner {
        boolStorage[_key] = _value;
    }

    function upgrade(address _implementation) external onlyOwner {
        addressStorage[NFTSPLITTER_ADDRESS] = _implementation;
    }

    function changeOwner() external onlyOwner {
        require(owner != msg.sender, 'You already are the owner!');
        owner = msg.sender;
    }

    function pause() external onlyOwner {
        boolStorage[PAUSED] = true;
    }

    function unpause() external onlyOwner {
        boolStorage[PAUSED] = false;
    }

    function isPaused() external view returns (bool) {
        return boolStorage[PAUSED];
    }

    function getImplementation() external view returns (address) {
        return addressStorage[NFTSPLITTER_ADDRESS];
    }
}

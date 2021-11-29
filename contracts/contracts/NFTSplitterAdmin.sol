// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
/**
 * @notice this is where the settings of de app are storage
 * @dev it acts as eternal storage for the settings and can be use to update the contract with the base logic

*/
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

    /**
      * @notice only factory and owner can execute this function
      * @dev registers a proxy in the settings
      *
     */
    function registerProxy(address _nft, uint _tokenId, address _proxy)
    external
    onlyFactory
    {
        boolStorage[keccak256(abi.encodePacked(PROXY, _nft, _tokenId, _proxy))] = true;
        addressStorage[keccak256(abi.encodePacked(_nft, _tokenId))] = _proxy;
        emit ProxyRegistered (_proxy, _nft);

    }

    //registering factory contract in settings
    function registerFactory(address _value)
    external
    onlyOwner
    {
        addressStorage[FACTORY_ADDRESS]= _value;
    }

    /**
       * @notice  validates if a proxy was created using creation function in the factory contract
      * @dev only registered proxies can execute some functions in the base contract
      *
     */
    function isValidProxy(address _nft, uint _tokenId, address proxyAddress)
    external
    returns (bool)
    {
        return boolStorage[keccak256(abi.encodePacked(PROXY, _nft, _tokenId, proxyAddress))] ;
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

    function getProxyAddressByNFT(address _nft, uint _tokenId)
    external view
    onlyFactory
    returns (address)
    {
       return addressStorage[keccak256(abi.encodePacked(_nft, _tokenId))];


    }
}

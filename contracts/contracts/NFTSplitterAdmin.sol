// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
/**
 * @notice this is where the settings of de app are storage and managed
 * @dev this contract acts as eternal storage for the settings and
 * can be use to update the contract with the base logic

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
    /**
    * @dev validates that only factory contract can execute the function
    */
    modifier onlyFactory() {
        require(msg.sender == addressStorage[FACTORY_ADDRESS], "NFTSplitterAdmin: Only Factory can run this method.");
        _;
    }
    /**
       * @dev validates that only factory or the owner of Admin contract can execute the function
    */
    modifier onlyOwnerOrFactory() {
        require(msg.sender == owner || msg.sender == addressStorage[FACTORY_ADDRESS],
            "NFTSplitterAdmin: Only owner or factory can run this method.");
        _;
    }

    /**
    * @dev emitted when a new proxy is registered
    */
    event ProxyRegistered (
        address indexed proxyAddress,
        address indexed nftAddress
    );

    constructor() {
        owner = msg.sender;
        boolStorage[PAUSED] = false;
    }
    /**
    * @notice add a new value to addressStorage
     * only Admin owner can execute this function
    */
    function setAddressSettings(bytes32 _key, address _value)
    external
    onlyOwner
    {
        addressStorage[_key] = _value;
    }

    /**
      * @notice only factory and owner can execute this function
      * @dev registers a proxy in the settings
      * only Factory contract can execute this function
      *
     */
    function registerProxy(address _nft, uint _tokenId, address _proxy)
    external
    onlyFactory
    {
        boolStorage[keccak256(abi.encodePacked(PROXY, _nft, _tokenId, _proxy))] = true;
        addressStorage[keccak256(abi.encodePacked(_nft, _tokenId))] = _proxy;
        emit ProxyRegistered(_proxy, _nft);

    }

    /**
     * @dev registering factory contract in settings
     * only owner can execute this function
     */
    function registerFactory(address _value)
    external
    onlyOwner
    {
        addressStorage[FACTORY_ADDRESS] = _value;
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
        return boolStorage[keccak256(abi.encodePacked(PROXY, _nft, _tokenId, proxyAddress))];
    }

    /**
     * @notice add a new value to addressStorage
     * only owner can execute this function
     */
    function setBoolSettings(bytes32 _key, bool _value) external onlyOwner {
        boolStorage[_key] = _value;
    }

    /**
    * @notice this method is used to update the address of
     * the contract that implements NFTSplitter logic
     * only owner can execute this function
    */
    function upgrade(address _implementation) external onlyOwner {
        addressStorage[NFTSPLITTER_ADDRESS] = _implementation;
    }

    function changeOwner() external onlyOwner {
        require(owner != msg.sender, 'You already are the owner!');
        owner = msg.sender;
    }

    /**
     * @notice It pauses the creation of new splitter proxies in the factory contract
     * only  owner can execute this function
     */
    function pause() external onlyOwner {
        boolStorage[PAUSED] = true;
    }

    /**
     * @notice It unpauses the creation of new splitter proxies in the factory contract
     * only owner can execute this function
     */
    function unpause() external onlyOwner {
        boolStorage[PAUSED] = false;
    }

    /**
    * @notice used to get the pause status
     */
    function isPaused() external view returns (bool) {
        return boolStorage[PAUSED];
    }

    /* *
     * @notice it returns the current implementation of the NFTSplitter contract
     *  the address returned contains the logic executed by the splitter proxies
     */
    function getImplementation() external view returns (address) {
        return addressStorage[NFTSPLITTER_ADDRESS];
    }

    /**
     * @notice it returns the splitter proxy contract created for a specific NFT and tokenId
     * only Factory contract can execute this function
     */
    function getProxyAddressByNFT(address _nft, uint _tokenId)
    external view
    onlyFactory
    returns (address)
    {
        return addressStorage[keccak256(abi.encodePacked(_nft, _tokenId))];


    }
}

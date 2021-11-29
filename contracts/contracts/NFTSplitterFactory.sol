// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterProxy.sol";

contract NFTSplitterFactory {
  address private owner;
  address private settings;
  address private NFTSplitterBase;


  //is the app in pause state??
  modifier isNotPaused(){
    require (!NFTSplitterAdmin(settings).isPaused(), 'NFTSplitterFactory: Factory is paused');
    _;
  }
  modifier onlyOwner(){
    require (msg.sender == owner, 'NFTSplitterFactory: Factory is paused');
    _;
  }
    /**
     * @dev emitted everytime a splitter proxy is created
     */
    event ProxyCreated(
        address indexed nft,
        address indexed proxyAddress,
        address indexed NFTOwner
    );

  constructor(address _settings) {
    owner = msg.sender; // factory owner
    settings = _settings; // admin contract address
    NFTSplitterBase = NFTSplitterAdmin(settings).getImplementation(); //logic implementation
  }

  /**
   * @dev function that creates a new splitter proxy contract
   *
   */
  function createNFTSplitter(address _nft, uint _tokenId) public  isNotPaused returns (NFTSplitterProxy prx){
    prx = new NFTSplitterProxy (_nft, _tokenId, msg.sender, NFTSplitterBase, settings, "");
    NFTSplitterAdmin(settings).registerProxy(_nft, _tokenId,  address(prx));
    emit ProxyCreated(_nft, address(prx), msg.sender);
    return prx;
  }

  function getNFTSplitterBase() external view returns (address) {
    return NFTSplitterBase;
  }

  function getProxyAddressByNFT(address _nft, uint _tokenId) external view returns (address) {
    return NFTSplitterAdmin(settings).getProxyAddressByNFT(_nft, _tokenId);
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  /// @notice Withdraw any contract funds
  function withdraw() public {
    //TODO: implement withdraw and send founds to owner
  }
}

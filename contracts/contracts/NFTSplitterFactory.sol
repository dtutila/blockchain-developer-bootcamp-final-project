// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterProxy.sol";

/**
 * @notice This contract creates new Splitter proxies
 * @dev  it registers all proxy contracts in the storage of Admin contract

*/

contract NFTSplitterFactory {
  address private owner;
  address private settings;
  address private NFTSplitterBase;


  //is the app in pause state??
  modifier isNotPaused(){
    require (!NFTSplitterAdmin(settings).isPaused(), 'NFTSplitterFactory: Factory is paused');
    _;
  }
  // only owner can execute the function
  modifier onlyOwner(){
    require (msg.sender == owner, 'NFTSplitterFactory: not contract owner');
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
   * @notice function that creates a new splitter proxy contract
   * @dev registers the the proxy address in admin contract and emits a ProxyCreated event
   * it passes as parameter the address of the SplitterBase contract
   * this function can only be executed id the app is not paused
   */
  function createNFTSplitter(address _nft, uint _tokenId) public  isNotPaused returns (NFTSplitterProxy prx){
    prx = new NFTSplitterProxy (_nft, _tokenId, msg.sender, NFTSplitterBase, settings, "");
    NFTSplitterAdmin(settings).registerProxy(_nft, _tokenId,  address(prx));
    emit ProxyCreated(_nft, address(prx), msg.sender);
    return prx;
  }
  /**
  * @notice returns the current address od the Splitter Base contract that contains
  */
  function getNFTSplitterBase() external view returns (address) {
    return NFTSplitterBase;
  }
  /**
    * @notice returns the splitter proxy associated to a NFT-Tokenid
  */
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
  function withdraw() public onlyOwner{
    //TODO: implement withdraw and send founds to owner
  }
}

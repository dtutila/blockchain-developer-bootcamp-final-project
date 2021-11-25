// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterProxy.sol";

contract NFTSplitterFactory {
  address private owner;
  address private settings;
  address private NFTSplitterBase;
  address[] private splitters;

  //is the app in pause state??
  modifier isNotPaused(){
    require (!NFTSplitterAdmin(settings).isPaused(), 'NFTSplitterFactory: Factory is paused');
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
  function createNFTSplitter(address _nft, uint _tokenId) public payable isNotPaused returns (NFTSplitterProxy prx){
    prx = new NFTSplitterProxy (_nft, _tokenId, msg.sender, NFTSplitterBase, settings, "");
    NFTSplitterAdmin(settings).registerProxy(_nft,  address(prx));
    splitters.push(address(prx));
    emit ProxyCreated(_nft, address(prx), msg.sender);
    return prx;
  }

  function getNFTSplitterBase() external view returns (address) {
    return NFTSplitterBase;
  }

  //returns all the proxies created
  function getNFTSplitters() external view returns ( address[] memory ) {
    return splitters;
  }
  
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterProxy.sol";

contract NFTSplitterFactory {
  address private owner;
  address private settings;
  address private NFTSplitterBase;
  mapping(address => NFTSplitterProxy) private splitters;

    /**
     * @dev 
     */
    event ProxyCreated(
        address indexed proxyAddress,
        address indexed NFTOwner
    );

  constructor(address _settings) {
    owner = msg.sender; // factory owner
    settings = _settings;
    NFTSplitterBase = NFTSplitterAdmin(settings).getImplementation(); 
  }

  function createNFTSplitter() public payable returns (NFTSplitterProxy prx){
    prx = new NFTSplitterProxy (msg.sender, NFTSplitterBase, settings, "");
    emit ProxyCreated(address(prx), msg.sender);  
    return prx;
  }

  function getNFTSplitterBase() external view returns (address) {
    return NFTSplitterBase;
  }
  
}

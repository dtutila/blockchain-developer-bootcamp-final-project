// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterProxy.sol";

contract NFTSplitterFactory {
  address private owner;
  address private settings;
  address private NFTSplitterBase;
  mapping(address => NFTSplitterProxy) private splitters;

  constructor(address _settings) {
    owner = msg.sender;
    settings = _settings;
    NFTSplitterBase = NFTSplitterAdmin(settings).getImplementation(); 
  }

  function createNFTSplitter() public payable returns (NFTSplitterProxy){
    NFTSplitterProxy prx = new NFTSplitterProxy (NFTSplitterBase, owner, "");

    return prx;
  }

  function getNFTSplitterBase() external view returns (address) {
    return NFTSplitterBase;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/proxy/Proxy.sol";
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterStorage.sol";

contract NFTSplitterProxy is NFTSplitterStorage, Proxy {
    // Contract name
    string public name;

    // Contract symbol
    string public symbol;

    address private implementation;


    constructor(
        address _nft,
        uint _tokenId,
        address _owner,
        address _logic,
        address _settings,
        bytes memory _data
    ) payable {
        settings = _settings;
        implementation = _logic;
        name = "proxy";
        symbol = "PRX";
        originalOwner = _owner;
        originalNFT = _nft;
        tokenId = _tokenId;
    }

    function _implementation() internal view override returns (address) {
        return implementation;
    }

    function getSettings() external view returns (address) {
        return settings;
    }
}

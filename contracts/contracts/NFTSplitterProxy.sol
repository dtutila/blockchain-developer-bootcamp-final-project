// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
import "@openzeppelin/contracts/proxy/Proxy.sol";
import "./NFTSplitterAdmin.sol";
import "./NFTSplitterStorage.sol";

/**
 * @notice Proxy contract that is created in the Factory contract
 * @dev it delegates all the logic to the NFTSplitterBase contract that is
 *  passed as parameter during contract creation
*/
contract NFTSplitterProxy is NFTSplitterStorage, Proxy {
    // nft name
    string public name;
    // nft symbol
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

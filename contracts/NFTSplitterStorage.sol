// SPDX-License-Identifier: MIT
/**
 * @dev this contract has the state variables of the NFTSplitter and proxy contract
 * it helps to avoid storage collision when  delegate call is used
 *
 */
pragma solidity 0.8.3;
contract NFTSplitterStorage {

   // variables used to control logic
    uint8 public pieces; //number of pieces
    //TODO: implement initial sell supply logic
    // uint8 public initialSellSupply; //number of pieces that can be sold during lock time
    uint128 public buyPercentage; //extra value to pay by owner to buy back any sold piece
    //TODO: implement lock time logic
    //uint256 public lockEndDate; //number of days the pieces will be locked to buy/sell, value is set in constructor
    uint256 public unitPrice; //price of onr piece
    uint256 public tokenId;

    address public originalNFT; //original NFT address
    address public originalOwner; //original NFT owner address
    address public settings; // admin contract address
}

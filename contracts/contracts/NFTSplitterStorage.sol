// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NFTSplitterStorage {

   // variables used to control logic
    address public originalNFT; //original NFT address
    address public originalOwner; //original NFT owner address
    uint8 public pieces; //number of pieces
    uint256 public lockEndDate; //number of days the pieces will be locked to buy/sell, value is set in constructor
    uint8 public initialSellSupply; //number of pieces that can be sold during lock time
    uint256 public NFTPrice; //
    uint128 public buyPercentage;

    uint256 public tokenId;

    mapping(address => uint256) owners;
    mapping(uint256 => address) ownersByPiece;

    address public settings;


  constructor() public {
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NFTSplitterAdmin {
    bytes32 public constant PAUSED = keccak256("ADMIN_PAUSED");
    bytes32 public constant NFTSPLITTER_ADDRESS =
        keccak256("NFTSPLITTER_ADDRESS");
    bytes32 public constant PROXIE = keccak256("PROXIE");

    address private owner;
    mapping(bytes32 => address) private addressStorage;
    mapping(bytes32 => bool) private boolStorage;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can run this method.");
        _;
    }

    constructor() {
        owner = msg.sender;
        boolStorage[PAUSED] = false;
    }

    function setaddressSettings(bytes32 _key, address _value)
        external
        onlyOwner
    {
        addressStorage[_key] = _value;
    }

    function setboolSettings(bytes32 _key, bool _value) external onlyOwner {
        boolStorage[_key] = _value;
    }

    function upgrade(address _implementation) external onlyOwner {
        addressStorage[NFTSPLITTER_ADDRESS] = _implementation;
    }

    function changeOwner() external onlyOwner {
        require(owner != msg.sender, 'You already are the owner!');
        owner = msg.sender;
    }

    function pause() external onlyOwner {
        boolStorage[PAUSED] = true;
    }

    function unpause() external onlyOwner {
        boolStorage[PAUSED] = false;
    }

    function isPaused() external view returns (bool) {
        return boolStorage[PAUSED];
    }

    function getImplementation() external view returns (address) {
        return addressStorage[NFTSPLITTER_ADDRESS];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract NFTSplitter is ERC1155, AccessControl, Pausable, ERC1155Burnable {
    //initial roles
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // variables used to control logic
    address public originalNFT; //original NFT address
    address public originalOwner; //original NFT owner address
    uint8 public parts; //number of pieces
    uint256 public lockEndDate; //number of days the parts will be locked to buy/sell, value is set in constructor

    mapping(address => uint8) owners;

    //modifiers
    /**
     * @dev Modifier that checks that timestamp is greater than lock time
     *
     */
    modifier isNotLocked() {
        require(block.timestamp > lockEndDate);
        _;
    }

    /**
     * @dev Modifier that checks that only the original NFT owner can execute the trx
     *
     */
    modifier onlyOriginalNFTOwner() {
        require(originalOwner == msg.sender);
        _;
    }

    /**
     * @dev Modifier that checks that the original NFT owner is not executing the trx
     *
     */
    modifier notOriginalNFTOwner() {
        require(originalOwner != msg.sender);
        _;
    }

    /**
     * @dev Modifier that checks that all parts are owned by the same address
     *
     */
    modifier ownsAllParts() {
        require(owners[msg.sender] == parts);
        _;
    }

    //initial contructor, no logic yet
    /**
     * @dev contract constructor, it will recieve the NFT and it will mint the new parts
     * @param _originalNFTAddress Original NFT address
     * @param _originalOwner Original NFT owner
     * @param _parts    Number of parts that will be minted
     * @param _lockTime Lock time in days
     *
     */
    constructor(
        address _originalNFTAddress,
        address _originalOwner,
        uint8 _parts,
        uint8 _lockTime
    ) ERC1155("") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    //no set uri function needed
    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        revert();
    }

    //initial pause control
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    //initial pause control
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    //mint function will not be needed after contract creation
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        // _mint(account, id, amount, data);
        revert();
    }

    //mint function will not be needed after contract creation
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        // _mintBatch(to, ids, amounts, data);
        revert();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //it will return the original NFT uri
    /**
     * @dev this method will return the NFT uri
     * @return Original NFT uri
     */
    function uri(uint256) public view virtual override returns (string memory) {
        return "";
    }

    /**
     * @dev method used by the original NFT to buy back any piece that was sold
     *
     */
    function buyBackPart(uint256 splitId) public payable onlyOriginalNFTOwner {}

    /**
     * @dev method used to buy back piece of the original NFT from the original Owner
     *
     *
     */
    function buyPart(uint256 splitId) public payable notOriginalNFTOwner {}

    /**
     * @dev this method will burn all the NFT pieces and it will transfer the original NFT to the new owner.
     * This method can only be executed if the address owns all the pieces.
     *
     */
    function glueAllTogether() public ownsAllParts {}
}

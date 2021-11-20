// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./ERC1155.sol";
import "./NFTSplitterStorage.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract NFTSplitter is
    NFTSplitterStorage,
    ERC165,
    ERC1155,
    IERC1155Receiver
{
   // bytes4 internal constant ERC1155_RECEIVED_SIG = 0xf23a6e61;
   // bytes4 internal constant ERC1155_BATCH_RECEIVED_SIG = 0xbc197c81;
    uint8 public constant version = 1;

    //modifiers
    /**
     * @dev Modifier that checks that timestamp is greater than lock time
     *
     */
    modifier isNotLocked() {
        require(block.timestamp > lockEndDate, "NFTSplitter: Lock time is not over");
        _;
    }

    modifier allowToBuy() {
        if (block.timestamp < lockEndDate){
            require(owners[originalOwner] < initialSellAmount, "NFTSplitter: No more supply");
        } 
                
        _;
    }

    /**
     * @dev Modifier that checks that only the original NFT owner can execute the trx
     *
     */
    modifier onlyOriginalNFTOwner() {
        require(originalOwner == msg.sender, "NFTSplitter: Only original NFT owner can execute this function");
        _;
    }

    /**
     * @dev Modifier that checks that the original NFT owner is not executing the trx
     *
     */
    modifier notOriginalNFTOwner() {
        require(originalOwner != msg.sender, "NFTSplitter: Original NFT owner is not allowed to execute this function");
        _;
    }

    /**
     * @dev Modifier that checks that all pieces are owned by the same address
     *
     */
    modifier ownsAllPieces() {
        require(owners[msg.sender] == pieces, "NFTSplitter: You need to own all tokens");
        _;
    }


    /**
     * @dev 
     */
    event NFTSplit(
        address indexed originalNFTAddress,
        uint indexed id,
        uint indexed pieces,
        uint  price,
        uint  percentage,
        uint  lockTime,
        string name
    );


    constructor(
        
    ) ERC1155("") {
        name = "NFT Splitter";
        symbol = "NFTS";
    }

    //no set uri function needed
    function setURI(string memory newuri) public{
        revert();
    }


    //mint function will not be needed after contract creation
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public  {
        revert("Function not implemented");
    }

    //mint function will not be needed after contract creation
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        revert("Function not implemented");
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override  {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165, IERC165, ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //it will return the original NFT uri
    /**
     * @dev this method will return the NFT uri
     * @return Original NFT uri
     */
    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return ERC1155(originalNFT).uri(id);
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public virtual {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        _burn(account, id, value);
    }

    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public virtual {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        _burnBatch(account, ids, values);
    }

    function splitMyNFT(
        address _originalNFTAddress,
        uint256 _tokenId,
        uint256 _price,
        uint128 _buyPercentage,
        uint8 _pieces,
        uint8 _initialSellAmount,
        uint256 _lockTimeInDays
    ) public onlyOriginalNFTOwner {
        lockEndDate = block.timestamp + (_lockTimeInDays * 1 days);
        originalNFT = _originalNFTAddress;
        originalOwner = msg.sender;
        initialSellAmount = _initialSellAmount;
        name = string(abi.encodePacked("NFT Splitter - ", ERC1155(originalNFT).name()));
        symbol = string(abi.encodePacked("NS", ERC1155(originalNFT).symbol()));
       
        tokenId = _tokenId;
        pieces = _pieces;
        NFTPrice = _price;
        buyPercentage = _buyPercentage;

        uint256 amount = ERC1155(originalNFT).balanceOf(msg.sender, tokenId);
        _mint(msg.sender, tokenId, amount, "");
        ERC1155(originalNFT).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );
        owners[msg.sender] = amount;
        
        emit NFTSplit(originalNFT, tokenId, pieces, NFTPrice, buyPercentage, lockEndDate, name);
    }

    /**
     * @dev method used by the original NFT to buy back any piece that was sold
     *
     */
    function buyBackPiece(uint256 pieceId) public payable onlyOriginalNFTOwner {
        address currentOwner = ownersByPiece[pieceId];
        require(currentOwner != msg.sender);
        require (balanceOf(currentOwner, pieceId) > 0);
       

        ownersByPiece[pieceId] = msg.sender;
        owners[msg.sender] = pieceId;
        uint piecePrice = (NFTPrice * buyPercentage) / 100 / pieces;

        require(piecePrice >= msg.value);

        safeTransferFrom(currentOwner, msg.sender, pieceId, 1, "");
        (bool sent, bytes memory data) = currentOwner.call{value: msg.value}("");

        require(sent, "Failed to send Ether");
        
       
    }

    /**
     * @dev method used to buy back piece of the original NFT from the original Owner
     *
     *
     */
    function buyPart(uint256 pieceId) public payable notOriginalNFTOwner {
        address currentOwner = ownersByPiece[pieceId];
        require(currentOwner != msg.sender);

        uint piecePrice = NFTPrice / pieces;

        require(piecePrice >= msg.value);
        ownersByPiece[pieceId] = msg.sender;
        owners[msg.sender] = pieceId;

        safeTransferFrom(currentOwner, msg.sender, pieceId, 1, "");
        (bool sent, bytes memory data) = currentOwner.call{value: msg.value}("");

        require(sent, "Failed to send Ether");
    }

    /**
     * @dev this method will burn all the NFT pieces and it will transfer the original NFT to the new owner.
     * This method can only be executed if the address owns all the pieces.
     *
     */
    function glueAllTogether() public ownsAllPieces {
        uint256 amount = ERC1155(originalNFT).balanceOf(address(this), tokenId);
        ERC1155(originalNFT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );
    }

    function onERC1155Received(
        address, /*_operator*/
        address, /*_from*/
        uint256 _id,
        uint256, /*_amount*/
        bytes calldata /*_data*/
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address, /*_operator*/
        address, /*_from*/
        uint256[] memory, /*_ids*/
        uint256[] memory, /*_values*/
        bytes memory /*_data*/
    ) public pure override returns (bytes4) {
         return this.onERC1155BatchReceived.selector;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

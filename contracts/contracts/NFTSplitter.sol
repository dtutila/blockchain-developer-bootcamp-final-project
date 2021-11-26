// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC1155.sol";
import "./NFTSplitterStorage.sol";
import  "./NFTSplitterAdmin.sol";

contract NFTSplitter is
    NFTSplitterStorage,
    ERC165,
    ERC1155,
    IERC1155Receiver,
    ReentrancyGuard
{
    //base contract version
    uint8 public constant version = 1;

    //modifiers
    /**
     * @dev Modifier that checks that timestamp is greater than lock time
     * TODO: implement lock logic in contract

    modifier isNotLocked() {
        require(block.timestamp > lockEndDate, "NFTSplitter: Lock time is not over");
        _;
    }*/

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
        require(originalOwner != msg.sender, "NFTSplitter: Original NFT owner is not allowed to execute this function" );
        _;
    }

    /**
     * @dev Modifier that checks that all pieces are owned by the same address
     *
     */
    modifier ownsAllPieces() {
        require(balanceOf(msg.sender, tokenId) == pieces, "NFTSplitter: you should own all pieces to withdraw the original NFT");
        _;
    }

    /**
     * @dev emitted after split creation
     */
    event NFTSplit(
        address indexed originalNFTAddress,
        uint indexed id,
        uint indexed pieces,
        uint  price,
        uint  percentage
    );

    /**
     * @dev emitted when buyer buys a piece
     */
    event NFTSplitSold(
        address indexed pieceOwner,
        address indexed buyer,
        uint indexed amount,
        uint  price
    );
    /**
     * @dev emitted when nft owner buys a piece from buyer
     */
    event NFTSplitBuyBack(
        address indexed originalNFTAddress,
        address indexed buyer,
        uint  amount,
        uint  price
    );
    /**
     * @dev emitted when original nft is withdrawn from contract
     */
    event NFTWithdraw(
        address indexed originalNFTAddress,
        address indexed buyer

    );
    /**
     * @dev constructor with initial name and symbol values
     */
    constructor(
        
    ) ERC1155("") {
        name = "NFT Splitter";
        symbol = "NFTS";
    }

    event Log(string message);

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
        revert("Function not implemented");
    }

    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public virtual {
        revert("Function not implemented");
    }

    /**
     * @dev See {IERC1155-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public  override {
        require(
            NFTSplitterAdmin(settings).isValidProxy(originalNFT, address(this))
        ,
        "NFTSplitter: caller is not a valid proxy, owner nor approved "
        );
        _safeTransferFrom(from, to, id, amount, data);
    }

    function splitMyNFT(
        uint256 _tokenId,
        uint256 _price,
        uint128 _buyPercentage,
        uint8 _pieces
    ) public onlyOriginalNFTOwner {
        require (unitPrice == 0, 'NFTSplitter: splitter already created' );
        require(_price > 0, 'NFTSplitter: invalid price');
        require(_pieces > 0, 'NFTSplitter: invalid pieces' );
        require(_buyPercentage > 0, 'NFTSplitter: invalid percentage ' );

        unitPrice = _price;
        tokenId = _tokenId;
        pieces = _pieces;
        buyPercentage = _buyPercentage;
        originalOwner = msg.sender;
        //TODO: implement lock time logic
        //TODO: implement logic to not allow to sell more than initialSellSupply during lock time
        //lockEndDate = block.timestamp + (_lockTimeInDays * 1 days);
        //initialSellSupply = _initialSellAmount;

        //as name and symbol are not part of ERC1155
        //contract needs to catch any error executing the functions
        //if there is any error the state of the variables does not change
        //meaning that state of the variables will not change in proxy contract
        try ERC1155(originalNFT).name() returns (string memory result) {
            name = string(abi.encodePacked("NFT Splitter - ", result));
        } catch {
            emit Log("NFTSplitter: external call failed");
        }
        try ERC1155(originalNFT).symbol() returns (string memory result) {
            symbol = string(abi.encodePacked("NS", result));
        } catch {
            emit Log("NFTSplitter: external call failed");
        }

        _mint(msg.sender, tokenId, pieces, "");
        ERC1155(originalNFT).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            ERC1155(originalNFT).balanceOf(msg.sender, tokenId),
            ""
        );

        emit NFTSplit(originalNFT, tokenId, pieces, unitPrice, buyPercentage);
    }

    /**
     * @dev method used by the original NFT to buy back any piece that was sold
     *
     */

    function buyBackPieces(address _from, uint256 amount) public payable onlyOriginalNFTOwner nonReentrant {
        uint currentBalance = balanceOf(_from, tokenId);
        uint buyBackPrice = (unitPrice + (unitPrice * buyPercentage  / 100 )) * amount;
        require(msg.value  >= buyBackPrice, 'NFTSplitter: insufficient value for this transaction');

        _safeTransferFrom(_from, msg.sender, tokenId, amount, "");
        (bool sent, bytes memory data) = _from.call{value: buyBackPrice}("");

        require(sent, "Failed to send Ether");
        emit NFTSplitBuyBack(originalNFT, msg.sender, buyPercentage, buyBackPrice);

    }

    /**
     * @dev method used to buy a piece of the original NFT from the original Owner
     *
     *
     */
    function buyPiecesFromOwner( uint256 amount) public payable notOriginalNFTOwner nonReentrant {
        uint currentSupply = balanceOf(originalOwner, tokenId);
        require(currentSupply  >= amount, 'NFTSplitter: not enough pieces to buy');
        require(originalOwner != msg.sender, 'NFTSplitter: you are the current nft owner');

        uint piecePrice = unitPrice * amount;
        require(msg.value >= piecePrice, 'NFTSplitter: not enough value to buy pieces');

        _safeTransferFrom(originalOwner, msg.sender, tokenId, amount, "");
        (bool sent, bytes memory data) = originalOwner.call{value: msg.value}("");

        emit NFTSplitSold(originalOwner, msg.sender, amount, piecePrice);
        require(sent, "Failed to send Ether");
    }

    /**
     * @dev this method will burn all the NFT pieces and it will transfer the original NFT to the new owner.
     * This method can only be executed if the address owns all the pieces.
     *
     */
   // event log(address currentOwner, uint amount);
    function withdrawOriginalNFT() public ownsAllPieces nonReentrant {
         //burn pieces
        _burn(msg.sender, tokenId, pieces);
        ERC1155(originalNFT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            ERC1155(originalNFT).balanceOf(address(this), tokenId), //sending all tokens that proxy owns, aridrops??
            ""
        );
        emit NFTWithdraw(originalNFT, msg.sender);
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

    /// @notice Withdraw any contract funds
    /// @dev Only the original nft  owner execute call this function
    function withdraw() public onlyOriginalNFTOwner{
        //TODO: implement and create test for this scenario if applicable
    }
}

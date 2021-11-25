// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./ERC1155.sol";
import "./NFTSplitterStorage.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import  "./NFTSplitterAdmin.sol";

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
            require(owners[originalOwner] < initialSellSupply, "NFTSplitter: No more supply");
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
        require(originalOwner != msg.sender, "NFTSplitter: Original NFT owner is not allowed to execute this function" );
        _;
    }

    /**
     * @dev Modifier that checks that all pieces are owned by the same address
     *
     */
    modifier ownsAllPieces() {

        require(balanceOf(msg.sender, 1) == pieces, "NFTSplitter: you should own all pieces to withdraw the original NFT");
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

  /*  event NFTSplitDeployed(
        address indexed originalNFTAddress,
        address indexed NFTOwner
    );*/

    event NFTSplitSold(
        address indexed pieceOwner,
        address indexed buyer,
        uint indexed amount,
        uint  price
    );

    event NFTSplitBuyBack(
        address indexed originalNFTAddress,
        address indexed buyer,
        uint  amount,
        uint  price
    );

    event NFTWithdraw(
        address indexed originalNFTAddress,
        address indexed buyer,
        uint  amount

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
        uint8 _pieces,
        uint8 _initialSellAmount,
        uint256 _lockTimeInDays
    ) public onlyOriginalNFTOwner {
        lockEndDate = block.timestamp + (_lockTimeInDays * 1 days);
      //  originalNFT = _originalNFTAddress;
        originalOwner = msg.sender;
        initialSellSupply = _initialSellAmount;
        name = string(abi.encodePacked("NFT Splitter - ", ERC1155(originalNFT).name()));
        symbol = string(abi.encodePacked("NS", ERC1155(originalNFT).symbol()));
       
        tokenId = _tokenId;
        pieces = _pieces;
        NFTPrice = _price;
        buyPercentage = _buyPercentage;

        uint256 amount = ERC1155(originalNFT).balanceOf(msg.sender, tokenId);
        _mint(msg.sender, tokenId, pieces, "");
        ERC1155(originalNFT).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );
        owners[msg.sender] = amount;
        //setting the owners


        emit NFTSplit(originalNFT, tokenId, pieces, NFTPrice, buyPercentage, lockEndDate, name);
    }

    /**
     * @dev method used by the original NFT to buy back any piece that was sold
     *
     */

    function buyBackPieces(address _from, uint256 amount) public payable onlyOriginalNFTOwner {
        uint currentBalance = balanceOf(_from, 1);

       // require (currentBalance > 0 && currentBalance >= amount, 'NFTSplitter: not enough pieces to buy back');
       

        uint piecePrice = NFTPrice / pieces;//( (NFTPrice * buyPercentage) / ( 100 * pieces ));
        uint buyBackPrice = (piecePrice + (piecePrice * buyPercentage  / 100 )) * amount;
        require(msg.value  >= piecePrice, 'NFTSplitter: insufficient value for this transaction');

        safeTransferFrom(_from, msg.sender, 1, amount, "");
        (bool sent, bytes memory data) = _from.call{value: buyBackPrice}("");

        require(sent, "Failed to send Ether");
        emit NFTSplitBuyBack(originalNFT, msg.sender, buyPercentage, buyBackPrice);

    }

    /**
     * @dev method used to buy a piece of the original NFT from the original Owner
     *
     *
     */

    function buyPiecesFromOwner( uint256 amount) public payable notOriginalNFTOwner {
        uint currentSupply = balanceOf(originalOwner, 1);
        require(currentSupply - initialSellSupply >= amount, 'NFTSplitter: not enough pieces to buy');

        require(originalOwner != msg.sender, 'NFTSplitter: you are the current nft owner');

        uint piecePrice = (NFTPrice / pieces ) * amount;

        require(msg.value >= piecePrice, 'NFTSplitter: not enough value to buy pieces');

      //  ERC1155(address(this)).setApprovalForAll(buyer, true);
        safeTransferFrom(originalOwner, msg.sender, 1, amount, "");
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
    function withdrawOriginalNFT() public ownsAllPieces {

        //require(pieces == ownedPieces, 'NFTSplitter: you should own all pieces to withdraw the original NFT');
        uint256 amount = ERC1155(originalNFT).balanceOf(address(this), tokenId);
        ERC1155(originalNFT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );
        //burn pieces
        _burn(msg.sender, 1, pieces);
        emit NFTWithdraw(originalNFT, msg.sender, amount);

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

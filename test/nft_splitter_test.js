const base = artifacts.require("NFTSplitter");
const admin = artifacts.require("NFTSplitterAdmin");
const factory = artifacts.require("NFTSplitterFactory");
const nft = artifacts.require("NFTMock");
let BN = web3.utils.BN;


contract("NFTSplitterTest", function ( accounts ) {
  const [owner, alice, bob] = accounts;
  let factoryContract, adminContract, baseContract, aliceNFT, bobNFT;

  beforeEach(async () => {
    //deployer.deploy(aliceNFT)
    //NFTInstance = await aliceNFT.deployed();
    baseContract = await  base.deployed();
    adminContract = await  admin.deployed();
    factoryContract = await  factory.deployed();
    aliceNFT = await nft.new("Alice's NFT", 'ANFT', {from: alice});
    bobNFT = await nft.new("Bob's NFT", 'BNFT', {from: bob});
    await aliceNFT.mint(alice, 1, 122, '0x0000', {from: alice});
    await aliceNFT.setURI("URI:id", {from: alice});

  });
  
  it("Base contract should be configured in factory contract", async function () {
    const baseAddress = await factoryContract.getNFTSplitterBase.call();

    return assert.equal(baseContract.address, baseAddress, 'Base contract address must be configured');
  });

  it("should cretate a new proxy ", async function () {
    
    console.log('response', alice);
    const nftSplitter = await aliceNFT.balanceOf.call(alice, 1);
    console.log('response',Number(new BN(nftSplitter) ));
  });
});

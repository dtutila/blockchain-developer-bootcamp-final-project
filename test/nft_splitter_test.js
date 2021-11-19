const base = artifacts.require("NFTSplitter");
const admin = artifacts.require("NFTSplitterAdmin");
const factory = artifacts.require("NFTSplitterFactory");
const nft = artifacts.require("NFTMock");
const proxy = artifacts.require("NFTSplitterProxy");

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

    assert.equal(baseContract.address, baseAddress, 'Base contract address must be configured');
  });

  it("should cretate a new proxy ", async function () {
    const splitterProxy = await factoryContract.createNFTSplitter({from: alice});
    
    const proxyAddress = splitterProxy.logs[0].args.proxyAddress;
    const splitter = await proxy.at(proxyAddress, {from: alice});
    
    const name = await splitter.name.call();
    const settings = await splitter.getSettings();
    const originalOwner = await splitter.originalOwner.call();
  
    assert.equal(alice, originalOwner, 'Alice should be the proxy owner');
    assert.equal(name, 'proxy', 'Initial proxy nft name shoud be proxy');
    assert.equal(settings, adminContract.address, 'Settings value should be admin contract');
  });
});

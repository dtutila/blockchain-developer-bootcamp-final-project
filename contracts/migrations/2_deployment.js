const base = artifacts.require("NFTSplitter");
const admin = artifacts.require("NFTSplitterAdmin");
const factory = artifacts.require("NFTSplitterFactory");
const nft = artifacts.require("NFTMock");
const erc1155 = artifacts.require("NFTMock2");



module.exports = async function (deployer, network, accounts) {
    const [owner, alice, bob] = accounts;
    console.log('owner', owner);
    console.log(`Deploying to '${network}'.`)

    //deploy only for development network (testing)
    if (network === 'development') {
        await deployer.deploy(nft, 'test', 'test' ,  {from: owner});
        await deployer.deploy(erc1155, {from: owner});
    }
    //admin contract
    deployer.deploy(admin,  {from: owner});
    //base contract (this contract can be updated, new address is storage in admin settings)
    await deployer.deploy(base,  {from: owner}).then(async (txInfo) => {
            let instance = await admin.deployed();
            //setting the base contract, this same function can be use to update the base contract in the app
            await instance.upgrade(base.address, {from: owner});
    });

    
    //deploying factory contract
    await deployer.deploy(factory, admin.address, {from: owner}).then(async (txInfo) => {
        let f = await factory.deployed();
        let instance = await admin.deployed();
        await instance.registerFactory(f.address, {from: owner});

    });;
  
    console.log('admin->   ' , admin.address);
    console.log('factory-> ' , factory.address);
    console.log('base->    ' , base.address);

};

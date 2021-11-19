const base = artifacts.require("NFTSplitter");
const admin = artifacts.require("NFTSplitterAdmin");
const factory = artifacts.require("NFTSplitterFactory");
const nft = artifacts.require("NFTMock");



module.exports = async function (deployer, network, accounts) {
    const [owner, alice, bob] = accounts;
    console.log('owner', owner);
    console.log(`Deploying to '${network}'.`)

    if (network === 'development') {
        await deployer.deploy(nft, 'test', 'test' ,  {from: owner});
    }

    deployer.deploy(admin,  {from: owner});
    await deployer.deploy(base,  {from: owner}).then(async (txInfo) => {
            let instance = await admin.deployed();
            await instance.upgrade(base.address, {from: owner});
    });

    

    await deployer.deploy(factory, admin.address, {from: owner});
  
    console.log('DEPLOYMENT DONE');
};

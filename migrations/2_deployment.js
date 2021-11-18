const NFTSplitter = artifacts.require("NFTSplitter");

module.exports = function (deployer, network) {

    console.log(`Deploying to '${network}'.`)

    deployer.deploy(NFTSplitter);
  

};

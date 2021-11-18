const Migrations = artifacts.require("Migrations");
const NFTSplitter = artifacts.require("NFTSplitter");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  

};

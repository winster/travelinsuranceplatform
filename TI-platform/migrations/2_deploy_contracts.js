var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var LostBaggageClaim = artifacts.require('./LostBaggageClaim.sol')
var Mortal = artifacts.require('./Mortal.sol')

module.exports = function (deployer) {
  deployer.deploy(Mortal)
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
  deployer.link(ConvertLib, LostBaggageClaim)
  deployer.deploy(LostBaggageClaim)
}

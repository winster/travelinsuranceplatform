// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'
import '../styles/bootstrap.min.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import 'bootstrap'

// Import our contract artifacts and turn them into usable abstractions.
import lostBaggageClaimArtifact from '../../build/contracts/LostBaggageClaim.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const LostBaggageClaim = contract(lostBaggageClaimArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  accout: String,
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    LostBaggageClaim.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        self.setStatusOffline()
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        self.setStatusOffline()
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      App.account = accounts[0]
      console.log(accs)
      self.setStatusOnline()
      self.listenToEvents();
    })
  },

  setStatusOnline: function () {
    const connectionStatus = document.getElementById('connectionStatus')
    connectionStatus.classList.add("text-success")
    connectionStatus.innerHTML = "online"
  },

  setStatusOffline: function () {
    const connectionStatus = document.getElementById('connectionStatus')
    connectionStatus.classList.add("text-danger")
    connectionStatus.innerHTML = "offline"
  },

  setStatus: function (isSuccess, msg) {
    const status = document.getElementById('status')
    if(isSuccess) {
      status.classList.add("text-success")
    } else {
      status.classList.add("text-danger")
    }
    status.innerHTML = msg
  },

  listenToEvents: function() {
    LostBaggageClaim.deployed().then(function (instance) {
      console.log('before watch')
      instance.ClaimRequested().watch(function(error, event){
        console.log(JSON.stringify(event))
        document.getElementById('events').innerHTML += JSON.stringify(event);
      });
      instance.AddressAdded().watch(function(error, event){
        console.log(JSON.stringify(event))
        document.getElementById('events').innerHTML += JSON.stringify(event);
      });
    });
  },

  addAccountToNetwork: function () {
    const self = this

    let address = parseInt(document.getElementById('address').value)
    const smartContractSelect = document.getElementById("smartContractSelect");
    const smartContract = smartContractSelect.options[smartContractSelect.selectedIndex].value;
    const permissionLevelSelect = document.getElementById("permissionLevelSelect");
    const permissionLevel = permissionLevelSelect.options[permissionLevelSelect.selectedIndex].value;

    console.log(address, smartContract, permissionLevel)
    //address = parseInt(address, 16);
    //console.log(address)
    //this.setStatus('Initiating transaction... (please wait)')

    let claim
    LostBaggageClaim.deployed().then(function (instance) {
      claim = instance
      return claim.addAddressToNetwork(address, smartContract, permissionLevel, { from: App.account, gas: 200000 })
    }).then(function (result) {
      self.setStatus(true,'Successfully added')
    }).catch(function (e) {
      console.log(e)
      self.setStatus(false,'Error adding address; see log.')
    })

  },

  listNetworkAccounts: function() {
    const self = this
    let claim
    LostBaggageClaim.deployed().then(function (instance) {
      claim = instance
      return claim.size.call({ from: App.account })
    }).then(function (size) {
      console.log('size is ', size)
      self.setStatus(true,'size is '+size)
    }).catch(function (e) {
      console.log(e)
      self.setStatus(false, 'Error listing addresses')
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})

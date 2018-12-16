// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'
import '../styles/bootstrap.min.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import 'bootstrap'

// Import our contract artifacts and turn them into usable abstractions.
//import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
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
        self.setStatusOffline();
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      App.account = accounts[1]
      console.log(accs)
      self.setStatusOnline()
    })
  },

  setStatusOnline: function () {
    const connectionStatus = document.getElementById('connectionStatus')
    connectionStatus.classList.add("text-success");
    connectionStatus.innerHTML = "online"
  },

  setStatusOffline: function () {
    const connectionStatus = document.getElementById('connectionStatus')
    connectionStatus.classList.add("text-danger");
    connectionStatus.innerHTML = "offline"
  },

  initiateProcess: function () {
    const self = this
    const statusUl = document.getElementById('status');
    statusUl.innerHTML = "";
    setTimeout(function(){
      
      var newstatus = document.createElement("li");
      newstatus.setAttribute("class", "list-group-item");
      newstatus.innerHTML = "Fetching passenger details .... ";
      statusUl.appendChild(newstatus);
      
      const baggageStatusSelect = document.getElementById("baggageFormControlSelect");
      const baggageStatus = baggageStatusSelect.options[baggageStatusSelect.selectedIndex].value;

      if(baggageStatus == 'Lost') {
        setTimeout(function(){
          var newstatus = document.createElement("li");
          newstatus.setAttribute("class", "list-group-item");
          newstatus.innerHTML = "Notifying the passengers .... ";
          statusUl.appendChild(newstatus);
          
          const baggageId = document.getElementById("baggageId").value;
          const recordLocator = document.getElementById("recordLocator").value;
          setTimeout(function(){
            self.requestClaim(baggageId, recordLocator);
          }, 1000);
        }, 1000);
      }
    }, 1000);

  },

  airlineLogin: function() {
    console.log(App.account);
    const password = document.getElementById("password").value;
    web3.personal.unlockAccount(App.account, password, 600);
    document.getElementById('unlockStatus').innerHTML='Success';
    document.getElementById('unlockStatus').classList.add("text-success");
    document.getElementById('loginButton').innerHTML="logout";
    document.getElementById('closeButton').click();
  },

  requestClaim: function (baggageId, recordLocator) {
    const self = this
    const statusUl = document.getElementById('status');
    
    var newstatus = document.createElement("li");
    newstatus.setAttribute("class", "list-group-item");
    newstatus.innerHTML = "Executing the smart contract";
    statusUl.appendChild(newstatus);

    let claim
    LostBaggageClaim.deployed().then(function (instance) {
      claim = instance
      return claim.requestClaim(baggageId, recordLocator, { from: App.account })
    }).then(function () {
      var newstatus = document.createElement("li");
      newstatus.setAttribute("class", "list-group-item");
      newstatus.classList.add("success");
      newstatus.innerHTML = "Successfully initiated the claim request";
      statusUl.appendChild(newstatus);
    }).catch(function (e) {
      console.log(e)
      var newstatus = document.createElement("li");
      newstatus.setAttribute("class", "list-group-item");
      newstatus.classList.add("danger");
      newstatus.innerHTML = "Error sending request";
      statusUl.appendChild(newstatus);
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

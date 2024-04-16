console.log("hi1");
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("I see a metamask!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "connected!!";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function withdraw() {
  console.log("Withdrawing your balance");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      console.log("Calling the metamask,please wait");
      const transactionResponse = await contract.withdraw();
      await linstenForTransactionMine(transactionResponse, provider);
      console.log("withdraw is done");
    } catch (error) {
      console.log(error);
    }
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethamount").value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("signer:", await signer.getAddress());
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      console.log("Calling the metamask,please wait");
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await linstenForTransactionMine(transactionResponse, provider);
      console.log("Fund is Done");
    } catch (error) {
      console.log(error);
    }
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

function linstenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

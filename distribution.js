var provider = null;
var signer = null;
var account = null;

const contractAddress = "0xFF373EE3A2c60645d65d547Ad0aa0434fAC51f5D";
const contractAbi = [{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"administrator","type":"address"},{"internalType":"address","name":"depositAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"NftsAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"UserClaimed","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"distributionHistory","outputs":[{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getMyDistribution","outputs":[{"components":[{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct NftDistribution.Distribution[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReceptors","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"address[]","name":"users","type":"address[]"}],"name":"makeDistribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nftContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"receptors","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"removeNftsOutOfDate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
var myContract = null;

const level1 = "1493061011265167126244964198184541412411170283335545267344517718621091276560";
const level2 = "1493061011265167126244964198184541412411170283335545267344517719720602901836";
const level3 = "1493061011265167126244964198184541412411170283335545267344517717521579643784";
const level4 = "1493061011265167126244964198184541412411170283335545267344517720820114524612";
const level5 = "1493061011265167126244964198184541412411170283335545267344517721919626150888";
const level6 = "1493061011265167126244964198184541412411170283335545267344517723019137778164";
const level7 = "1493061011265167126244964198184541412411170283335545267344517724118649405540";

const ninetyDays = 7776000;

async function connectMetamask() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  account = await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  document.getElementById("account").textContent = "Selected address is : " + signer.provider.provider.selectedAddress;
  myContract = new ethers.Contract(contractAddress, contractAbi, provider);
}

async function makeDistribution() {
  let target_accounts = document.getElementById("dst_addr").value;
  let array_target = target_accounts.split(",");

  let level = document.getElementById("level");
  let nft = level.options[level.selectedIndex].text;

  if (nft == "Level 1") {
    id = level1;
  } else if (nft == "Level 2") {
    id = level2;
  } else if (nft == "Level 3") {
    id = level3;
  } else if (nft == "Level 4") {
    id = level4;
  } else if (nft == "Level 5") {
    id = level5;
  } else if (nft == "Level 6") {
    id = level6;
  } else if (nft == "Level 7") {
    id = level7;
  } else {
    id = "0";
  }

  if(id != 0) {
    const myContractWithSigner = myContract.connect(signer);
    const tx = await myContractWithSigner.makeDistribution(id, array_target);
    const receipt = await tx.wait();
    document.getElementById("make").textContent = "Transaction hash: " + receipt.transactionHash;
  }
}

async function checkMyDistributions() {
  document.getElementById("oneMonthAgo").textContent = "Calculating...";
  document.getElementById("twoMonthsAgo").textContent = "Calculating...";
  document.getElementById("threeMonthsAgo").textContent = "Calculating...";

  let distributionHistory = [];
  const myContractWithSigner = myContract.connect(signer);
  console.log(account[0])
  distributionHistory = await myContractWithSigner.getMyDistribution(account[0]);
  console.log(distributionHistory);

  let timestampDistribution;
  let now = Math.round(new Date().getTime() / 1000);
  let secondsLeft;
  let daysLeft;
  let nft;
  
  if(distributionHistory.length > 0) {
    timestampDistribution = Number(distributionHistory[distributionHistory.length-1].timestamp);
    if(timestampDistribution + ninetyDays > now) {
      secondsLeft = timestampDistribution + ninetyDays - now;
      daysLeft = Math.round((timestampDistribution + ninetyDays - now)/86400);
      nft = distributionHistory[distributionHistory.length-1].nftId;
      document.getElementById("oneMonthAgo").textContent = "The NFT with id " + nft + " will be burnt in " + daysLeft + " days";
    }
  } else {
    document.getElementById("oneMonthAgo").textContent = "";
  }

  if(distributionHistory.length > 1) {
    timestampDistribution = Number(distributionHistory[distributionHistory.length-2].timestamp);
    if(timestampDistribution + ninetyDays > now) {
      secondsLeft = timestampDistribution + ninetyDays - now;
      daysLeft = Math.round((timestampDistribution + ninetyDays - now)/86400);
      nft = distributionHistory[distributionHistory.length-2].nftId;
      document.getElementById("twoMonthsAgo").textContent = "The NFT with id " + nft + " will be burnt in " + daysLeft + " days";
    }
  } else {
    document.getElementById("twoMonthsAgo").textContent = "";
  }

  if(distributionHistory.length > 2) {
    timestampDistribution = Number(distributionHistory[distributionHistory.length-3].timestamp);
    if(timestampDistribution + ninetyDays > now) {
      secondsLeft = timestampDistribution + ninetyDays - now;
      daysLeft = Math.round((timestampDistribution + ninetyDays - now)/86400);
      nft = distributionHistory[distributionHistory.length-3].nftId;
      document.getElementById("threeMonthsAgo").textContent = "The NFT with id " + nft + " will be burnt in " + daysLeft + " days";
    }
  } else {
    document.getElementById("threeMonthsAgo").textContent = "";
  }
}

async function claim() {
  const myContractWithSigner = myContract.connect(signer);
  const tx = await myContractWithSigner.claim();
  const receipt = await tx.wait();
  document.getElementById("claim").textContent = "Transaction Hash : " + receipt.transactionHash;
}

async function remove() {
  const myContractWithSigner = myContract.connect(signer);
  const tx = await myContractWithSigner.removeNftsOutOfDate();
  const receipt = await tx.wait();
  document.getAnimations("remove").textContent = "Transaction Hash : " + receipt.transactionHash;
}
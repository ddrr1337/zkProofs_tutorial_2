const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
  const rpcUrl = network.config.url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const account = getAccount("main", provider);
  await getGasPrice();

  const accessDeployment = await deployments.get("Access");
  const accessAddress = accessDeployment.address;
  const accessAbi = accessDeployment.abi;

  console.log("contract at:", accessAddress);

  const accessContract = new ethers.Contract(accessAddress, accessAbi, account);

  const commitment =
    "0x2b4cf9f60cbafeb8935c43013868c5cef2b6134cf1af5915dc688af0d79044a4";

  const commitment1 =
    "0x06179c55ad384fd94ac4a139293969590cee1290298bda3c4e4dd7c6931b556b";

  const depositTx = await accessContract.deposit(commitment);

  console.log("TX:", depositTx.hash);
  await depositTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

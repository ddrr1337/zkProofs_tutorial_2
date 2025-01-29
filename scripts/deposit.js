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

  const commitment = "";

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

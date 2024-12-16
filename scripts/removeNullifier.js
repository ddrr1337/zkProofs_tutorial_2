const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  await getGasPrice();

  const accessDeployment = await deployments.get("Access");
  const accessAddress = accessDeployment.address;
  const accessAbi = accessDeployment.abi;

  const accessContract = new ethers.Contract(accessAddress, accessAbi, account);

  const removeNullifierTx = await accessContract.removeNullifier();

  console.log("Tx:", removeNullifierTx.hash);

  console.log("ACCESS ADDRESS: ", accessAddress);

  console.log(
    "-------------------- REMOVE NULLIFIER COMPLETED -----------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

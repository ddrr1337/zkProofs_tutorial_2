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

  const verifyTx = await accessContract.testAccess();

  console.log("Tx:", verifyTx.hash);

  await verifyTx.wait();

  console.log("ACCESS ADDRESS: ", accessAddress);

  console.log(
    "-------------------- TEST ACCESS TX COMPLETED -----------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

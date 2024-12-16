const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  await getGasPrice();

  const verifierDeployment = await deployments.get("Groth16Verifier");
  const verifierAddress = verifierDeployment.address;
  const verifierAbi = verifierDeployment.abi;

  const verifierContract = new ethers.Contract(
    verifierAddress,
    verifierAbi,
    account
  );

  const verify = await verifierContract.verifyProof();

  console.log("VERIFICATION:", verify);
  console.log("VERIFICATION ADDRESS: ", verifierAddress);

  console.log(
    "-------------------- VERIFICATION COMPLETED -----------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

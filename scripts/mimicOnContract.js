const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

function uintToBytes32Hex(uint) {
  let hex = uint.toString(16);

  hex = hex.padStart(64, "0");

  return "0x" + hex;
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  await getGasPrice();

  const testTreeDeployment = await deployments.get("MerkleTreeWithHistory");
  const testTreeAddress = testTreeDeployment.address;
  const testTreeAbi = testTreeDeployment.abi;

  const testTreeContract = new ethers.Contract(
    testTreeAddress,
    testTreeAbi,
    account
  );

  const generateHash = await testTreeContract.hashLeftRight("", "");
  console.log("MimicSponge Hash (uint256): ", generateHash.toString());

  console.log("MIMICSPONGE CONTRACT AT: ", testTreeAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

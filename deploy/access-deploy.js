require("dotenv").config();
const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { getGasPrice } = require("../utils/getGasPrice");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const gasMultiplier = 1.2;

  await getGasPrice();

  const verifyDeployment = await deployments.get("Groth16Verifier");
  const vierifierAddress = verifyDeployment.address;

  const constructorArgs = [vierifierAddress];

  const accessDeploy = await deploy("Access", {
    from: deployer,
    args: constructorArgs,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
    gasMultiplier: gasMultiplier,
  });

  console.log(
    "----------------------- ZK ACCESS DEPLOYED --------------------------"
  );

  const verifyContract = networkConfig[chainId].verify;

  if (verifyContract) {
    await verify(accessDeploy.address, constructorArgs, chainId);
    console.log(
      "----------------------- VERIFICATION COMPLETED --------------------------"
    );
  }
};

module.exports.tags = ["all", "access"];

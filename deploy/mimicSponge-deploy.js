require("dotenv").config();
const { getGasPrice } = require("../utils/getGasPrice");
const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");
const { mimcSpongecontract } = require("circomlibjs");
const { getAccount } = require("../utils/getAccount");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;

  const chainId = network.config.chainId;

  await getGasPrice();

  const contract = {
    contractName: "Hasher",
    abi: mimcSpongecontract.abi,
    bytecode: mimcSpongecontract.createCode("mimcsponge", 220),
  };

  // Write the artifact to a JSON file
  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/${contract.contractName}.sol`,
    `${contract.contractName}.json`
  );
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(contract, null, 2));
  console.log(`Artifact written to ${artifactPath}`);

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  console.log(`Deploying contract with account: ${account.address}`);

  // Deploy the contract
  const factory = new ethers.ContractFactory(
    contract.abi,
    contract.bytecode,
    account
  );
  const instance = await factory.deploy();

  await instance.deployed();

  console.log(`Contract deployed at address: ${instance.address}`);

  // Save deployment information to the deployments directory
  const deploymentPath = path.join(
    __dirname,
    `../deployments/${networkConfig[chainId].name}`,
    `${contract.contractName}.json`
  );
  const deploymentInfo = {
    address: instance.address,
    abi: contract.abi,
    bytecode: contract.bytecode,
    deployedAt: new Date().toISOString(),
    network: await provider.getNetwork(),
  };
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to ${deploymentPath}`);

  console.log(
    "----------------------- MIMICSPONGE HASHER DEPLOYED --------------------------"
  );
};

module.exports.tags = ["all", "mimic"];

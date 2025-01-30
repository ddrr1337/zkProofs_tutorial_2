require("dotenv").config();
const { getGasPrice } = require("../utils/getGasPrice");
const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");
const { mimcSpongecontract } = require("circomlibjs");
const { getAccount } = require("../utils/getAccount");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async () => {
  await getGasPrice();

  const chainId = network.config.chainId;
  const deploymentDir = path.join(
    __dirname,
    `../deployments/${networkConfig[chainId].name}`
  );

  fs.mkdirSync(deploymentDir, { recursive: true });

  const chainIdFile = path.join(deploymentDir, ".chainId");

  if (!fs.existsSync(chainIdFile)) {
    fs.writeFileSync(chainIdFile, chainId.toString(), "utf8");
    console.log(
      `Created .chainId file in ${chainIdFile} added chainId: ${chainId}`
    );
  } else {
    console.log(`.chainId already exists in  ${chainIdFile}`);
  }

  const contract = {
    contractName: "Hasher",
    abi: mimcSpongecontract.abi,
    bytecode: mimcSpongecontract.createCode("mimcsponge", 220),
  };

  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/${contract.contractName}.sol`,
    `${contract.contractName}.json`
  );
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(contract, null, 2));
  console.log(`Artifact written to ${artifactPath}`);

  const rpcUrl = network.config.url;

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const account = getAccount("main", provider);
  console.log(`Deploying contract with account: ${account.address}`);

  const factory = new ethers.ContractFactory(
    contract.abi,
    contract.bytecode,
    account
  );
  const instance = await factory.deploy();

  await instance.deployed();

  console.log(`Contract deployed at address: ${instance.address}`);

  const deploymentPath = path.join(
    deploymentDir,
    `${contract.contractName}.json`
  );
  const deploymentInfo = {
    address: instance.address,
    abi: contract.abi,
    bytecode: contract.bytecode,
    deployedAt: new Date().toISOString(),
    network: await provider.getNetwork(),
  };
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to ${deploymentPath}`);

  console.log(
    "----------------------- MIMICSPONGE HASHER DEPLOYED --------------------------"
  );
};

module.exports.tags = ["all", "mimic"];

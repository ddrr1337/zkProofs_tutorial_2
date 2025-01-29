const { getPastEvents } = require("./download.js");
const { ethers, deployments, network } = require("hardhat");
const circomlibjs = require("circomlibjs");
const { MerkleTree } = require("fixed-merkle-tree");
const BloomFilter = require("bloomfilter.js");
const { getAccount } = require("../../utils/getAccount.js");

let mimcHash;

const trees = {
  PARTS_COUNT: 4,
  LEVELS: 4, // const from contract
};

async function initMimc() {
  const mimcSponge = await circomlibjs.buildMimcSponge();
  mimcHash = (left, right) =>
    mimcSponge.F.toString(mimcSponge.multiHash([BigInt(left), BigInt(right)]));
  return mimcHash; // Devuelve la función mimcHash
}

function printTreeRoot(tree) {
  // Accedemos al último nivel del árbol (nivel más alto)
  const treeRoot = tree._layers[tree._layers.length - 1][0]; // El primer (y único) elemento del último nivel
  console.log("Tree root:", treeRoot);
}

async function main() {
  await initMimc();
  const netId = 11155111; // Sepolia
  const type = "Deposit";
  const events = []; // Empezamos con un arreglo vacío
  const accessDeployment = await deployments.get("Access");
  const accessAddress = accessDeployment.address;
  const accessAbi = accessDeployment.abi;

  console.log("contract at:", accessAddress);

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);

  const blockNumber = await provider.getBlockNumber();
  console.log("Número de bloque actual:", blockNumber);

  const fromBlock = blockNumber - 2000;

  const downloadedEvents = await getPastEvents({
    type,
    fromBlock,
    netId,
    events,
    contractAttrs: [accessAbi, accessAddress],
  });

  const eventsFormatted = downloadedEvents.map(
    ({ blockNumber, transactionHash, returnValues }) => {
      const { commitment, leafIndex, timestamp } = returnValues;
      return {
        timestamp,
        commitment,
        blockNumber,
        transactionHash,
        leafIndex: Number(leafIndex),
      };
    }
  );
  const bloom = new BloomFilter(eventsFormatted.length);

  const eventsData = eventsFormatted.reduce(
    (acc, { leafIndex, commitment, ...rest }, i) => {
      if (leafIndex !== i) {
      }

      const leave = commitment.toString();
      acc.leaves.push(leave);
      acc.metadata[leave] = { ...rest, leafIndex };

      return acc;
    },
    { leaves: [], metadata: {} }
  );

  const tree = new MerkleTree(trees.LEVELS, eventsData.leaves, {
    zeroElement:
      "21663839004416932945382355908790599225266501822907911457504978515578255421292",
    hashFunction: mimcHash,
  });

  const commitpentToProof = "";

  const path = tree.proof(commitpentToProof);

  const slices = tree.getTreeSlices(trees.PARTS_COUNT);

  slices.forEach((slice, index) => {
    slice.metadata = slice.elements.reduce((acc, curr) => {
      if (index < trees.PARTS_COUNT - 1) {
        bloom.add(curr);
      }
      acc.push(eventsData.metadata[curr]);
      return acc;
    }, []);
  });

  const treeRoot = tree._layers[trees.LEVELS][0];

  console.log(downloadedEvents);
  console.log("-------------------------------------------");
  console.log(eventsFormatted);
  console.log("-------------------------------------------");
  console.log("leaves", eventsData);
  console.log("leaves", eventsData.leaves.length);
  console.log("-------------------------------------------");
  console.log("tree", tree);
  console.log("-------------------------------------------");
  console.log("slices", slices);
  console.log("-------------------------------------------");
  console.log("Path", path);

  console.log("Tree root", treeRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

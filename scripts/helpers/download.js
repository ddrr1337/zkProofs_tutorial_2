const Web3 = require("web3");

async function getPastEvents({
  type,
  fromBlock,
  netId,
  events,
  contractAttrs,
}) {
  let downloadedEvents = events;

  rpcUrl = process.env.ALCHEMY_RPC;

  const provider = new Web3.providers.HttpProvider(rpcUrl);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(...contractAttrs);

  const currentBlockNumber = await web3.eth.getBlockNumber();
  const blockDifference = Math.ceil(currentBlockNumber - fromBlock);

  const blockRange = Number(netId) === 56 ? 4950 : blockDifference / 20;

  let chunksCount =
    blockDifference === 0 ? 1 : Math.ceil(blockDifference / blockRange);
  const chunkSize = Math.ceil(blockDifference / chunksCount);

  let toBlock = fromBlock + chunkSize;

  if (fromBlock < currentBlockNumber) {
    if (toBlock >= currentBlockNumber) {
      toBlock = currentBlockNumber;
      chunksCount = 1;
    }

    console.log(
      `Fetching ${type}, chainId - ${netId}`,
      `chunksCount - ${chunksCount}`
    );
    for (let i = 0; i < chunksCount; i++)
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log(`fromBlock - ${fromBlock}`);
        console.log(`toBlock - ${toBlock}`);

        const eventsChunk = await contract.getPastEvents(type, {
          fromBlock,
          toBlock,
        });

        if (eventsChunk) {
          downloadedEvents = downloadedEvents.concat(eventsChunk);
          console.log("downloaded events count - ", eventsChunk.length);
          console.log("____________________________________________");
        }
        fromBlock = toBlock;
        toBlock += chunkSize;
      } catch (err) {
        console.log(
          "getPastEvents events",
          `chunk number - ${i}, has error: ${err.message}`
        );
        chunksCount = chunksCount + 1;
      }
  }
  return downloadedEvents;
}

module.exports = { getPastEvents };

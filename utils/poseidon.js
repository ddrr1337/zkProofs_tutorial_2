// scripts/poseidon.js
const circomlibjs = require("circomlibjs");

async function poseidon(inputArray) {
  const poseidon = await circomlibjs.buildPoseidon();

  const hash = poseidon(inputArray);

  const hashHex = poseidon.F.toString(hash, 16);

  return "0x" + hashHex;
}

module.exports = { poseidon };

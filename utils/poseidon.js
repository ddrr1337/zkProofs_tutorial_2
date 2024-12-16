// scripts/poseidon.js
const circomlibjs = require("circomlibjs");

async function poseidon(inputArray) {
  // Cargar Poseidon desde circomlibjs
  const poseidon = await circomlibjs.buildPoseidon();

  const hash = poseidon(inputArray);

  // Convertir el hash a hexadecimal
  const hashHex = poseidon.F.toString(hash, 16);

  return "0x" + hashHex;
}

module.exports = { poseidon };

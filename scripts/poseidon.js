// scripts/poseidon.js

const { poseidon } = require("../utils/poseidon");

async function main() {
  // Inputs (pueden ser BigInt o números)
  const input1 = BigInt("0xb8DAF4394a82354b7771ad7235B0A7Eb5a87aCe3"); // Dirección en formato BigInt
  const input2 = BigInt("0x4d"); // Número arbitrario

  // Calcular el hash
  const hash = await poseidon([input1, input2]);

  console.log("poseidonHash", hash);
}

// Llama a la función principal y captura errores
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

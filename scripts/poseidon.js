const { poseidon } = require("../utils/poseidon");

async function main() {
  const input1 = BigInt("");
  const input2 = BigInt("");

  const hash = await poseidon([input1, input2]);

  console.log("poseidonHash", hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

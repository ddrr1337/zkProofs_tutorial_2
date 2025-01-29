function rawToBytes32(address) {
  address = address.toLowerCase().replace(/^0x/, "");

  if (address.length !== 40) {
    throw new Error("address is not 20 bytes (40 hex).");
  }

  // zeros to the left
  const paddedAddress = address.padStart(64, "0");

  return "0x" + paddedAddress;
}

async function main() {
  const raw = "";
  const bytes32 = rawToBytes32(raw);

  console.log(bytes32);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

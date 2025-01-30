function rawToBytes32(input) {
  if (typeof input === "number") {
    // If input is a number, convert it to a 32-byte hex representation
    let hex = input.toString(16).padStart(64, "0");
    return "0x" + hex;
  } else if (typeof input === "string") {
    // If input is a string, assume it's an Ethereum address and format it
    let address = input.toLowerCase().replace(/^0x/, "");

    if (address.length !== 40) {
      throw new Error("Address is not 20 bytes (40 hex characters).");
    }

    // Pad with leading zeros to make it 32 bytes (64 hex characters)
    return "0x" + address.padStart(64, "0");
  } else {
    throw new Error("Input must be a number or a valid Ethereum address.");
  }
}

async function main() {
  const raw1 = ""; // Ethereum address
  const raw2 = 0; // Integer

  console.log("Address to Bytes32:", rawToBytes32(raw1));
  console.log("Integer to Bytes32:", rawToBytes32(raw2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function rawToBytes32(address) {
  address = address.toLowerCase().replace(/^0x/, "");

  if (address.length !== 40) {
    throw new Error(
      "La dirección debe tener exactamente 20 bytes (40 caracteres hexadecimales)."
    );
  }

  // Rellenar con ceros a la izquierda hasta 32 bytes (64 caracteres hexadecimales)
  const paddedAddress = address.padStart(64, "0");

  // Agregar el prefijo "0x" nuevamente
  return "0x" + paddedAddress;
}

async function main() {
  const address = "0x26baAC08CB753303de111e904e19BaF91e6b5E4d";
  const bytes32 = rawToBytes32(address);

  console.log(bytes32);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers, deployments, network } = require("hardhat");
const { getAccount } = require("../utils/getAccount");
const { getGasPrice } = require("../utils/getGasPrice");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_RPC
  );
  const account = getAccount("main", provider);
  await getGasPrice();

  const verifierDeployment = await deployments.get("Groth16Verifier");
  const verifierAddress = verifierDeployment.address;
  const verifierAbi = verifierDeployment.abi;

  const verifierContract = new ethers.Contract(
    verifierAddress,
    verifierAbi,
    account
  );

  const verify = await verifierContract.verifyProof(
    [
      "0x057c4a751ca0a6c09b7d4369ca108e4d3a36e9693d8d6942686740dfce1cd5c5",
      "0x0eb9a6cf01e11c0a131b47f6e251cb2bd6690695e00a447acb5a3b3d73100305",
    ],
    [
      [
        "0x086ee647be294535e2092fb3021dbe34cd15e3634dc0083e6453f6e20162f58b",
        "0x10f7e130c5e9536008c4711cf1bd2f7ebe1ee0ccfd444e6d75da2d44ef236782",
      ],
      [
        "0x225bb3dd20e7bd61416d9c8973b29250ac2005688eaf9bf11ac3c70a9359cd63",
        "0x041a24de150cfa229453133e590e5aa707512a4f97a4e418899c5d65d0a0413b",
      ],
    ],
    [
      "0x15ae01b07e50af8516f5233e215546b6c50a6088373721be79c74f9baf730c6f",
      "0x1564afc78ba5237deb821495565dc613d666b841cec8a191142a90b9aeb6bc1d",
    ],
    [
      "0x20878742a916d466c258db1a748f658136a31b21d2a77a2d91f26d7a0b9faea7",
      "0x000000000000000000000000b8daf4394a82354b7771ad7235b0a7eb5a87ace3",
      "0x1d0234186a679a88fd03a2f4d52059ef600584f42ee97e17b10972c197031ce8",
    ]
  );

  console.log("VERIFICATION:", verify);
  console.log("VERIFICATION ADDRESS: ", verifierAddress);

  console.log(
    "-------------------- VERIFICATION COMPLETED -----------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

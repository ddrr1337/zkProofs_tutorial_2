require("dotenv").config();
const { ethers } = require("ethers");

const privateKey1 = process.env.PRIVATE_KEY;

function getAccount(type, provider) {
  if (type === "main") {
    return new ethers.Wallet(privateKey1, provider);
  } else {
    throw new Error("Wallet must be: main,sec,third,feed,feed_2");
  }
}

module.exports = { getAccount };

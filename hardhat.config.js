require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

console.log("Using RPC:", process.env.SEPOLIA_RPC_URL);

module.exports = {
  solidity: "0.8.21",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
const { ethers } = require("hardhat");

async function main() {
  const MyNFT = await ethers.deployContract("MyNFT");
  await MyNFT.waitForDeployment();
  console.log(`✅ Contract deployed to: ${MyNFT.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
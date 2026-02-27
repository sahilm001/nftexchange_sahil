const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  const name = await nft.name();
  console.log("NFT Collection Name:", name);

  // Save to file
  fs.writeFileSync("nft-name.txt", `NFT Name: ${name}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNft = await MyNFT.deploy();

  await myNft.waitForDeployment();
  const address = await myNft.getAddress();

  console.log("MyNFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
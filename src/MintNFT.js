import React from "react";
import { ethers } from "ethers";
import contractABI from "./artifacts/MyNFT.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
function MintNFT() {
  const mintNFT = async () => {
    try {
      if (!window.ethereum) return alert("Install MetaMask and connect to localhost:8545");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.mintNFT();
      console.log("Mint tx:", tx.hash);
      await tx.wait();
      alert("NFT minted: " + tx.hash);
    } catch (err) {
      console.error("Mint failed:", err);
      alert("Mint failed: " + (err?.message || err));
    }
  };

  return (
    <div>
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}

export default MintNFT;

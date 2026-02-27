import React from "react";
import { ethers } from "ethers";
import MyNFT from "./MyNFT.json";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const tokenURI = "https://ipfs.io/ipfs/bafkreiddwcsomom4jsdcmkqtlsu4krxepv3kv3yjksu6ah3t4eiyrwqhai";

function MintNFT() {
  const mintNFT = async () => {
    try {
      // ✅ Use ethers v6 style
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      const recipient = await signer.getAddress();
      const tx = await contract.mintNFT(recipient, tokenURI);
      await tx.wait();

      alert(`🎉 NFT Minted Successfully!\nTx Hash: ${tx.hash}`);
    } catch (error) {
      console.error("❌ Minting failed:", error);
      alert("Minting failed. Check console.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={mintNFT}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Mint NFT
      </button>
    </div>
  );
}

export default MintNFT;
import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contractConfig";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [did, setDid] = useState("");

  const generateDID = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const pk = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const pub = pk.slice(0, 40);
    const didString = `did:cognito:${pub}`;

    setPrivateKey(pk);
    setPublicKey(pub);
    setDid(didString);

    localStorage.setItem("privateKey", pk);
    localStorage.setItem("publicKey", pub);
    localStorage.setItem("did", didString);
  };

  // Register DID on blockchain
  const registerDIDOnChain = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = provider.getSigner(0);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.registerDID(
        did,
        ethers.hexlify(Buffer.from(publicKey))
      );

      await tx.wait();
      alert("DID successfully registered on blockchain!");
    } catch (error) {
      console.error(error);
      alert("Error registering DID on blockchain.");
    }
  };

  // Freeze DID
  const freezeDID = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.freezeDID(did);
      await tx.wait();
      alert("Identity frozen!");
    } catch (error) {
      console.error(error);
      alert("Error freezing DID");
    }
  };

  // Unfreeze DID
  const unfreezeDID = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.unfreezeDID(did);
      await tx.wait();
      alert("Identity unfrozen!");
    } catch (error) {
      console.error(error);
      alert("Error unfreezing DID");
    }
  };

  // Check DID status
  const checkDIDStatus = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const status = await contract.isFrozen(did);
      alert(`Identity Frozen: ${status}`);
    } catch (error) {
      console.error(error);
      alert("Error checking DID status");
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold text-green-400">PixelGenesis Wallet</h1>

      <button
        onClick={generateDID}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-md font-semibold"
      >
        Generate DID
      </button>

      <button
        onClick={registerDIDOnChain}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold"
      >
        Register DID On-Chain
      </button>

      <button
        onClick={freezeDID}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-md font-semibold"
      >
        Freeze Identity
      </button>

      <button
        onClick={unfreezeDID}
        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold"
      >
        Unfreeze Identity
      </button>

      <button
        onClick={checkDIDStatus}
        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-md font-semibold"
      >
        Check Identity Status
      </button>

      <div className="mt-6 text-left max-w-xl">
        <p><strong>DID:</strong> {did}</p>
        <p><strong>Public Key:</strong> {publicKey}</p>
        <p><strong>Private Key:</strong> {privateKey}</p>
      </div>
    </div>
  );
}

export default App;

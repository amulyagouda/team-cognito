import React, { useState } from "react";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [did, setDid] = useState("");

  const generateDID = () => {
    // STEP 1 — Generate random private key
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const pk = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // STEP 2 — Public key (placeholder until we integrate ethers.js)
    const pub = pk.slice(0, 40);

    // STEP 3 — DID format
    const didString = `did:cognito:${pub}`;

    setPrivateKey(pk);
    setPublicKey(pub);
    setDid(didString);

    // STEP 4 — Save locally
    localStorage.setItem("privateKey", pk);
    localStorage.setItem("publicKey", pub);
    localStorage.setItem("did", didString);
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

      <div className="mt-6 text-left max-w-xl">
        <p><strong>DID:</strong> {did}</p>
        <p><strong>Public Key:</strong> {publicKey}</p>
        <p><strong>Private Key:</strong> {privateKey}</p>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contractConfig";

function App() {
  const [did, setDid] = useState("");
  const [certList, setCertList] = useState([]);

  const fetchCertificates = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const certs = await contract.getCertificates(did);
      setCertList(certs);
    } catch (e) {
      console.error(e);
      alert("Verification failed!");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Verifier Portal</h1>

      <input
        style={{ padding: 12, width: 350, marginRight: 10 }}
        placeholder="Enter DID"
        onChange={(e) => setDid(e.target.value)}
      />

      <button
        style={{ padding: "12px 20px", background: "#60a5fa", borderRadius: 6 }}
        onClick={fetchCertificates}
      >
        Verify
      </button>

      <h3>Certificates:</h3>
      {certList.map((c, index) => (
        <div key={index} style={{ marginTop: 20, background: "#eee", padding: 20 }}>
          <p><b>Type:</b> {c.certType}</p>
          <p><b>IPFS CID:</b> {c.cid}</p>
          <a target="_blank" href={`https://gateway.pinata.cloud/ipfs/${c.cid}`}>
            🔗 View File
          </a>
        </div>
      ))}
    </div>
  );
}

export default App;

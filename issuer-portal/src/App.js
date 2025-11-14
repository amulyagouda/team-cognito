import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contractConfig";

function App() {
  const [did, setDid] = useState("");
  const [certType, setCertType] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const PINATA_JWT = "PASTE_YOUR_PINATA_JWT_HERE";

  const uploadCertificate = async () => {
    if (!did || !certType || !file) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const pinataRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );

      const cid = pinataRes.data.IpfsHash;
      console.log("Uploaded to IPFS:", cid);

      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = await provider.getSigner(0);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.issueCertificate(did, cid, certType);
      await tx.wait();

      alert("Certificate saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("ERROR issuing certificate");
    }

    setLoading(false);
  };

  return (
    <div style={box}>
      <h1>Issuer Portal</h1>

      <input style={input} placeholder="Student DID" onChange={(e) => setDid(e.target.value)} />
      <input style={input} placeholder="Certificate Type" onChange={(e) => setCertType(e.target.value)} />
      <input type="file" style={input} onChange={(e) => setFile(e.target.files[0])} />

      <button style={btn} onClick={uploadCertificate} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Issue Certificate"}
      </button>
    </div>
  );
}

const box = { width: 350, margin: "60px auto", padding: 30, background: "#222", color: "white", borderRadius: 10 };
const input = { width: "100%", padding: 10, marginBottom: 15, borderRadius: 6, border: "1px solid #555" };
const btn = { width: "100%", padding: 12, background: "#4ade80", borderRadius: 6, border: "none", cursor: "pointer" };

export default App;

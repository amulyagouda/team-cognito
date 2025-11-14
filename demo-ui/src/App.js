import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [tab, setTab] = useState("wallet");

  // WALLET
  const [did, setDid] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // ISSUER
  const [issueDID, setIssueDID] = useState("");
  const [certType, setCertType] = useState("");
  const [fileName, setFileName] = useState("");

  // VERIFIER
  const [verifyDID, setVerifyDID] = useState("");
  const [fakeCert, setFakeCert] = useState(null);

  // Generate DID
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
  };

  // Issue Certificate (Demo mode)
  const issueCertificateUI = () => {
    if (!issueDID || !certType || !fileName) {
      alert("Please fill all fields");
      return;
    }

    setFakeCert({
      did: issueDID,
      certType,
      file: fileName,
    });

    alert("Certificate Issued (Demo Only)");
  };

  // Verifier Logic
  const verifyUI = () => {
    // Age Proof Check
    if (verifyDID.startsWith("zk-age")) {
      alert("Age Verified ✔ User is 18+");
      return;
    }

    // Certificate Check
    if (fakeCert && verifyDID === fakeCert.did) {
      alert("Certificate Verified ✔");
      return;
    }

    alert("No record found ❌");
  };

  return (
    <div style={styles.container}>
      {/* NAVIGATION */}
      <div style={styles.navbar}>
        <button onClick={() => setTab("wallet")} style={styles.navBtn}>Wallet</button>
        <button onClick={() => setTab("issuer")} style={styles.navBtn}>Issuer</button>
        <button onClick={() => setTab("verifier")} style={styles.navBtn}>Verifier</button>
      </div>

      {/* WALLET TAB */}
      {tab === "wallet" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Wallet — Digital Identity</h2>

          <button style={styles.button} onClick={generateDID}>
            Generate DID
          </button>

          <p><b>DID:</b> {did}</p>
          <p><b>Public Key:</b> {publicKey}</p>
          <p><b>Private Key:</b> {privateKey}</p>

          <h3 style={{ marginTop: 20 }}>DID QR Code</h3>
          {did ? <QRCodeCanvas value={did} size={160} /> : <p>No DID yet</p>}

          {/* Zero-Knowledge Age Proof */}
          <h3 style={{ marginTop: 30, color: "#60a5fa" }}>Zero-Knowledge Age Proof</h3>
          <p style={{ fontSize: 12, color: "#aaa" }}>
            Prove you are 18+ without sharing Aadhaar or DOB.
          </p>

          <button
            style={{ ...styles.button, background: "#60a5fa", marginTop: 10 }}
            onClick={() => setVerifyDID("zk-age:verified-18plus")}
          >
            Generate 18+ Age Proof QR
          </button>

          <div style={{ marginTop: 20 }}>
            <QRCodeCanvas value="zk-age:verified-18plus" size={160} />
            <p style={{ fontSize: 12, marginTop: 10 }}>Scan to verify age</p>
          </div>
        </div>
      )}

      {/* ISSUER TAB */}
      {tab === "issuer" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Issuer — Issue Certificate</h2>

          <input
            placeholder="Student DID"
            style={styles.input}
            onChange={(e) => setIssueDID(e.target.value)}
          />
          <input
            placeholder="Certificate Type"
            style={styles.input}
            onChange={(e) => setCertType(e.target.value)}
          />
          <input
            type="file"
            style={styles.input}
            onChange={(e) => setFileName(e.target.files[0].name)}
          />

          <button style={styles.button} onClick={issueCertificateUI}>
            Issue Certificate
          </button>
        </div>
      )}

      {/* VERIFIER TAB */}
      {tab === "verifier" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Verifier — Verify Identity</h2>

          <input
            placeholder="Paste DID or Scan QR Result"
            style={styles.input}
            onChange={(e) => setVerifyDID(e.target.value)}
          />

          <button style={styles.button} onClick={verifyUI}>
            Verify
          </button>

          {/* AGE VERIFICATION */}
          {verifyDID.startsWith("zk-age") && (
            <div style={styles.certBox}>
              <h3 style={{ color: "#4ade80" }}>✔ Age Verified</h3>
              <p>User is above 18</p>
            </div>
          )}

          {/* CERTIFICATE RESULT */}
          {fakeCert && verifyDID === fakeCert.did && (
            <div style={styles.certBox}>
              <h3 style={{ color: "#4ade80" }}>✔ Certificate Verified</h3>
              <p><b>Type:</b> {fakeCert.certType}</p>
              <p><b>File:</b> {fakeCert.file}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#111",
    color: "white",
    padding: "20px",
    fontFamily: "Arial",
    textAlign: "center",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  navBtn: {
    padding: "10px 20px",
    background: "#333",
    borderRadius: "8px",
    border: "1px solid #555",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  card: {
    width: "360px",
    margin: "auto",
    padding: "30px",
    background: "#1f1f1f",
    borderRadius: "12px",
    border: "1px solid #333",
  },
  title: {
    marginBottom: "20px",
    color: "#4ade80",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "none",
    background: "#333",
    color: "white",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4ade80",
    color: "black",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
  },
  certBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#222",
    borderRadius: "8px",
    textAlign: "left",
  },
};

export default App;

import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [tab, setTab] = useState("wallet");

  // Wallet
  const [did, setDid] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // Issuer
  const [issueDID, setIssueDID] = useState("");
  const [certType, setCertType] = useState("");
  const [fileName, setFileName] = useState("");

  // Verifier
  const [verifyDID, setVerifyDID] = useState("");
  const [fakeCert, setFakeCert] = useState(null);

  const generateDID = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const pk = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");

    const pub = pk.slice(0, 40);
    const didStr = `did:cognito:${pub}`;

    setPrivateKey(pk);
    setPublicKey(pub);
    setDid(didStr);
  };

  const issueCertificateUI = () => {
    setFakeCert({
      did: issueDID,
      certType,
      file: fileName
    });
    alert("Certificate Issued (UI Only)");
  };

  const verifyUI = () => {
    if (fakeCert && verifyDID === fakeCert.did) {
      alert("Certificate VERIFIED ✔");
    } else {
      alert("No certificate found ❌");
    }
  };

  return (
    <div style={styles.container}>

      {/* Top Navigation */}
      <div style={styles.navbar}>
        <button onClick={() => setTab("wallet")} style={styles.navBtn}>
          Wallet
        </button>
        <button onClick={() => setTab("issuer")} style={styles.navBtn}>
          Issuer
        </button>
        <button onClick={() => setTab("verifier")} style={styles.navBtn}>
          Verifier
        </button>
      </div>

      {/* Wallet Portal */}
      {tab === "wallet" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Wallet — Generate DID</h2>

          <button style={styles.button} onClick={generateDID}>
            Generate DID
          </button>

          <p><b>DID:</b> {did}</p>
          <p><b>Public Key:</b> {publicKey}</p>
          <p><b>Private Key:</b> {privateKey}</p>

          <h3 style={{ marginTop: 20 }}>Digital ID QR</h3>
          {did ? <QRCodeCanvas value={did} size={160} /> : <p>No DID</p>}
        </div>
      )}

      {/* Issuer Portal */}
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

      {/* Verifier Portal */}
      {tab === "verifier" && (
        <div style={styles.card}>
          <h2 style={styles.title}>Verifier — Verify Certificate</h2>

          <input
            placeholder="Enter DID"
            style={styles.input}
            onChange={(e) => setVerifyDID(e.target.value)}
          />

          <button style={styles.button} onClick={verifyUI}>
            Verify
          </button>

          {fakeCert && verifyDID === fakeCert.did && (
            <div style={styles.certBox}>
              <p><b>Certificate Type:</b> {fakeCert.certType}</p>
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
    marginBottom: "30px"
  },
  navBtn: {
    padding: "10px 20px",
    background: "#333",
    borderRadius: "8px",
    border: "1px solid #555",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold"
  },
  card: {
    width: "360px",
    margin: "auto",
    padding: "30px",
    background: "#1f1f1f",
    borderRadius: "12px",
    border: "1px solid #333"
  },
  title: {
    marginBottom: "20px",
    color: "#4ade80"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "none",
    background: "#333",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4ade80",
    color: "black",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },
  certBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#222",
    borderRadius: "8px",
    textAlign: "left"
  }
};

export default App;


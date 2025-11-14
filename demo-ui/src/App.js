import React, { useState, useEffect } from "react";
// Removed: import { QRCodeCanvas } from "qrcode.react"; // Dependency caused build failure

// --- START: Functional Display Component (Used for all ID/Proof sharing) ---
const DisplayCodePlaceholder = ({ value, label, fgColor, bgColor }) => {
    
    const handleCopy = () => {
        if (value) {
            // Using document.execCommand('copy') for better compatibility in iFrames
            const el = document.createElement('textarea');
            el.value = value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert(`Copied "${label}" to clipboard: ${value.substring(0, 30)}...`);
        }
    };

    if (!value) return <p style={{ color: '#aaa' }}>No data for {label}</p>;

    return (
        <div style={{
            padding: '10px',
            backgroundColor: bgColor || '#1a1a1a',
            borderRadius: '8px',
            border: `2px solid ${fgColor || '#4ade80'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100px'
        }}>
            <p style={{ margin: '5px 0', fontSize: '10px', color: '#ccc' }}>{label} String:</p>
            <p style={{ 
                wordBreak: 'break-all', 
                fontWeight: 'bold', 
                color: fgColor || '#4ade80',
                fontSize: '10px',
                textAlign: 'center',
                margin: '5px 0'
            }}>
                {value}
            </p>
            <button 
                onClick={handleCopy}
                style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    background: fgColor || '#4ade80',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px'
                }}
            >
                Click to Copy
            </button>
        </div>
    );
};
// --- END: Functional Display Component ---


// The local storage key to persist the identity data
const LOCAL_STORAGE_KEY = "cognitoDIDs";

// Helper function to get data for a specific key (user)
const getInitialData = (authKey) => {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    return data[authKey] || { certificates: [], did: "", publicKey: "", privateKey: "" };
  } catch (e) {
    console.error("Error loading data from local storage:", e);
    return { certificates: [], did: "", publicKey: "", privateKey: "" };
  }
};

// Helper function to save data for a specific key (user)
const saveData = (authKey, data) => {
  try {
    const allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    allData[authKey] = data;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allData));
  } catch (e) {
    console.error("Error saving data to local storage:", e);
  }
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authKey, setAuthKey] = useState("");
  const [loginInput, setLoginInput] = useState("");
  const [tab, setTab] = useState("wallet");

  // WALLET & DATA STATE (Derived from current user/key)
  const [did, setDid] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [certificates, setCertificates] = useState([]);
  
  // New state for Aadhaar Proof generation
  const [aadhaarProof, setAadhaarProof] = useState(""); 
  
  // New state for simple Age Proof visibility
  const [showSimpleAgeProof, setShowSimpleAgeProof] = useState(false); 

  // ISSUER
  const [issueDID, setIssueDID] = useState("");
  const [certType, setCertType] = useState("");
  const [fileName, setFileName] = useState("");

  // VERIFIER
  const [verifyDID, setVerifyDID] = useState("");
  const [message, setMessage] = useState("");
  
  // State for setting custom key on generation
  const [customKeyInput, setCustomKeyInput] = useState("");


  // Load user data on successful login (authKey change)
  useEffect(() => {
    if (authKey) {
      const data = getInitialData(authKey);
      setDid(data.did);
      setPublicKey(data.publicKey);
      setPrivateKey(data.privateKey);
      setCertificates(data.certificates);
      setIsLoggedIn(true);
      setMessage("User identity loaded successfully.");
    }
  }, [authKey]);

  // Save user data whenever certificates or wallet info changes
  useEffect(() => {
    if (authKey) {
      saveData(authKey, { did, publicKey, privateKey, certificates });
    }
  }, [did, publicKey, privateKey, certificates, authKey]);


  // --- LOGIN/LOGOUT LOGIC ---

  const handleLogin = () => {
    if (!loginInput) {
      setMessage("Please enter a Private Key to log in.");
      return;
    }
    // Simple authentication: treat the input key as the unique user ID
    setAuthKey(loginInput);
    setLoginInput("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthKey("");
    setDid("");
    setCertificates([]);
    setMessage("Logged out successfully.");
    setTab("wallet");
  };

  // --- IDENTITY & CERTIFICATE LOGIC ---

  // Generate DID (creates a new key/identity if one isn't loaded)
  const generateDID = () => {
    let pk;
    
    if (customKeyInput.length > 5) {
        // Use user-provided key if available
        // Ensure the key is used as is, for consistent login later
        pk = customKeyInput;
    } else {
        // Generate a new key pair if no custom input
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        pk = Array.from(array)
            .map((b) => Math.floor(Math.random() * 256).toString(16).padStart(2, "0"))
            .join("");
    }
    
    // Public key is derived from a part of the private key for this method
    const pub = pk.slice(0, 40);
    const didString = `did:cognito:${pub}`;

    // Set state for the *current* session/key
    setPrivateKey(pk);
    setPublicKey(pub);
    setDid(didString);
    setCertificates([]); // Clear old certs for new identity

    // Set the new private key as the authenticated session key
    setAuthKey(pk);
    setCustomKeyInput(""); // Clear input after use
    setMessage("New DID generated and authenticated.");
  };

  // Generate Aadhaar Proof (simulates fetching ZK proof tied to Aadhaar)
  const generateAadhaarProof = () => {
    if (!did) {
        setMessage("Please generate a base DID first.");
        return;
    }
    // Create a deterministic but unique proof string based on the user's DID
    // This proof string now signifies both Aadhaar ID verification AND Age 18+ verification
    const proof = `zk-aadhaar-age-proof:${did.slice(-10)}:${Date.now().toString().slice(-4)}`;
    setAadhaarProof(proof);
    setMessage("Aadhaar Proof generated and ready to share.");
  };
  
  // Toggle simple age proof visibility
  const toggleSimpleAgeProof = () => {
      setShowSimpleAgeProof(prev => !prev);
  }

  // Issue Certificate (Non-Demo)
  const issueCertificateUI = () => {
    if (!issueDID || !certType || !fileName) {
      setMessage("Please fill all fields.");
      return;
    }

    const newCert = {
      id: Date.now(),
      did: issueDID,
      certType,
      file: fileName,
      issueDate: new Date().toLocaleDateString(),
    };

    setCertificates(prev => [...prev, newCert]);
    setMessage("Certificate Issued Successfully!");
  };

  // Verifier Logic
  const verifyUI = () => {
    let resultMessage = "No record found ❌";
    
    // Combined Aadhaar and Age Proof Check
    if (verifyDID.startsWith("zk-aadhaar-age-proof")) {
      resultMessage = "Aadhaar Identity & Age Verified ✔";
    }
    // Separate Age Proof Check (for backward compatibility or simpler verification)
    else if (verifyDID.startsWith("zk-age")) {
      resultMessage = "Age Verified ✔ User is 18+";
    }
    
    // Certificate Check
    const found = certificates.find(cert => cert.did === verifyDID);

    if (found) {
      resultMessage = "Certificate Verified ✔";
    }

    setMessage(resultMessage);
  };

  // --- UI STYLES ---

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#0d0d0d", // Darker background
      color: "white",
      padding: "40px 20px",
      fontFamily: "Roboto, Arial, sans-serif",
      textAlign: "center",
    },
    navbar: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "40px",
    },
    navBtn: {
      padding: "12px 25px",
      background: '#333',
      color: 'white',
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      transition: "all 0.3s",
    },
    activeNavBtn: {
      background: tab === 'wallet' ? '#4ade80' : tab === 'issuer' ? '#facc15' : '#60a5fa',
      color: 'black',
      boxShadow: '0 0 15px rgba(250, 250, 250, 0.2)',
    },
    card: {
      width: "400px",
      margin: "auto",
      padding: "35px",
      background: "#1a1a1a",
      borderRadius: "16px",
      border: "1px solid #2e2e2e",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      textAlign: "left",
    },
    title: {
      marginBottom: "25px",
      color: "#4ade80",
      textAlign: "center",
      borderBottom: "1px solid #2e2e2e",
      paddingBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #555",
      background: "#2e2e2e",
      color: "white",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#4ade80",
      color: "black",
      fontWeight: "bold",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
      transition: "background 0.3s",
      textAlign: "center",
    },
    certBox: {
      marginTop: "10px",
      padding: "15px",
      background: "#2e2e2e",
      borderRadius: "10px",
      borderLeft: "5px solid #4ade80",
      marginBottom: "10px",
    },
    keyText: {
      fontSize: "12px",
      wordBreak: "break-all",
      color: "#ccc"
    },
    messageBox: {
        marginTop: "20px",
        padding: "15px",
        background: "#333",
        color: "white",
        borderRadius: "8px",
        textAlign: "center",
        minHeight: "40px"
    },
    smallButton: {
        width: "auto",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "background 0.3s",
        textAlign: "center",
        display: "block",
        margin: "15px auto 10px auto"
    }
  };

  // --- RENDER LOGIN PAGE ---
  const renderLogin = () => (
    <div style={styles.card}>
      <h2 style={{...styles.title, color: "#facc15"}}>🔑 Load Existing Identity</h2>
      <p style={{textAlign: 'center', marginBottom: 20, color: '#aaa'}}>
        Enter your Private Key to securely load your wallet and credentials.
      </p>

      <input
        type="password"
        placeholder="Enter Private Key / Recovery Phrase"
        style={styles.input}
        value={loginInput}
        onChange={(e) => setLoginInput(e.target.value)}
      />

      <button 
        style={{...styles.button, background: "#facc15", color: "black"}} 
        onClick={handleLogin}
      >
        Access Wallet
      </button>

      <div style={{ marginTop: 30, paddingTop: 20, borderTop: "1px dashed #2e2e2e", textAlign: 'center' }}>
        <p style={{color: '#aaa', marginBottom: 15}}>
          Don't have a key? Set your own private key to generate a new DID:
        </p>

        <input
            placeholder="Set Your Custom Private Key (5+ characters) or leave blank to auto-generate"
            style={styles.input}
            value={customKeyInput}
            onChange={(e) => setCustomKeyInput(e.target.value)}
        />
        
        <button 
          style={{...styles.button, width: 'auto', padding: '10px 20px', background: "#4ade80"}} 
          onClick={generateDID}
        >
          Generate New DID
        </button>
      </div>
    </div>
  );

  // --- MAIN APP RENDER ---
  const renderApp = () => (
    <div style={{ padding: "0 20px" }}>
      <div style={styles.navbar}>
        <button 
          onClick={() => setTab("wallet")} 
          style={{ ...styles.navBtn, ...(tab === 'wallet' && styles.activeNavBtn) }}
        >
          Wallet 🦊
        </button>
        <button 
          onClick={() => setTab("issuer")} 
          style={{ ...styles.navBtn, ...(tab === 'issuer' && styles.activeNavBtn) }}
        >
          Issuer 🎓
        </button>
        <button 
          onClick={() => setTab("verifier")} 
          style={{ ...styles.navBtn, ...(tab === 'verifier' && styles.activeNavBtn) }}
        >
          Verifier 🔍
        </button>
        <button 
          onClick={handleLogout} 
          style={{ ...styles.navBtn, background: '#ff6347', color: 'white' }}
        >
          Logout
        </button>
      </div>

      {message && (
        <div style={styles.messageBox}>
            {message}
        </div>
      )}

      {/* WALLET TAB */}
      {tab === "wallet" && (
        <div style={styles.card}>
          <h2 style={{...styles.title, color: "#4ade80"}}>Digital Identity Wallet</h2>
          
          <p style={{ marginTop: 20 }}><b>Current Key:</b> <span style={styles.keyText}>{authKey.substring(0, 6)}...</span></p>

          <p style={{ marginTop: 10 }}><b>DID:</b> <span style={styles.keyText}>{did || 'No DID associated with this key'}</span></p>
          <p><b>Public Key:</b> <span style={styles.keyText}>{publicKey}</span></p>
          <p><b>Private Key:</b> <span style={styles.keyText}>{privateKey}</span></p>

          <h3 style={{ marginTop: 20, textAlign: "center" }}>Copy DID</h3>
          <div style={{textAlign: "center", margin: "15px 0"}}>
            {did ? <DisplayCodePlaceholder value={did} label="DID" fgColor="#4ade80" bgColor="#1a1a1a"/> : <p style={{color: '#aaa'}}>No DID yet</p>}
          </div>

          {/* Zero-Knowledge Proofs Section */}
          <h3 style={{ marginTop: 30, color: "#60a5fa", textAlign: "center", borderBottom: "1px solid #2e2e2e", paddingBottom: 10 }}>Zero-Knowledge Proofs</h3>
          
          {/* Aadhaar Proof (Now includes age verification) */}
          <p style={{ fontSize: 12, color: "#ccc", textAlign: "center", marginTop: 15 }}>
            Generate proof of **Aadhaar Identity** and **Age (18+)** simultaneously.
          </p>
          <button
            style={{ ...styles.button, background: "#60a5fa", color: "white", marginTop: 10 }}
            onClick={generateAadhaarProof}
            disabled={!did}
          >
            Generate Aadhaar + Age Proof
          </button>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            {aadhaarProof ? (
                <DisplayCodePlaceholder value={aadhaarProof} label="Aadhaar & Age Proof" fgColor="#60a5fa" bgColor="#1a1a1a"/>
            ) : (
                <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>Click above to generate proof.</p>
            )}
            <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>Verifier must paste this code to verify identity and age.</p>
          </div>
          
          {/* ZK Age Proof (Simpler standalone age check) */}
          <h4 style={{ fontSize: 14, color: "#ccc", textAlign: "center", marginTop: 30 }}>
            Quickly prove you are 18+
          </h4>
          <button
            style={{ ...styles.smallButton, background: showSimpleAgeProof ? '#ff6347' : '#4ade80', color: showSimpleAgeProof ? 'white' : 'black' }}
            onClick={toggleSimpleAgeProof}
          >
            {showSimpleAgeProof ? 'Hide Age Proof' : 'Show Age Proof'}
          </button>

          <div style={{ marginTop: 5, textAlign: "center", display: showSimpleAgeProof ? 'block' : 'none' }}>
            <DisplayCodePlaceholder value="zk-age:verified-18plus" label="Age Proof" fgColor="#4ade80" bgColor="#1a1a1a"/>
            <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>Verifier must paste this code to verify age.</p>
          </div>
        </div>
      )}

      {/* ISSUER TAB */}
      {tab === "issuer" && (
        <div style={styles.card}>
          <h2 style={{...styles.title, color: "#facc15"}}>Certificate Issuer Portal</h2>
          
          <input
            placeholder="Recipient DID (did:cognito:...)"
            style={styles.input}
            onChange={(e) => setIssueDID(e.target.value)}
          />
          <input
            placeholder="Certificate Type (e.g., Graduation, Employment)"
            style={styles.input}
            onChange={(e) => setCertType(e.target.value)}
          />
          <input
            type="file"
            style={{...styles.input, paddingTop: 10}}
            onChange={(e) => setFileName(e.target.files[0].name)}
          />

          <button style={{...styles.button, background: "#facc15", color: "black"}} onClick={issueCertificateUI}>
            Issue Certificate
          </button>
          
          <h3 style={{ marginTop: 30, color: "#facc15", borderBottom: "1px solid #2e2e2e", paddingBottom: 10 }}>Issued Certificates ({certificates.length})</h3>
            
          <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 5 }}>
            {certificates.length > 0 ? (
                certificates.map((cert) => (
                    <div key={cert.id} style={{ ...styles.certBox, borderLeft: '5px solid #facc15' }}>
                        <p><b>Recipient:</b> <span style={{fontSize: 12, color: "#ccc"}}>{cert.did.substring(0, 20)}...</span></p>
                        <p><b>Type:</b> {cert.certType}</p>
                        <p><b>File:</b> {cert.file}</p>
                    </div>
                ))
            ) : (
                <p style={{color: '#aaa', textAlign: 'center'}}>No certificates have been issued yet.</p>
            )}
          </div>
        </div>
      )}

      {/* VERIFIER TAB */}
      {tab === "verifier" && (
        <div style={styles.card}>
          <h2 style={{...styles.title, color: "#60a5fa"}}>Identity Verifier Tool</h2>

          <input
            placeholder="Paste DID or Scan QR Result"
            style={styles.input}
            onChange={(e) => setVerifyDID(e.target.value)}
          />

          <button style={{...styles.button, background: "#60a5fa", color: "white"}} onClick={verifyUI}>
            Verify
          </button>

          {/* Verification Results Display */}
          <h3 style={{ marginTop: 30, color: "#60a5fa", borderBottom: "1px solid #2e2e2e", paddingBottom: 10 }}>Verification Results</h3>

          {verifyDID && (
            <div style={{ maxHeight: 250, overflowY: 'auto', paddingRight: 5 }}>
              {/* COMBINED AADHAAR & AGE VERIFICATION DISPLAY */}
              {verifyDID.startsWith("zk-aadhaar-age-proof") && (
                <div style={{ ...styles.certBox, borderLeft: '5px solid #4ade80' }}>
                  <h3 style={{ color: "#4ade80", margin: 0 }}>✔ Aadhaar & Age Verified (ZK Proof)</h3>
                  <p style={{ margin: '5px 0 0 0' }}>Identity proven and meets the 18+ age requirement.</p>
                </div>
              )}
              
              {/* SIMPLE AGE VERIFICATION DISPLAY */}
              {verifyDID.startsWith("zk-age") && (
                <div style={{ ...styles.certBox, borderLeft: '5px solid #4ade80' }}>
                  <h3 style={{ color: "#4ade80", margin: 0 }}>✔ Age Verified (ZK Proof)</h3>
                  <p style={{ margin: '5px 0 0 0' }}>User meets the 18+ age requirement.</p>
                </div>
              )}


              {/* CERTIFICATE VERIFICATION DISPLAY */}
              {certificates.filter(cert => cert.did === verifyDID).map((cert) => (
                <div key={cert.id} style={{ ...styles.certBox, borderLeft: '5px solid #4ade80' }}>
                  <h3 style={{ color: "#4ade80", margin: 0 }}>✔ Certificate Verified</h3>
                  <p style={{ margin: '5px 0 0 0' }}><b>DID:</b> <span style={styles.keyText}>{cert.did.substring(0, 20)}...</span></p>
                  <p style={{ margin: '5px 0 0 0' }}><b>Type:</b> {cert.certType}</p>
                  <p style={{ margin: '5px 0 0 0' }}><b>File:</b> {cert.file}</p>
                  <p style={{ margin: '5px 0 0 0' }}><b>Issued:</b> {cert.issueDate}</p>
                </div>
              ))}

              {/* FAILED VERIFICATION (General Fallback) */}
              {!verifyDID.startsWith("zk-age") && !verifyDID.startsWith("zk-aadhaar-age-proof") && !certificates.some(cert => cert.did === verifyDID) && verifyDID.length > 5 && (
                  <div style={{ ...styles.certBox, borderLeft: '5px solid #ff6347' }}>
                      <h3 style={{ color: "#ff6347", margin: 0 }}>❌ Verification Failed</h3>
                      <p style={{ margin: '5px 0 0 0' }}>No matching certificate or ZK proof found for this DID.</p>
                  </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Conditionally render login or the main app */}
      {!isLoggedIn ? renderLogin() : renderApp()}
    </div>
  );
}

export default App;
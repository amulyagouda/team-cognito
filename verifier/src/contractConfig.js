export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "did", "type": "string" }
    ],
    "name": "getCertificates",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "cid", "type": "string" },
          { "internalType": "string", "name": "certType", "type": "string" },
          { "internalType": "address", "name": "issuer", "type": "address" },
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }
        ],
        "internalType": "struct DIDCertificate.Certificate[]",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


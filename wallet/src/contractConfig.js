export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "did", "type": "string" },
      { "internalType": "bytes", "name": "publicKey", "type": "bytes" }
    ],
    "name": "registerDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "string", "name": "did", "type": "string" }
    ],
    "name": "freezeDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "string", "name": "did", "type": "string" }
    ],
    "name": "unfreezeDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "string", "name": "did", "type": "string" }
    ],
    "name": "isFrozen",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

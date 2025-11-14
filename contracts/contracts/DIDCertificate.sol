// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DIDCertificate {
    struct Certificate {
        string cid;
        string certType;
        address issuer;
        uint256 issuedAt;
    }

    mapping(string => Certificate[]) private certificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateIssued(
        string indexed did,
        string cid,
        string certType,
        address indexed issuer,
        uint256 issuedAt
    );

    constructor() {
        authorizedIssuers[msg.sender] = true;  // authorize deployer
    }

    function authorizeIssuer(address issuer, bool status) public {
        authorizedIssuers[issuer] = status;
    }

    function issueCertificate(string memory did, string memory cid, string memory certType) public {
        require(authorizedIssuers[msg.sender], "Not authorized issuer");

        certificates[did].push(Certificate(
            cid,
            certType,
            msg.sender,
            block.timestamp
        ));

        emit CertificateIssued(did, cid, certType, msg.sender, block.timestamp);
    }

    function getCertificates(string memory did) public view returns (Certificate[] memory) {
        return certificates[did];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    struct DIDRecord {
        address owner;
        bytes publicKey;
        bool frozen;
        uint256 createdAt;
    }

    mapping(string => DIDRecord) public records;

    event DIDRegistered(string did, address owner);
    event DIDUpdated(string did, bytes newPublicKey);
    event DIDFrozen(string did);
    event DIDUnfrozen(string did);

    function registerDID(string calldata did, bytes calldata publicKey) external {
        require(records[did].owner == address(0), "DID already exists");

        records[did] = DIDRecord({
            owner: msg.sender,
            publicKey: publicKey,
            frozen: false,
            createdAt: block.timestamp
        });

        emit DIDRegistered(did, msg.sender);
    }

    function updatePublicKey(string calldata did, bytes calldata newKey) external {
        require(records[did].owner == msg.sender, "Not owner");
        records[did].publicKey = newKey;

        emit DIDUpdated(did, newKey);
    }

    function freezeDID(string calldata did) external {
        require(records[did].owner == msg.sender, "Not owner");
        records[did].frozen = true;

        emit DIDFrozen(did);
    }

    function unfreezeDID(string calldata did) external {
        require(records[did].owner == msg.sender, "Not owner");
        records[did].frozen = false;

        emit DIDUnfrozen(did);
    }

    function isFrozen(string calldata did) external view returns (bool) {
        return records[did].frozen;
    }
}

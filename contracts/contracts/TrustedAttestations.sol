// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TrustedAttestations
 * @notice Minimal contract to register trusted email sending entities.
 *         This is a simplified version for demo purposes.
 */
contract TrustedAttestations is Ownable {
    struct Attestation {
        string domain;
        string orgName;
        address entity;
        bytes signature;
        uint256 timestamp;
    }

    mapping(bytes32 => Attestation) private attestations;

    event AttestationRegistered(
        bytes32 indexed attestationId,
        string domain,
        string orgName,
        address indexed entity,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function _attestationKey(string memory domain)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(domain));
    }

    function registerTrustedEntity(
        address entity,
        bytes calldata signature,
        string calldata orgName,
        string calldata domain
    ) external onlyOwner {
        bytes32 key = _attestationKey(domain);

        attestations[key] = Attestation({
            domain: domain,
            orgName: orgName,
            entity: entity,
            signature: signature,
            timestamp: block.timestamp
        });

        emit AttestationRegistered(
            key,
            domain,
            orgName,
            entity,
            block.timestamp
        );
    }

    function getAttestation(string calldata domain)
        external
        view
        returns (Attestation memory)
    {
        return attestations[_attestationKey(domain)];
    }

    function hasAttestation(string calldata domain)
        external
        view
        returns (bool)
    {
        bytes32 key = _attestationKey(domain);
        return attestations[key].entity != address(0);
    }
}



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ArticleVerification {
    struct Verification {
        bytes32 contentHash;
        uint256 timestamp;
        address verifier;
    }

    mapping(uint256 => Verification) public verifications;
    
    event ArticleVerified(uint256 indexed articleId, bytes32 contentHash, uint256 timestamp);

    function verifyArticle(uint256 articleId, string memory contentHash) public returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(contentHash));
        verifications[articleId] = Verification({
            contentHash: hash,
            timestamp: block.timestamp,
            verifier: msg.sender
        });
        
        emit ArticleVerified(articleId, hash, block.timestamp);
        return hash;
    }

    function getVerification(uint256 articleId) public view returns (bytes32, uint256, address) {
        Verification memory verification = verifications[articleId];
        return (verification.contentHash, verification.timestamp, verification.verifier);
    }
}

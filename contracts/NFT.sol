// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;
    mapping(address => uint256[]) public tokenId;

    constructor() ERC721("My NFT", "MN") {}

    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        tokenId[msg.sender].push(tokenCount);
        return tokenCount;
    }

    function getTokens() external view returns (uint256[] memory) {
        return tokenId[msg.sender];
    }
}

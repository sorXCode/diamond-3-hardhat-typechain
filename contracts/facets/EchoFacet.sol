// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EchoFacet {

    function echoFacetName() external pure returns(string memory){
        return "JOHN";
    }
}
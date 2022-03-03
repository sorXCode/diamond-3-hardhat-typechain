/* global ethers */
/* eslint prefer-const: "off" */

import { ethers } from "hardhat";
import { EchoFacet } from "../typechain-types";

export let DiamondAddress: string;

export async function check() {
    const diamondAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const echoFacet = (await ethers.getContractAt(
        "EchoFacet",
        diamondAddress,
    ) as EchoFacet);

    let receipt = await echoFacet.echoFacetName();
    console.log(receipt);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
    check()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
  
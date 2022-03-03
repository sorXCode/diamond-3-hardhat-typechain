/* global ethers */
/* eslint prefer-const: "off" */

import { ContractReceipt } from "ethers";
import { ethers } from "hardhat";
import { DiamondCutFacet } from "../typechain-types";
import { getSelectors, FacetCutAction } from "./libraries/diamond";

export let DiamondAddress: string;

export async function upgrade() {
    // deploy new facet
    const FacetName = "EchoFacet";
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${FacetName} deployed: ${facet.address}`);
    
    
    // add deployed facet cut
    let cuts = [];
    cuts.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet),
    });
    console.log("Diamond Cut:", cuts);

    // construct DiamondCut from diamond Address
    const diamondAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const diamondCut = (await ethers.getContractAt(
        "IDiamondCut",
        diamondAddress
    )) as DiamondCutFacet;


    let tx;
    let receipt: ContractReceipt;
    // send diamondCut transaction
    tx = await diamondCut.diamondCut(cuts, ethers.constants.AddressZero, "0x");
    console.log("Diamond cut tx: ", tx.hash);
    receipt = await tx.wait();
    
    if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    console.log("Completed diamond cut");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  upgrade()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

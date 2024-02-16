import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySaveERC20() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const tokenName = "MarkToken";
    const tokenSymbol = "MTK";
    const initialSupply = 100;

    const ERC20 = await ethers.getContractFactory("ERC20");
    const erc20 = await ERC20.deploy(
      owner.address,
      tokenName,
      tokenSymbol,
      initialSupply
    );

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(erc20.getAddress());

    return { erc20, saveERC20, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("should not deploy ERC20 contract with zero address", async function () {
      const { erc20 } = await loadFixture(deploySaveERC20);

      expect(erc20.target).to.not.equal(0);
    });

    it("should not deploy SaveERC20 contract with zero address", async function () {
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      expect(saveERC20.target).to.not.equal(0);
    });
  });

  describe("Deposit", () => {
    
  })
});

import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import exp from "constants";

describe("SaveERC20", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const deploySaveERC20 = async () => {
    // Contracts are deployed using the first signer/account by default
    const [owner, spender] = await ethers.getSigners();

    const tokenName = "MarkToken";
    const tokenSymbol = "MTK";

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const erc20 = await ERC20.deploy(owner.address, tokenName, tokenSymbol);

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(erc20.getAddress());

    return { erc20, saveERC20, owner, spender };
  };

  describe("Deployment", () => {
    it("should not deploy ERC20 contract with zero address", async () => {
      const { erc20 } = await loadFixture(deploySaveERC20);

      expect(erc20.target).to.not.equal(0);
    });

    it("should not deploy SaveERC20 contract with zero address", async () => {
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      expect(saveERC20.target).to.not.equal(0);
    });
  });

  describe("Deposit", () => {
    it("Should check if ERC20 token has been deposited", async () => {
      const { erc20, saveERC20, spender } = await loadFixture(deploySaveERC20);

      const amountToDeposit = ethers.parseUnits("1", 18);

      await erc20.transfer(spender.address, amountToDeposit);

      await erc20.connect(spender).approve(saveERC20.target, amountToDeposit);
      await saveERC20.connect(spender).deposit(amountToDeposit);

      const checkBalance = await saveERC20.checkUserBalance(spender.address);

      expect(checkBalance).to.equal(amountToDeposit);
    });

    it("Should check if ERC20 token has been deposited by Owner", async () => {
      const { erc20, saveERC20, owner } = await loadFixture(deploySaveERC20);

      const amountToDeposit = ethers.parseUnits("1", 18);

      await erc20.approve(saveERC20.target, amountToDeposit);
      await saveERC20.deposit(amountToDeposit);

      const checkBalance = await saveERC20.checkUserBalance(owner.address);

      expect(checkBalance).to.equal(amountToDeposit);
    });

    it("Should throw an error if value is zero", async () => {
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      expect(saveERC20.deposit(0)).to.be.revertedWith(
        "Why do you want to save 0 value"
      );
    });
  });
});

describe("Withdraw", () => {
  it("Sho")
});

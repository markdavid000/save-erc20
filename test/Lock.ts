import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import exp from "constants";
import { deployContract } from "@nomicfoundation/hardhat-ethers/types";

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
      // Load fixture to get an instance of the ERC20 contract
      const { erc20 } = await loadFixture(deploySaveERC20);

      // Check if the target address of the ERC20 contract is not equal to 0 address
      expect(erc20.target).to.not.equal(0);
    });

    it("should not deploy SaveERC20 contract with zero address", async () => {
      // Load the fixture to get an instance of the SaveERC20 contract
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      // Expect that the target address of the SaveERC20 contract is not equal to zero address
      expect(saveERC20.target).to.not.equal(0);
    });
  });

  describe("Deposit", () => {
    it("Should check if ERC20 token has been deposited", async () => {
      // Load fixtures to get instances of ERC20 token contract, SaveERC20 contract, and spender
      const { erc20, saveERC20, spender } = await loadFixture(deploySaveERC20);

      // Define the amount to deposit, converting 1 token to its base unit (Wei)
      const amountToDeposit = ethers.parseUnits("1", 18);

      // Transfer tokens from the ERC20 token contract to the spender
      await erc20.transfer(spender.address, amountToDeposit);

      // Approve the SaveERC20 contract to spend tokens on behalf of the spender
      await erc20.connect(spender).approve(saveERC20.target, amountToDeposit);

      // Deposit tokens from the spender to the SaveERC20 contract
      await saveERC20.connect(spender).deposit(amountToDeposit);

      // Check the balance of the spender in the SaveERC20 contract after deposit
      const checkBalance = await saveERC20.checkUserBalance(spender.address);

      // Ensure that the balance of the spender in the SaveERC20 contract matches the deposited amount
      expect(checkBalance).to.equal(amountToDeposit);
    });

    it("Should check if ERC20 token has been deposited by Owner", async () => {
      // Load fixtures to get instances of ERC20 token contract, SaveERC20 contract, and owner
      const { erc20, saveERC20, owner } = await loadFixture(deploySaveERC20);

      // Define the amount to deposit, converting 1 token to its base unit (Wei)
      const amountToDeposit = ethers.parseUnits("1", 18);

      // Approve SaveERC20 contract to spend tokens on behalf of the owner
      await erc20.approve(saveERC20.target, amountToDeposit);

      // Deposit tokens from the owner to the SaveERC20 contract
      await saveERC20.deposit(amountToDeposit);

      // Get the balance of the owner after deposit
      const checkBalance = await saveERC20.checkUserBalance(owner.address);

      // Ensure the balance of the owner matches the deposited amount
      expect(checkBalance).to.equal(amountToDeposit);
    });

    it("Should throw an error if value is zero", async () => {
      // Load the fixture to get an instance of the SaveERC20 contract
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      // Expect that calling the deposit function with 0 value will revert
      expect(saveERC20.deposit(0)).to.be.revertedWith(
        "Why do you want to save 0 value"
      );
    });
  });

  describe("Withdraw", () => {
    it("Should be able to withdraw ERC20 tokens", async () => {
      // Load the necessary accounts and contracts from the fixture
      const { erc20, saveERC20, spender } = await loadFixture(deploySaveERC20);

      // Define the amount of tokens to deposit
      const depositAmount = ethers.parseUnits("1", 18);

      // Transfer tokens from owner to otherAccount
      await erc20.transfer(spender.address, depositAmount);

      // Approve SaveERC20 contract to spend tokens on behalf of otherAccount
      await erc20.connect(spender).approve(saveERC20.target, depositAmount);

      // Deposit tokens into SaveERC20 contract
      await saveERC20.connect(spender).deposit(depositAmount);

      // Withdraw tokens from SaveERC20 contract
      await saveERC20.connect(spender).withdraw(depositAmount);

      // Check the balance of otherAccount after withdrawal
      const balanceAfter = await saveERC20.checkUserBalance(spender.address);

      // Ensure the balance of otherAccount is now 0 after withdrawal
      expect(balanceAfter).to.equal(0);
    });

    it("Should throw an error if the balance is 0", async () => {
      // Loads fixtures to get an instance of the SaveERC20 contract
      const { saveERC20 } = await loadFixture(deploySaveERC20);

      await expect(saveERC20.withdraw(0)).to.be.revertedWith(
        "can't withdraw zero value"
      );
    });

    it("Should an error if insufficient funds", async () => {
      // Load fixtures to get instances of spender and saveERC20 contracts
      const { spender, saveERC20 } = await loadFixture(deploySaveERC20);

      // Define the amount to withdraw
      const amountToWithdraw = ethers.parseUnits("1", 18);

      // Expect an error when trying to withdraw tokens from the SaveERC20 contract with insufficient funds
      await expect(
        saveERC20.connect(spender).withdraw(amountToWithdraw)
      ).to.be.revertedWith("insufficient funds");
    });
  });
});

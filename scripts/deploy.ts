import { ethers } from "hardhat";

async function main() {
  const InitialAddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";

  const ERC20Token = await ethers.deployContract("ERC20Token", [
    InitialAddress,
    "MarkToken",
    "MTK",
  ]);

  await ERC20Token.waitForDeployment();

  console.log(`Contract has been deployed to ${ERC20Token.target}`);

  const SaveERC20 = await ethers.deployContract("SaveERC20", [ERC20Token.target]);

  console.log(`Contract has been deployed to ${SaveERC20.target}`);

  await SaveERC20.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

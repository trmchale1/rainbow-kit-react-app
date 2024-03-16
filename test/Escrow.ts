import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TimsEscrow", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function testingFixture() {
    const ONE_GWEI = 1_000_000_000;
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();

    return { escrow, ONE_GWEI, owner, otherAccount };
  }

  // Wat this: const [owner, otherAccount] = await ethers.getSigners();
  // const Lock = await ethers.getContractFactory("TimsEscrow");
  // hardhat fixtures, just an async function
  // also we have describe ... it .. expect syntax

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { escrow, owner } = await loadFixture(testingFixture);

      expect(await escrow.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { escrow, ONE_GWEI } = await loadFixture(
        testingFixture
      );
        // This might not work, we might need to call deposit function, then test
      escrow.deposit(ONE_GWEI);
      expect(await ethers.provider.getBalance(escrow.target)).to.equal(
        ONE_GWEI
      );
    });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { escrow, otherAccount } = await loadFixture(
          testingFixture
        );

        await expect(escrow.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { escrow, owner } = await loadFixture(
          testingFixture
        );

        // Transactions are sent using the first signer by default
        await expect(escrow.connect(owner).withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { escrow, ONE_GWEI, owner } = await loadFixture(
          testingFixture
        );

      await expect(escrow.connect(owner).withdraw())
          .to.emit(escrow, "Withdrawn")
          .withArgs(owner, ONE_GWEI); // We accept any value as `when` arg
      });
      it("Should emit an event on deposits", async function() {
        const { escrow, ONE_GWEI, owner } = await loadFixture(
          testingFixture
        );

        await expect(escrow.connect(owner).deposit())
          .to.emit(escrow, "Deposited")
          .withArgs(owner, ONE_GWEI); // We accept any value as `when` arg
      });
      })
    });
  });
});

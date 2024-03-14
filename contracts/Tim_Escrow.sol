pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/payment/escrow/Escrow.sol';
/**
 * @title Tim's Escrow, using OpenZepplin
 * @author Tim McHale
 */

contract TimsEscrow is Ownable {
    Escrow escrow;
    address payable wallet;

    constructor() public {
        escrow = new Escrow();
        wallet = _wallet;
    }

    /**
     * Deposit payments
     */
    function escrowDeposit() external payable {
        // implement require statments for deposit
        
        escrow.deposit.value(msg.value)(wallet);
    }

    /**
     * Withdraw funds from wallet, owner only
     */

    function withdraw() external onlyOwner {
        // implement require statments for withdrawal
        escrow.withdraw(wallet);
    }

    /** 
     * Checks balance available to withdraw
     */

    function balance() external view onlyOwner returns (uint256) {
        return escrow.depositsOf(wallet);
    }

}


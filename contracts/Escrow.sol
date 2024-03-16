pragma solidity ^0.8.0;

/**
 * @title Tim's Escrow, using OpenZepplin
 * @author Tim McHale
 */

// This file needs require statements for deposit/withdraw, and needs unit tests

contract Escrow {
    address public owner;
    mapping(address => uint256) public deposits;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdraw(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    /**
     * Deposit payments
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than zero.");
        deposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * Withdraw funds from wallet, owner only
     */

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Contract balance is zero");
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    /** 
     * Checks balance available to withdraw
     */
    function balance() public view returns (uint256) {
        return address(this).balance;
    }

}


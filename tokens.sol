pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TokenSender {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only contract owner can call this function");
        _;
    }

    function sendTokens(address tokenAddress, address recipient, uint256 tokenAmount, uint256 ethAmount) external payable onlyOwner {
        // Transfer ERC20 tokens
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= tokenAmount, "Insufficient token balance");
        require(token.transfer(recipient, tokenAmount), "Token transfer failed");

        // Transfer ETH
        require(address(this).balance >= ethAmount, "Insufficient ETH balance");
        payable(recipient).transfer(ethAmount);
    }

    function withdrawTokens(address tokenAddress, address recipient, uint256 amount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
        require(token.transfer(recipient, amount), "Token transfer failed");
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        recipient.transfer(amount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContractTokenBalance(address tokenAddress) external view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
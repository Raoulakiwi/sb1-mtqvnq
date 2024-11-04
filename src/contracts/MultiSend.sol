// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiSend is ReentrancyGuard {
    error InvalidArrayLengths();
    error TransferFailed();
    error InsufficientBalance();
    error InvalidAmount();

    event TokensDistributed(address indexed token, address[] recipients, uint256[] amounts);
    event NativeDistributed(address[] recipients, uint256[] amounts);

    function multiSendToken(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        if (recipients.length != amounts.length) revert InvalidArrayLengths();
        if (recipients.length == 0) revert InvalidArrayLengths();

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        IERC20 tokenContract = IERC20(token);
        if (tokenContract.balanceOf(msg.sender) < total) revert InsufficientBalance();

        bool success = tokenContract.transferFrom(msg.sender, address(this), total);
        if (!success) revert TransferFailed();

        for (uint256 i = 0; i < recipients.length; i++) {
            if (amounts[i] == 0) continue;
            success = tokenContract.transfer(recipients[i], amounts[i]);
            if (!success) revert TransferFailed();
        }

        emit TokensDistributed(token, recipients, amounts);
    }

    function multiSendNative(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        if (recipients.length != amounts.length) revert InvalidArrayLengths();
        if (recipients.length == 0) revert InvalidArrayLengths();

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        if (msg.value != total) revert InvalidAmount();

        for (uint256 i = 0; i < recipients.length; i++) {
            if (amounts[i] == 0) continue;
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            if (!success) revert TransferFailed();
        }

        emit NativeDistributed(recipients, amounts);
    }
}
# Avoiding common attacks

## SWC-103 Floating pragma
Contracts are using pragma version 0.8.3

## SWC-107 Re-entrancy
NFTSplitter contract implements ReentrancyGuard in all functions that interact with external contracts.

## SWC-104 Unchecked Call Return Value
The return value of `call` function is checked with a `require` in NFTSplitter contract.

## SWC-112  Delegatecall to Untrusted Callee
A NFTSplitterProxy instance will only use the  address of the NFTSplitter deployed contract that was passed as parameter during the proxy creation.

## SWC-115 Authorization through tx.origin
msg.sender is used to identify the address of the account that sent the transaction.

## Checks-Effects-Interactions
The state of the contracts is not modified after the call of an external contract function.

## Use Modifiers Only for Validation
Modifiers are used to validate the execution of functions.

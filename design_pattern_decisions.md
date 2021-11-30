# Design Pattern decisions
## Inheritance and Interfaces

NFTSplitter and NFTSplitterProxy contracts that inherits or implement interfaces:

| Contract Name | Inheritance and Interfaces |
| -------- | -------- | 
| NFTSplitter     | NFTSplitterStorage,     ERC165,    ERC1155,     IERC1155Receiver,     ReentrancyGuard   | 
| NFTSplitterProxy | NFTSplitterStorage, Proxy | 

### Contract Descriptions
* **NFTSplitter**: it contains the logic of the application, this contract can be upgradable later.
* **NFTSplitterStorage**: this contract contains the variables used in the logic. This contract helps to avoid variable collision when `delegateCall`  function is executed.
* **NFTSplitterProxy**: this contract delegates all the logic execution to NFTSplitter contract.
* **ERC1155**: custom implementation of ERC115 contract, this contract is based on the Openzeppeling's ERC1155 contract.
* **NFTSplitterAdmin**: this contracts manages the settings of the application, it stores the factory contract address and registers the address of the proxy contracts created by the factory. Also, this contract can pause and unpause the creation of new proxies in the factory and can be use to upgrade the address of a new implementation of NFTSplitter.
*  **NFTSplitterFactory**: this contract creates new instances of NFTSplitterProxy contract and then stores the address in NFTSplitterAdmin contract.

#### Third party contracts

* @openzeppelin/contracts/utils/introspection/ERC165.sol
* @openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol
* @openzeppelin/contracts/security/ReentrancyGuard.sol
* @openzeppelin/contracts/proxy/Proxy.sol

## Access Control Design Patterns
###  Ownership
* **NFTSplitter**: Implements functions that can only be executed by the NFT Owner that created the proxy contract.
* **NFTSplitterAdmin**: implements functions that can be executed by contract owner.

###  Role based
* **NFTSplitter**: Implements functions that can only be executed by the contract that was registered as Proxy contract.
* **NFTSplitterAdmin**: implements functions that can be executed by contract that was registered as the Factory contract.


## Inter-Contract Execution

| Contract Name | Interacts with |
| -------- | -------- | 
| NFTSplitter     |  Any ERC1155 deployed contract,  NFTSplitterAdmin,  | 
| NFTSplitterProxy | NFTSplitter | 
| NFTSplitterFactory | NFTSplitterAdmin |


## Factory Design Pattern
NFTSplitterFactory creates new instances of NFTSplitterProxy.


## Upgradable Contract
The base application logic can be upgraded . A new the NFTSplitterAdmin contract implementation can be deployed to the network and the deployed address can be updated in the NFTSplitterAdmin using the `upgrade()` function.

## Pausable
The creation of new proxy contracts in the Factory can be paused and unpaused, this can be controlled in the NFTSplitterAdmin contract with the `pause()` and `unpause()` functions The creation of new proxy contracts in the Factory can be paused and unpaused, this can be controlled in the NFTSplitterAdmin contract with the `pause()` and `unpause()` functions. The state can be obtained with the function `isPaused()`.  
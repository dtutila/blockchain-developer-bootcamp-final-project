# Blockchain Developer Bootcamp Final Project

## Deployed UI
[https://nft-splitter.netlify.app/](https://nft-splitter.netlify.app/)
## Screencast

[https://youtu.be/Q1NX3jX49A0](https://youtu.be/Q1NX3jX49A0)

## Deployed Addresses
* Network name:    'rinkeby'
* NFTSplitterAdmin: [0x23e056A93548D2e798b86e31f26945105dF626C6](https://rinkeby.etherscan.io/address/0x23e056A93548D2e798b86e31f26945105dF626C6)
* NFTSplitterFactory: [0xd952634001501f45c84bFCC6f5CAFDC198d11BFb](https://rinkeby.etherscan.io/address/0xd952634001501f45c84bFCC6f5CAFDC198d11BFb)
* NFTSplitterAdmin: [0x3de8DB013BCb7Fb891cDfe7bD52E43FC6DcD2a2B](https://rinkeby.etherscan.io/address/0x3de8db013bcb7fb891cdfe7bd52e43fc6dcd2a2b)

## Run project
### Prerequisites

* Node.js >= v14.18
* npm >= 6.14
* Truffle >= v5.4.15
* Ganache CLI >= v6.12.2
* Git

### Directory Structure

- client: React project directory for the frontend
- contracts: smart contract files
      - mocks: smart contract mock files using for testing
 - migrations: Migration scripts to deploy contracts
 - test: Javascript unit tests

### Installing project

1. Clone repository:

```
git clone https://github.com/dtutila/blockchain-developer-bootcamp-final-project.git
```

2. Move to root directory

```
cd blockchain-developer-bootcamp-final-project/
```
3. Run `npm install` command

```
npm install
```
4. Move to client directory
```
 cd client/
 ```
5. Run `npm install`  
```
npm install
```


#### Run contract tests local network

1. Start ganache-cli (in another terminal)

```
ganache-cli
```
2. Inside  project's root directory run truffle test command
```
truffle test --network development
```


#### Contract deployment
##### Test Network
1. Start ganache-cli (if not running)
```
ganache-cli
```
2. Run migrate command
```
truffle migrate --network development
```

##### Rinkeby
1. Configure .env file using the [.env.example](https://github.com/dtutila/blockchain-developer-bootcamp-final-project/blob/main/env.example) file.
2. Run migrate command
```
truffle migrate --network rinkeby
```


#### Run frontend
1. From root  directory move to client directory

```
cd client/
```
2. Deploy contracts to desired network
3. Get NFTSplitterFactory deployed address from deployment log

```
admin->    0xee870e305b14865ba7881F95fC459Eb55Ad8b49F
factory->  0x26dD43A43071D70245312e2491311E11B2676F0e
base->     0x2E2412D256a85f081E85c19858bc5D65765d85bD
```
4. Update [client/src/abi/factory.js](https://github.com/dtutila/blockchain-developer-bootcamp-final-project/blob/main/client/src/abi/factory.js) with factory address
```
const address = '0x26dD43A43071D70245312e2491311E11B2676F0e';

```
5. Run npm start
```
npm start
```
6. Open [http://localhost:3000/](http://localhost:3000/)


## Ethereum account for NFT certification
* 0x760bAADC22c731957b34b2eb901dE9676Ccb256F


## Project Description
### NFT Splitter 

A contract that allows the user to divide a NFT into multiple pieces and trace the pieces with another user.

### Use case scenario
Alice wants to sell a part of his favorite NFT to get some liquidity but she also wants to have the possibility of bought back the NFT any piece that she sold.
In the other hand, Bob wants to buy Alice's NFT but as she is not selling it in full Bob is going to buy a small part of Alice's NFT (with the possibility of buy all the remaining pieces in a near future).

### Problems
* Alice does not want to contact Bob when she is ready to buy back Bob's NFT part.
* Bob wants to receive a little more in return of selling back his NFT part to Alice.
* Bob also wants the possibility of buy Alice's NFT


## Example 

Alice will split her NFT in 4 pieces and Bob can buy one piece. Alice sets the NFT price to 1 ETH, every NFT piece will cost 0.25 ETH.
Alice also sets an extra percentage that she will pay to buy any NFT piece that Bob bought, in this example the percentage will be 10%. ~~Alice also sets a Lock time of 15 days in which Bob will not be allowed to buy more pieces from her.~~

Alice will be able to buy any NFT piece that Bob bought ~~without any time restriction~~, but she will have to pay 0.275 ETH for every piece that Bob owns.

Bob will be able to buy more pieces or all the pieces after the lock time is over, 15 days in this case.

Anyone who owns all the pieces will be able to assemble the original NFT.

## Proposed solution
To build a decentralized app to allow users to split a NFT and trade the pieces inside the app.
## Workflow example

**Scenario 1**

1- Alice splits a NFT in 4 pieces.

2- Alice assigns an initial  price for one piece and the extra percentage she will pay to buy any sold piece. 

4- Bob is interested to buy Alice's NFT, so he buys one piece.

6- Later Bob buys all the other NFT pieces and he will be able to withdraw the original NFT to his account.


## Roadmap
* Add support to allow  multiple user to buy pieces 
* Improve UX/UI
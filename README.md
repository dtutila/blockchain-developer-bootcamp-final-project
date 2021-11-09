# NFT Shatter (~~or how to sell my NFT slowly~~)

An contract that allows the user to divide a NFT into multiple pieces.

## Use case scenario
Alice wants to sell a part of his favorite NFT to get some liquidity but she also wants to have the possibility of bought back the NFT any piece that she sold.
In the other hand, Bob wants to buy Alice's NFT but as she is not selling it in full Bob is going to buy a small part of Alice's NFT (with the possibility of buy all the remaining pieces in a near future).

## Problems
* Alice does not want to contact Bob when she is ready to buy back Bob's NFT part.
* Bob wans to receive a little more in return of selling back his NFT part to Alice.
* Bob also wants the possibility of buy 100%  of Alice's NFT


## Example 

Alice will shatter/split her NFT in 4 small pieces and sell one to Bob. Alice sets the NFT price to 1 ETH, every NFT pice will cost 0.25 ETH.
Alice also sets a percentage above the list price to buy any NFT pice that Bob bought, in this example the percentage will be 10%. Alice also sets a Lock time of 15 days in which Bob will not be allowed to buy more pieces from her.

Alice will be able to buy any NFT piece without any time restriction but she will have to pay 0.275 ETH for every piece that Bob owns.

Bob will be able to buy more pieces or all the pieces after the lock time is over, 15 days in this case.

Any one who owns all the pieces will be able to assemble the original NFT.

## Propossed solution
To build a decentralized app to allow users to shatter/split a NFT and trade the pieces inside the app the pieces. 

## Workflow example

**Scenario 1**

1- Alice splits a NFT in 4 parts.

2- Alice assings an initial list price for her NFT (each part will cost: number of parts / list price )

3- Alice stablishs an extra percentage she will be willing to pay to buy any part of the original NFT back

4- Alice will set up a lock time of 15 days in wich a buyer will not be able to buy any other part after the initial purchase.

5- Bob is interested to buy Alice's NFT so he buys one part.

6- Bob waits untill the  lock time is over to buy more parts.

7- Once Bob owns all the NFT parts, he will be able to transfer the ownership to his account.
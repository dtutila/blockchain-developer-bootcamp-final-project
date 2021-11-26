const base = artifacts.require('NFTSplitter')
const admin = artifacts.require('NFTSplitterAdmin')
const factory = artifacts.require('NFTSplitterFactory')

const proxy = artifacts.require('NFTSplitterProxy')
const ERC1155 = artifacts.require('NFTMock2')
const nft = artifacts.require('NFTMock')

const BN = require('bignumber.js');
const tokenId = 100;
const tokensToCreate = 200;


async function initTextContext(factoryContract, alice, aliceNFT, approveForAll) {
    const splitterProxy = await factoryContract.createNFTSplitter(aliceNFT.address, tokenId , {
        from: alice,
    });
    const proxyAddress = splitterProxy.logs[0].args.proxyAddress;
    const splitter = await base.at(proxyAddress, {from: alice});

    //approve proxy?
    let approvedForProxy;
    if (approveForAll === true) {
        //approving proxy address
        await aliceNFT.setApprovalForAll(proxyAddress, true, {from: alice});
        approvedForProxy = await aliceNFT.isApprovedForAll.call(
            alice,
            proxyAddress,
        );

        assert.equal(
            approvedForProxy,
            true,
            'NFT Splitter proxy should be approved',
        );
    }
    return {proxyAddress, splitter};
}

contract('NFTSplitter (Base contract)', function (accounts) {
    const [owner, alice, bob] = accounts
    let factoryContract, adminContract, baseContract, aliceNFT, ERC1155Contract;

    beforeEach(async () => {
        baseContract = await base.deployed();
        adminContract = await admin.deployed();
        factoryContract = await factory.deployed();
        aliceNFT = await nft.new("Alice's NFT", 'ANFT', {from: alice});
        await aliceNFT.mint(alice, tokenId, tokensToCreate, '0x0000', {from: alice});
        await aliceNFT.setURI('URI:id', {from: alice});

    })

    it('00- NFT Splitter Base contract should be set up in factory contract', async function () {
        const baseAddress = await factoryContract.getNFTSplitterBase.call()

        assert.equal(
            baseContract.address,
            baseAddress,
            'Base contract address must be configured',
        );
    })


    it('01- NFT Owner should be able to create a new nft splitter proxy ', async function () {
        const splitterProxy = await factoryContract.createNFTSplitter(aliceNFT.address, tokenId , {

            from: alice,
        });

        const proxyAddress = splitterProxy.logs[0].args.proxyAddress;
        const splitter = await base.at(proxyAddress, {from: alice});
        const proxyContract = await proxy.at(proxyAddress, {from: alice});

        const proxyName = await proxyContract.name.call();
        const name = await baseContract.name.call();
        const settings = await splitter.settings.call();
        const originalOwner = await splitter.originalOwner.call();
        const initialAliceBalance = await splitter.balanceOf.call(alice, 1);
        const initialBobBalance = await splitter.balanceOf.call(bob, 1);
        assert.equal(initialAliceBalance, 0, 'Alice should own 0 tokens');
        assert.equal(initialBobBalance, 0, 'Bob should own 0 token');

        assert.equal(alice, originalOwner, 'Alice should be the proxy owner');

        assert.equal(name, 'NFT Splitter', 'Initial proxy nft name should be proxy');
        assert.equal(proxyName, 'proxy', 'Initial proxy nft name should be proxy');
        assert.equal(
            settings,
            adminContract.address,
            'Settings value should be sale as admin contract',
        );
    });
    it('02- NFT Splitter creation is not available while dapp is paused ', async function () {

        await adminContract.pause( {from: owner});

        try{
            const splitterProxy = await factoryContract.createNFTSplitter(aliceNFT.address, tokenId , {

                from: alice,
            });
        }catch (error) {
            assert(error);
            assert.equal(error.reason, "NFTSplitterFactory: Factory is paused");
        }
        //unpausing dapp
        await adminContract.unpause( {from: owner});

    });

    it('03- NFT Owner should be able to split NFT ', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether');
        await splitter.splitMyNFT( tokenId, price, 10, 8,  {
            from: alice,
        });

        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, tokenId);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, tokenId);

        const name = await splitter.name.call();
        const symbol = await splitter.symbol.call();
        const baseName = await baseContract.name.call();

        assert.equal(baseName, "NFT Splitter", "Base Contract NFT name should be 'NFT Splitter'");
        assert.equal(name, "NFT Splitter - Alice's NFT", "Name should start with 'NFT Splitter -'");
        assert.equal(symbol, "NSANFT", "Symbol should start with 'NS'");
        assert.equal(finalAliceBalance, 0, 'Alice should not have any token');
        assert.equal(finalProxyBalance, tokensToCreate, 'Proxy should own all tokens');
    });

    it('04- NFT Owner should be able to split NFT (ERC1155 does not have name and symbol variables) ', async function () {
        ERC1155Contract = await ERC1155.new({from: alice});
        await ERC1155Contract.mint(alice, tokenId, tokensToCreate, '0x0000', {from: alice});
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, ERC1155Contract, true);

        const price = web3.utils.toWei('0.5', 'ether');
        await splitter.splitMyNFT( tokenId, price, 10, 8,  {
            from: alice,
        });

        const finalAliceBalance = await ERC1155Contract.balanceOf.call(alice, tokenId);
        const finalProxyBalance = await ERC1155Contract.balanceOf.call(proxyAddress, tokenId);

        const symbol = await splitter.symbol.call();
        const name = await splitter.name.call();

        assert.equal(name, "proxy", "Name should be 'proxy'");
        assert.equal(symbol, "PRX", "Symbol should be 'PRX'");
        assert.equal(finalAliceBalance, 0, 'Alice should not have any token');
        assert.equal(finalProxyBalance, tokensToCreate, 'Proxy should own all tokens');
    });

    it('05- Revert transaction if split creation is not executed by NFT owner', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether');
        try {
            await splitter.splitMyNFT( tokenId, price, 10, 8,  {
                from: bob,
            });
        } catch (error) {
            assert(error);
            assert.equal(error.reason, "NFTSplitter: Only original NFT owner can execute this function");
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, tokenId);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, tokenId);
        const finalBobBalance = await aliceNFT.balanceOf.call(bob, tokenId); // :)


        assert.equal(finalAliceBalance, tokensToCreate, 'Alice should not have any token');
        assert.equal(finalProxyBalance, 0, 'Proxy should own all tokens');
        assert.equal(finalBobBalance, 0, 'should be 0');
    });

    it('06- NFT Owner should not be able to split same NFT twice', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether')
        await splitter.splitMyNFT( tokenId, price, 10, 8,  {
            from: alice,
        });
        //splitting the same NFT instance
        try {
            await splitter.splitMyNFT( tokenId, price, 4, 2,  {
                from: alice,
            })
        } catch (error) {
            assert(error);
            assert.equal(error.reason, 'NFTSplitter: splitter already created');
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, tokenId)
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, tokenId)

        assert.equal(finalAliceBalance, 0, 'Alice should not have any token')
        assert.equal(finalProxyBalance, tokensToCreate, 'Proxy contract should own all tokens')
    });

    it('07- NFT Owner should not be able to split unapproved NFT', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, false);

        const price = web3.utils.toWei('0.5', 'ether');

        try {
            await splitter.splitMyNFT( tokenId, price, 10, 8,  {
                from: alice,
            });
        } catch (error) {
            assert(error);
            assert.equal(error.reason, "ERC1155: caller is not owner nor approved");
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, tokenId);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, tokenId);

        assert.equal(finalAliceBalance, tokensToCreate, 'Alice should have all tokens');
        assert.equal(finalProxyBalance, 0, 'Proxy should not have any tokens');
    });


    it('08- Buyer can buy one piece (token)', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.1', 'ether'));
        const tokensToBuy = 1;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, 8,  {
            from: alice,
        });
        const initialAliceBalanceETH = new BN(await web3.eth.getBalance(alice));

        //buying a piece
        const value =  unitPrice * tokensToBuy;
        await splitter.buyPiecesFromOwner(1, {from: bob, value: value});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)
        const finalAliceBalanceETH = new BN(await web3.eth.getBalance(alice));
        assert.equal(finalAliceBalance, 7, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');
        assert.equal(initialAliceBalanceETH.toNumber(), finalAliceBalanceETH.minus(value).toNumber() , 'Alice should have more eth');
    });

    it('09- Buyer can buy all pieces (tokens)', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.2', 'ether'))
        const pieces = 8;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, pieces, {
            from: alice,
        });
        const initialAliceBalanceETH = new BN(await web3.eth.getBalance(alice));

        //buying a piece
        const price =  unitPrice.multipliedBy(pieces);
        await splitter.buyPiecesFromOwner(8, {from: bob, value: price});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)
        const finalAliceBalanceETH = new BN(await web3.eth.getBalance(alice));
        assert.equal(finalAliceBalance, 0, 'Alice should have 0 tokens');
        assert.equal(finalBobBalance, 8, 'Bob should own 8 token');
        assert.equal(initialAliceBalanceETH.toNumber(), finalAliceBalanceETH.minus(price).toNumber() , 'Alice should have more eth');
    });

    it('10- Owner should not use buyPiecesFromOwner function', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.1', 'ether'));
        await splitter.splitMyNFT( tokenId, unitPrice, 10, 8,  {
            from: alice,
        });

        //buyer buys  a piece
        await splitter.buyPiecesFromOwner(1, {from: bob, value: unitPrice});
        try{
            //nft owner try to buy using buyPiecesFromOwner function
           await splitter.buyPiecesFromOwner(1, {from: alice, value: unitPrice});
        }catch (error){
            assert(error);
            assert.equal(error.reason, "NFTSplitter: Original NFT owner is not allowed to execute this function");
        }


        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)

        assert.equal(finalAliceBalance, 7, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');

    });

    it('11- Buyer cannot buy more pieces than initial created amount', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.05', 'ether'));
        const tokenAmount = 9;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, tokenAmount - 1 ,  {
            from: alice,
        });

        //buying a piece
        const value =  unitPrice.multipliedBy(tokenAmount);
        try{
            await splitter.buyPiecesFromOwner(tokenAmount, {from: bob, value: value});
        }catch (error){
            assert(error);
            assert.equal(error.reason, "NFTSplitter: not enough pieces to buy");
        }

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)

        assert.equal(finalAliceBalance, tokenAmount - 1 , `Alice should have ${tokenAmount - 1} tokens`);
        assert.equal(finalBobBalance, 0, 'Bob should own 0 token');

    });

    it('12- Buyer cannot buy from owner more pieces than current available supply', async function () {
        const { splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.05', 'ether'));
        const pieces = 8;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, pieces, {
            from: alice,
        });
        //buying one piece
        await splitter.buyPiecesFromOwner(1, {from: bob, value: unitPrice});


        try{
            //buying 8 pieces, current supply = tokenamount - 1
            const price = unitPrice.multipliedBy(pieces) ;
            await splitter.buyPiecesFromOwner(pieces, {from: bob, value: price});
        }catch (error){
            assert(error);
            assert.equal(error.reason, "NFTSplitter: not enough pieces to buy");
        }

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)

        assert.equal(finalAliceBalance, pieces - 1 , `Alice should have ${pieces - 1} tokens`);
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');

    });

    it('13- NFT Owner can buy back pieces', async function () {
        const { splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.05', 'ether'));
        const tokenAmount = 8;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, tokenAmount, {
            from: alice,
        });


        //Buyer buys 2 pieces
        const twoPiecesPrice = unitPrice.multipliedBy(2) ;
        await splitter.buyPiecesFromOwner(2, {from: bob, value: twoPiecesPrice});
        const initialBobBalanceETH = new BN(await web3.eth.getBalance(bob));

        //owner buys back 1 piece
        const buyBackPrice = (unitPrice.multipliedBy(1.1));
        await splitter.buyBackPieces(bob, 1, {from: alice, value: buyBackPrice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId);
        const finalBobBalanceETH = new BN(await web3.eth.getBalance(bob));
        assert.equal(finalAliceBalance, tokenAmount -1 , `Alice should have ${tokenAmount-1} tokens`);
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');
        assert(finalBobBalanceETH.minus(initialBobBalanceETH).isEqualTo(buyBackPrice) , 'Bob should have the eth from the trx');
    });

    it('14- NFT Owner can withdraw NFT after buying back all pieces', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.07', 'ether'));
        const tokenAmount = 8;
        await splitter.splitMyNFT( tokenId, unitPrice, 10, tokenAmount,  {
            from: alice,
        });
        const twoPieceValue = unitPrice.multipliedBy(2) ;
        await splitter.buyPiecesFromOwner(2, {from: bob, value: twoPieceValue});


        const buyBackPrice = (unitPrice.multipliedBy(1.1)).multipliedBy(2);
        await splitter.buyBackPieces(bob, 2, {from: alice, value: buyBackPrice});
        await splitter.withdrawOriginalNFT({from: alice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)
        const nftBalance = await aliceNFT.balanceOf.call(alice, tokenId)

        assert.equal(finalAliceBalance, 0, 'Alice should have 0 tokens');
        assert.equal(finalBobBalance, 0, 'Bob should own 0 token');
        assert.equal(nftBalance, tokensToCreate, `Alice should own ${tokensToCreate} tokens from her original NFT`);


    });

    it('15- NFT Owner can withdraw NFT right after splitter creation', async function () {
        const { splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.5', 'ether'));
        await splitter.splitMyNFT( tokenId, unitPrice, 10, 8,  {
            from: alice,
        });

        await splitter.withdrawOriginalNFT({from: alice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)
        const nftBalance = await aliceNFT.balanceOf.call(alice, tokenId)

        assert.equal(finalAliceBalance, 0, 'Alice should have 0 tokens');
        assert.equal(finalBobBalance, 0, 'Bob should own 0 token');
        assert.equal(nftBalance, tokensToCreate, `Alice should own ${tokensToCreate} tokens from her original NFT`);

    });

    it('16- All pieces Owner can withdraw all tokens from splitter', async function () {
        const { proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const unitPrice = new BN(web3.utils.toWei('0.5', 'ether'));
        await splitter.splitMyNFT( tokenId, unitPrice, 10, 8,  {
            from: alice,
        });
        //simulating an airdrop to proxy address
        await aliceNFT.mint(proxyAddress, tokenId, tokensToCreate, '0x0000', {from: alice});


        await splitter.withdrawOriginalNFT({from: alice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, tokenId)
        const finalBobBalance = await splitter.balanceOf.call(bob, tokenId)
        const nftBalance = await aliceNFT.balanceOf.call(alice, tokenId)

        assert.equal(finalAliceBalance, 0, 'Alice should have 0 tokens');
        assert.equal(finalBobBalance, 0, 'Bob should own 0 token');
        assert.equal(nftBalance, tokensToCreate * 2 , `Alice should own ${tokensToCreate * 2} tokens from her original NFT`);


    });

})

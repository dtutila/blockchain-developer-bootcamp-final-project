const base = artifacts.require('NFTSplitter')
const admin = artifacts.require('NFTSplitterAdmin')
const factory = artifacts.require('NFTSplitterFactory')
const nft = artifacts.require('NFTMock')
const proxy = artifacts.require('NFTSplitterProxy')
const ERC1155 = artifacts.require('ERC1155')

const BN = require('bignumber.js');

async function initTextContext(factoryContract, alice, aliceNFT, approveForAll) {
    const splitterProxy = await factoryContract.createNFTSplitter(aliceNFT.address , {
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

contract('NFTSplitter', function (accounts) {
    const [owner, alice, bob] = accounts
    let factoryContract, adminContract, baseContract, aliceNFT;

    beforeEach(async () => {
        baseContract = await base.deployed();
        adminContract = await admin.deployed();
        factoryContract = await factory.deployed();
        aliceNFT = await nft.new("Alice's NFT", 'ANFT', {from: alice});
        await aliceNFT.mint(alice, 1, 122, '0x0000', {from: alice});
        await aliceNFT.setURI('URI:id', {from: alice});
    })

    it('NFT Splitter Base contract should be set up in factory contract', async function () {
        const baseAddress = await factoryContract.getNFTSplitterBase.call()

        assert.equal(
            baseContract.address,
            baseAddress,
            'Base contract address must be configured',
        );
    })


    it('NFT Owner should be able to create a new nft splitter proxy ', async function () {
        const splitterProxy = await factoryContract.createNFTSplitter(aliceNFT.address , {

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

    it('NFT Owner should be able to split NFT ', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether');
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });

        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, 1);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, 1);

        const name = await splitter.name.call();
        const symbol = await splitter.symbol.call();
        const baseName = await baseContract.name.call();

        assert.equal(baseName, "NFT Splitter", "Base Contract NFT name should be 'NFT Splitter'");
        assert.equal(name, "NFT Splitter - Alice's NFT", "Name should start with 'NFT Splitter -'");
        assert.equal(symbol, "NSANFT", "Symbol should start with 'NS'");
        assert.equal(finalAliceBalance, 0, 'Alice should not have any token');
        assert.equal(finalProxyBalance, 122, 'Proxy should own all tokens');
    });

    it('Revert if split is executed by other account', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether');
        try {
            await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
                from: bob,
            });
        } catch (error) {
            assert(error);
            assert.equal(error.reason, "NFTSplitter: Only original NFT owner can execute this function");
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, 1);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, 1);
        const finalBobBalance = await aliceNFT.balanceOf.call(bob, 1); // :)


        assert.equal(finalAliceBalance, 122, 'Alice should not have any token');
        assert.equal(finalProxyBalance, 0, 'Proxy should own all tokens');
        assert.equal(finalBobBalance, 0, 'should be 0');
    });

    it('NFT Owner should not be able to split same NFT twice', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether')
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });
        //splitting the same NFT instance
        try {
            await splitter.splitMyNFT( 1, price, 4, 2, 2, 1, {
                from: alice,
            })
        } catch (error) {
            assert(error);
            assert.equal(error.reason, "ERC1155: caller is not owner nor approved");
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, 1)
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, 1)

        assert.equal(finalAliceBalance, 0, 'Alice should not have any token')
        assert.equal(finalProxyBalance, 122, 'Proxy should own all tokens')
    });

    it('NFT Owner should not be able to split unapproved NFT', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, false);

        const price = web3.utils.toWei('0.5', 'ether');

        try {
            await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
                from: alice,
            });
        } catch (error) {
            assert(error);
            assert.equal(error.reason, "ERC1155: caller is not owner nor approved");
        }


        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, 1);
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, 1);

        assert.equal(finalAliceBalance, 122, 'Alice should have all tokens');
        assert.equal(finalProxyBalance, 0, 'Proxy should not have any tokens');
    });


    it('Other account can buy pieces (tokens)', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const price = web3.utils.toWei('0.5', 'ether')
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });
        const initialAliceBalanceETH = new BN(await web3.eth.getBalance(alice));

        //buying a piece
        const onePieceValue =  (price /8);
        await splitter.buyPiecesFromOwner(1, {from: bob, value: onePieceValue});

        const finalAliceBalance = await splitter.balanceOf.call(alice, 1)
        const finalBobBalance = await splitter.balanceOf.call(bob, 1)
        const finalAliceBalanceETH = new BN(await web3.eth.getBalance(alice));
        assert.equal(finalAliceBalance, 7, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');
        assert.equal(initialAliceBalanceETH.toNumber(), finalAliceBalanceETH.minus(onePieceValue).toNumber() , 'Alice should have more eth');
    });

    it('Owner should not use buyPiecesFromOwner', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const price = web3.utils.toWei('0.5', 'ether');
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });

        //buying a piece
        const onePieceValue =  (price /8);
        await splitter.buyPiecesFromOwner(1, {from: bob, value: onePieceValue});
        try{
           await splitter.buyPiecesFromOwner(1, {from: alice, value: onePieceValue});
        }catch (error){
            assert(error);
            assert.equal(error.reason, "NFTSplitter: Original NFT owner is not allowed to execute this function");
        }


        const finalAliceBalance = await splitter.balanceOf.call(alice, 1)
        const finalBobBalance = await splitter.balanceOf.call(bob, 1)

        assert.equal(finalAliceBalance, 7, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');

    });

    it('Account cannot buy more than initial selling supply', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const price = web3.utils.toWei('0.5', 'ether');
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });


        //buying a piece
        const onePieceValue =  (price /8);
        try{
            await splitter.buyPiecesFromOwner(5, {from: bob, value: onePieceValue});
        }catch (error){
            assert(error);
            assert.equal(error.reason, "NFTSplitter: not enough pieces to buy");
        }

        const finalAliceBalance = await splitter.balanceOf.call(alice, 1)
        const finalBobBalance = await splitter.balanceOf.call(bob, 1)

        assert.equal(finalAliceBalance, 8, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 0, 'Bob should own 1 token');

    });

    it('Owner can buy back pieces', async function () {
        const { splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const price = new BN(web3.utils.toWei('0.5', 'ether'));
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });



        const onePieceValue = price.dividedBy(8) ;
        await splitter.buyPiecesFromOwner(2, {from: bob, value: onePieceValue.multipliedBy(2)});
        const initialBobBalanceETH = new BN(await web3.eth.getBalance(bob));
        const buyBackPrice = (onePieceValue.multipliedBy(1.1));
        await splitter.buyBackPieces(bob, 1, {from: alice, value: buyBackPrice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, 1)
        const finalBobBalance = await splitter.balanceOf.call(bob, 1)
        const finalBobBalanceETH = new BN(await web3.eth.getBalance(bob));
        assert.equal(finalAliceBalance, 7, 'Alice should have 7 tokens');
        assert.equal(finalBobBalance, 1, 'Bob should own 1 token');
        assert(finalBobBalanceETH.minus(initialBobBalanceETH).isEqualTo(buyBackPrice) , 'Bob should have the eth from the trx');
    });

    it('Owner can withdraw NFT', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);
        const price = new BN(web3.utils.toWei('0.5', 'ether'));
        await splitter.splitMyNFT( 1, price, 10, 8, 4, 15, {
            from: alice,
        });
        const onePieceValue = price.dividedBy(8) ;
        await splitter.buyPiecesFromOwner(2, {from: bob, value: onePieceValue.multipliedBy(2)});


        const buyBackPrice = (onePieceValue.multipliedBy(1.1)).multipliedBy(2);
        await splitter.buyBackPieces(bob, 2, {from: alice, value: buyBackPrice});
        await splitter.withdrawOriginalNFT({from: alice});

        const finalAliceBalance = await splitter.balanceOf.call(alice, 1)
        const finalBobBalance = await splitter.balanceOf.call(bob, 1)
        const nftBalance = await aliceNFT.balanceOf.call(alice, 1)

        assert.equal(finalAliceBalance, 0, 'Alice should have 0 tokens');
        assert.equal(finalBobBalance, 0, 'Bob should own 0 token');
        assert.equal(nftBalance, 122, 'Alice should own 122 tokens from her original NFT');


    });

})

const base = artifacts.require('NFTSplitter')
const admin = artifacts.require('NFTSplitterAdmin')
const factory = artifacts.require('NFTSplitterFactory')
const nft = artifacts.require('NFTMock')
const proxy = artifacts.require('NFTSplitterProxy')

let BN = web3.utils.BN

async function initTextContext(factoryContract, alice, aliceNFT, approveForAll) {
    const splitterProxy = await factoryContract.createNFTSplitter({
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
        const splitterProxy = await factoryContract.createNFTSplitter({
            from: alice,
        })

        const proxyAddress = splitterProxy.logs[0].args.proxyAddress
        const splitter = await proxy.at(proxyAddress, {from: alice})

        const name = await splitter.name.call()
        const settings = await splitter.getSettings()
        const originalOwner = await splitter.originalOwner.call()

        assert.equal(alice, originalOwner, 'Alice should be the proxy owner');
        assert.equal(name, 'proxy', 'Initial proxy nft name shoud be proxy');
        assert.equal(
            settings,
            adminContract.address,
            'Settings value should be admin contract',
        );
    })

    it('NFT Owner should be able to split NFT ', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether')
        await splitter.splitMyNFT(aliceNFT.address, 1, price, 10, 8, 4, 15, {
            from: alice,
        })

        const finalAliceBalance = await aliceNFT.balanceOf.call(alice, 1)
        const finalProxyBalance = await aliceNFT.balanceOf.call(proxyAddress, 1)

        const name = await splitter.name.call();
        const symbol = await splitter.symbol.call();
        const baseName = await baseContract.name.call();

        assert.equal(baseName, "NFT Splitter", "Base Contract NFT name should be 'NFT Splitter'");
        assert.equal(name, "NFT Splitter - Alice's NFT", "Name should start with 'NFT Splitter -'");
        assert.equal(symbol, "NSANFT", "Symbol should start with 'NS'");
        assert.equal(finalAliceBalance, 0, 'Alice should not have any token');
        assert.equal(finalProxyBalance, 122, 'Proxy should own all tokens');
    })

    it('Revert if split is executed by other account', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether')
        try {
            await splitter.splitMyNFT(aliceNFT.address, 1, price, 10, 8, 4, 15, {
                from: bob,
            })
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
    })

    it('NFT Owner should not be able to split same NFT twice', async function () {
        const {proxyAddress, splitter} = await initTextContext(factoryContract, alice, aliceNFT, true);

        const price = web3.utils.toWei('0.5', 'ether')
        await splitter.splitMyNFT(aliceNFT.address, 1, price, 10, 8, 4, 15, {
            from: alice,
        })
        //splitting the same NFT instance
        try {
            await splitter.splitMyNFT(aliceNFT.address, 1, price, 4, 2, 2, 1, {
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

        const price = web3.utils.toWei('0.5', 'ether')

        try {
            await splitter.splitMyNFT(aliceNFT.address, 1, price, 10, 8, 4, 15, {
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
    })
})

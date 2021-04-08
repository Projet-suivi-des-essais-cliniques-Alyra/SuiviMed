const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { BN } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const Voting = artifacts.require('SuiviMed');

contract('SuiviMed Tests', function (accounts) {
    const root = accounts[0];
    const promoterAdmin= accounts[1];
    const authorityAdmin = accounts[2];

    // const notOwner = accounts[1];
    // const nonAuthorized = accounts[2];
    // const whitelisted2 = accounts[3];
    // const authorizedVoter1 = accounts[4]
    // const authorizedVoter2= accounts[5]
    // const authorizedVoter3 = accounts[6]
    // const authorizedVoter4 = accounts[7]
    // const authorizedVoter5 = accounts[8]
    // const authorizedVoter6 = accounts[9]

    // Before each unitary tests
    beforeEach(async function () {
        this.SuiviMedInstance = await SuiviMed.new({from: root});
    });
});

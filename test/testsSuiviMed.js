const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { BN } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const SuiviMed = artifacts.require('SuiviMed');

contract("SuiviMed", function (accounts) {
    const root = accounts[0];
    const promoterAdmin= accounts[1];
    const authorityAdmin = accounts[2];
    const promoter1 = accounts[3];
    const authority1 = accounts[4];
    const noRole = accounts[5];
    const promoter2 = accounts[6];
   
    // Before each unitary tests
    beforeEach(async function () {
        this.SuiviMedInstance = await SuiviMed.new(root,promoterAdmin,authorityAdmin,{from:root});
    });

    it('verifies proper access to addPromoter function', async function () {
        // verifies revert if called by noRole address
        await (expectRevert(this.SuiviMedInstance.addPromoter(promoter1, {from:noRole}),"You are not Promoter Admin!"));
        // verifies promoter1 address properly is promoters first Promoter address 
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        let promoters = await this.SuiviMedInstance.promoters; 
        let firstPromoter = await promoters(0);
        let firstPromoterAddress = await firstPromoter.promoterAddress;
        expect(firstPromoterAddress).to.equal(promoter1);
    });

    it('verifies createProtocol', async function () {
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMedInstance.addPromoter(promoter2,{from:promoterAdmin});
        //verifies that the promoter creating the protocol must be in the list of promoters of this protocol
        await expectRevert(this.SuiviMedInstance.createProtocol(0,"descriptionCID","treatmentListCID",{from:promoter2}),"Not among promoters of this protocol!");
    })

});

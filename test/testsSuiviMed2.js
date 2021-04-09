const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { BN } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const SuiviMed2 = artifacts.require('SuiviMed2');

contract("SuiviMed", function (accounts) {
    const root = accounts[0];
    const promoterAdmin= accounts[1];
    const authorityAdmin = accounts[2];
    const promoter1 = accounts[3];
    const authority1 = accounts[4];
    const noRole = accounts[5];
    const promoter2 = accounts[6];
    const investigator1 = accounts[7];
    const patient1 = accounts[8];
    const patient2 = accounts[9];
    const patient3 = accounts[10];
    const investigator2 = accounts[11];

    // Before each unitary tests
    beforeEach(async function () {
        this.SuiviMed2Instance = await SuiviMed2.new(root,promoterAdmin,authorityAdmin,{from:root});
    });

    it('verifies proper access to addPromoter function', async function () {
        // verifies revert if called by noRole address
        await (expectRevert(this.SuiviMed2Instance.addPromoter(promoter1, {from:noRole}),"You are not Promoter Admin!"));
        // verifies promoter1 address properly is promoters first Promoter address 
        await this.SuiviMed2Instance.addPromoter(promoter1,{from:promoterAdmin});
        let PROMOTER = await this.SuiviMed2Instance.PROMOTER();
        let bool = await this.SuiviMed2Instance.hasRole(PROMOTER,promoter1);
        expect(bool).to.equal(true);
    });

    it('verifies alert on protocol prevents data of patients to be collected or patients to be added ', async function () {
        await this.SuiviMed2Instance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMed2Instance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMed2Instance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMed2Instance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMed2Instance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMed2Instance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        await this.SuiviMed2Instance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:investigator1});
        //investigator1 set alert on
        await this.SuiviMed2Instance.setAlertOn(1,0,{from:investigator1});
        //verifies that the investigator1 cannot add another patient while alert is on for protocol[0]
        await expectRevert(this.SuiviMed2Instance.addPatient(patient3,0,"Data3aCID","Name3CID",{from:investigator1}),
        "This protocol has an alert!");
        // //verifies that the investigator1 cannot add collect data of patients while alert is on for protocol[0]
        await expectRevert(this.SuiviMed2Instance.collectData(0,"Data3bCID",{from:investigator1}),"Alert on this protocol!");
    })

    it('verifies consents of patients is revoked when protocol is updated', async function () {
        await this.SuiviMed2Instance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMed2Instance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMed2Instance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMed2Instance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMed2Instance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMed2Instance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        await this.SuiviMed2Instance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:investigator1});
        //before protocol update
        let patients = await this.SuiviMed2Instance.patients; 
        let firstPatient = await patients(0);
        let secondPatient = await patients(1);
        let firstPatientConsent = await firstPatient.consent; 
        let secondPatientConsent = await secondPatient.consent; 
        expect(firstPatientConsent).to.equal(true);
        expect(firstPatientConsent).to.equal(true);
        //promoter1 updates protocol
        await this.SuiviMed2Instance.updateProtocol(0,"newDescriptionCID","newTreatmentListCID",{from:promoter1});
        //after protocol update
        patients = await this.SuiviMed2Instance.patients; 
        firstPatient = await patients(0);
        secondPatient = await patients(1);
        firstPatientConsent = await firstPatient.consent; 
        secondPatientConsent = await secondPatient.consent; 
        expect(firstPatientConsent).to.equal(false);
        expect(firstPatientConsent).to.equal(false);        
    })

    it('verifies data of patients, which revoked their consent, cannot be collected anymore', async function () {
        await this.SuiviMed2Instance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMed2Instance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMed2Instance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMed2Instance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMed2Instance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMed2Instance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        //patient1 revoke his consent
        await this.SuiviMed2Instance.revokeConsent(0,{from:patient1});
        //verifies consent has been properly revoked for patient1
        let patients = await this.SuiviMed2Instance.patients; 
        let firstPatient = await patients(0);
        let firstPatientConsent = await firstPatient.consent;
        expect(firstPatientConsent).to.equal(false);
        //verifies data of patients[0] cannot be collected anymore
        await expectRevert(this.SuiviMed2Instance.collectData(0,"Data1bCID",{from:investigator1}),"No patient's consent!");        
    })

});

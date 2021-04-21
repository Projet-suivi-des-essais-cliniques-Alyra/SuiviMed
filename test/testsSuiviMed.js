const { expectRevert, expectEvent } = require('../client/node_modules/@openzeppelin/test-helpers');
const { BN } = require('../client/node_modules/@openzeppelin/test-helpers/src/setup');
const { expect } = require('../client/node_modules/chai');
const SuiviMed = artifacts.require('SuiviMed');

contract("SuiviMed", function (accounts) {
    const promoterAdmin= accounts[0];
    const authorityAdmin = accounts[1];
    const promoter1 = accounts[2];
    const authority1 = accounts[3];
    const noRole = accounts[4];
    const promoter2 = accounts[5];
    const investigator1 = accounts[6];
    const patient1 = accounts[7];
    const patient2 = accounts[8];
    const patient3 = accounts[9];
    const investigator2 = accounts[10];
    const authority2 = accounts[11];

    // Before each unitary tests
    beforeEach(async function () {
        this.SuiviMedInstance = await SuiviMed.new(promoterAdmin,authorityAdmin);
    });
   
    it('Test verifies proper access to addPromoter function', async function () {
        // verifies revert if called by noRole address
        await expectRevert(this.SuiviMedInstance.addPromoter(promoter1, {from:noRole}),"You are not Promoter Admin!");
        // verifies promoter1 address properly is promoters first Promoter address 
        let receipt = await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        expectEvent(receipt, "promoterAdded", {_addressPromoter: promoter1 });
        let PROMOTER = await this.SuiviMedInstance.PROMOTER();
        let bool = await this.SuiviMedInstance.hasRole(PROMOTER,promoter1);
        expect(bool).to.equal(true);
        // verifies that a promoter cannot be added twice
        await expectRevert.unspecified(this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin})); 
    });

    it('Test verifies proper functionning of addPatient function', async function () {
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMedInstance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMedInstance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMedInstance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMedInstance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMedInstance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        //verifies Patient cannot be added by other than investigator
        await expectRevert(this.SuiviMedInstance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:promoter1}),"You are not Investigator!");
        await this.SuiviMedInstance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:investigator1});
        //verifies Patient1 cannot be added again
        await expectRevert(this.SuiviMedInstance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1}),"Patients already registered!");
    });

    it('Scenario verifying the functionning of alert on protocol', async function () {
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMedInstance.addPromoter(promoter2,{from:promoterAdmin});
        await this.SuiviMedInstance.addAuthority(authority1,{from:authorityAdmin});
        await this.SuiviMedInstance.addAuthority(authority2,{from:authorityAdmin});
        //promoter1 creates protocol[0],promoter2 creates protocol[1]
        await this.SuiviMedInstance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        await this.SuiviMedInstance.createProtocol("description1CID","treatmentList1CID",{from:promoter2});
        //authority1 validates protocol[0:1]
        await this.SuiviMedInstance.validateProtocol(0,{from:authority1});
        await this.SuiviMedInstance.validateProtocol(1,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMedInstance.createProject(0,investigator1,{from:promoter1});
        //promoter2 creates project[1] and add investigator2
        await this.SuiviMedInstance.createProject(1,investigator2,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMedInstance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        await this.SuiviMedInstance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:investigator1});
        //investigator1 set alert on
        await this.SuiviMedInstance.setAlertOn(1,0,{from:investigator1});
        //verifies that the investigator1 cannot add another patient while alert is on for protocol[0]
        await expectRevert(this.SuiviMedInstance.addPatient(patient3,0,"Data3aCID","Name3CID",{from:investigator1}),
        "This protocol has an alert!");
        // verifies that others protocols activities are still active
        // ... for instance no revert expected for adding patient3 to projects[1] by investigator2
        await this.SuiviMedInstance.addPatient(patient3,1,"Data3aCID","Name3CID",{from:investigator2});
        //... however the investigator1 cannot collect data of patients while alert is on for protocol[0]
        await expectRevert(this.SuiviMedInstance.collectData(0,"Data3bCID",{from:investigator1}),"Alert on this protocol!");
        // verifies that agreement of promoter and authority is needed to resume activity of protocols[0]
        await this.SuiviMedInstance.agreeOnResume(0,{from:promoter1});
        await expectRevert(this.SuiviMedInstance.agreeOnResume(0,{from:promoter2}),"not eligible to give agreement!");
        // verifies that we cannot acces resumeAfterAlert() yet 
        await expectRevert(this.SuiviMedInstance.resumeAfterAlert(0,{from:promoter1}),"promoter and authority not agreed yet!");
        // authority1 is now agreeing on resuming ... and promoter1 to restart clinical trials
        await this.SuiviMedInstance.agreeOnResume(0,{from:authority1});
        await this.SuiviMedInstance.resumeAfterAlert(0,{from:promoter1});
        //We can then verify that investigator1 can add another patient to the project or collect patients data again
        this.SuiviMedInstance.addPatient(patient3,0,"Data3aCID","Name3CID",{from:investigator1});
        this.SuiviMedInstance.collectData(0,"Data3bCID",{from:investigator1});
    })
    
    it('Scenario verifying consents of patients is revoked when protocol is updated', async function () {
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMedInstance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMedInstance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMedInstance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMedInstance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMedInstance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        await this.SuiviMedInstance.addPatient(patient2,0,"Data2aCID","Name2CID",{from:investigator1});
        //before protocol update
        let patients = await this.SuiviMedInstance.patients; 
        let firstPatient = await patients(0);
        let secondPatient = await patients(1);
        let firstPatientConsent = await firstPatient.consent; 
        let secondPatientConsent = await secondPatient.consent; 
        expect(firstPatientConsent).to.equal(true);
        expect(secondPatientConsent).to.equal(true);
        //promoter1 updates protocol
        await this.SuiviMedInstance.updateProtocol(0,"newDescriptionCID","newTreatmentListCID",{from:promoter1});
        //after protocol update
        patients = await this.SuiviMedInstance.patients; 
        firstPatient = await patients(0);
        secondPatient = await patients(1);
        firstPatientConsent = await firstPatient.consent; 
        secondPatientConsent = await secondPatient.consent; 
        expect(firstPatientConsent).to.equal(false);
        expect(firstPatientConsent).to.equal(false);        
        //verifies that patient(0), and only him, can give its consent again
        await expectRevert(this.SuiviMedInstance.consent(0,{from:investigator1}),"you are not authorized to do that!");
        await this.SuiviMedInstance.consent(0,{from:patient1})
        patients = await this.SuiviMedInstance.patients; 
        firstPatient = await patients(0);
        firstPatientConsent = await firstPatient.consent;
        expect(firstPatientConsent).to.equal(true);
    })

    it('Scenario verifying data of patients, whose consent were revoked, cannot be collected anymore', async function () {
        await this.SuiviMedInstance.addPromoter(promoter1,{from:promoterAdmin});
        await this.SuiviMedInstance.addAuthority(authority1,{from:authorityAdmin});
        //promoter1 creates protocol[0]
        await this.SuiviMedInstance.createProtocol("descriptionCID","treatmentListCID",{from:promoter1});
        //authority1 validates protocol[0]
        await this.SuiviMedInstance.validateProtocol(0,{from:authority1});
        //promoter1 creates project[0] and add investigator1
        await this.SuiviMedInstance.createProject(0,investigator1,{from:promoter1});
        //investigator1 adds patients to projects[0]
        await this.SuiviMedInstance.addPatient(patient1,0,"Data1aCID","Name1CID",{from:investigator1});
        //patient1 revoke his consent
        await this.SuiviMedInstance.revokeConsent(0,{from:patient1});
        //verifies consent has been properly revoked for patient1
        let patients = await this.SuiviMedInstance.patients; 
        let firstPatient = await patients(0);
        let firstPatientConsent = await firstPatient.consent;
        expect(firstPatientConsent).to.equal(false);
        //verifies data of patients[0] cannot be collected anymore
        await expectRevert(this.SuiviMedInstance.collectData(0,"Data1bCID",{from:investigator1}),"No patient's consent!");        
    })

});

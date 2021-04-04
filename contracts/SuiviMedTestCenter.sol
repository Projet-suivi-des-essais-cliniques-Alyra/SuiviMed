// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./SuiviMedTestCenter"

contract SuiviMedTestCenter is AccessControl {

    enum Status {DEPLOYED, SUSPENDED, CLOSED}

    //investigators that can interact with this TestCenter
    address[] whitelistInvestigators;
    //patients that can interact with this TestCenter
    address[] whitelistPatients;

    struct Investigator{
        bytes32 role; 
        Patients[] patients;
    }

    struct Patient{
        bytes32 role;
        address addr;
        bool consent;
        bytes32 dataIPFS;
    }

    //creation of the testCenter
    constructor(
        address payable _promoter,
        Protocol _protocol,
        uint256 _price
    ) public {
        promoter = _promoter;
        createdAt = now;
        price = _price;
        status = Status.DEPLOYED;
    }


    function consent() {
    }

    function revokeConsent(){
    }

    function collectData() {
    }

    function readData(){
    }

    function uploadToIPFS() {
    }

    function encryptData() {
    }

    function decryptData() {
    }

    function retrieveDataFromIPFS () {
    }

    function destroyDataAccess() {   
    }

    //to add whitelisted patients
    function addWhitelistedPatient(testCenter _testCenterID, address _patientAddress) Only {        
    }
    //to remove whitelisted patients
    function removeWhitelistedPatient(testCenter _testCenterID, uint _patientID) OnlyOwner {        
    }
    //to add whitelisted investigators
    function addWhitelistedInvestigators(testCenter _testCenterID,address _investigatorAdress) OnlyOwner {        
    }
    //to remove whitelisted investigators
    function removeWhitelistedInvestigators(testCenter _testCenterID,uint _investigatorAdress) OnlyOwner {        
    }

}

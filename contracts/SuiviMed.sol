// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma abicoder v2;

// import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMed {
    struct Promoter {
        uint256 protocolID;
        address promoterAddress;
    }

    struct Authority {
        uint256[] protocolsIDs;
        address authorityAddress;
    }

    struct Investigator {
        uint256 protocolID;
        address investigaterAddress;
    }

    struct Patient {
        address patientAddress;
        uint256 investigatorID;
        string dataCID;
        string nameCID;
        bool consent;
    }

    struct Protocol {
        uint promoterID;
        string descriptionCID;
        string treatmentsListCID;
        uint256 date;
    }

    struct Project {
        bool validated;
        uint256 protocolID;
        uint256 promoterID;
        uint256 investigatorID;
    }

    Protocol[] public protocols;
    Promoter[] public promoters;
    Investigator[] public investigators;
    Project[] public projects;
    Patient[] public patients;

    event projectCreation(uint256 _projectID);
    event projectValidation(uint256 _projectID);

    //enum Status {PENDING, SUSPENDED, ACTIVE, COMPLETED}

    // address[2] public authorities = [
    //     0xe5AF13a5E443287f8c8190A6C168983abDbe9E96,
    //     0x7625d6c5Af7B0a164514643f03e82347D2A121E3
    // ];
    // address[2] public promoters = [
    //     0x3635fc0ED49288237dd0bebA412e12A91Ac52471,
    //     0x194454F5CcD670C9a3f32ab0d065b0E475F9Ef57
    // ];

    function createProtocol(
        uint _promoterID,
        string memory _descriptionCID,
        string memory _treatmentsListCID
    ) public {
        // require(hasRole("PROMOTER", msg.sender),"You are not promoter!");
        protocols.push(
            Protocol(_promoterID,_descriptionCID, _treatmentsListCID, block.timestamp)
        );
    }

    function addPromoter(address _addressPromoter) public {
        // require(hasRole("ADMIN", msg.sender), "You are not admin!");
        // grantRole("PROMOTER", _addressPromoter);
        promoters.push(Promoter(0, _addressPromoter));
    }
    
    function createProject(
        uint256 _protocolID,
        uint256 _promoterID,
        address _investigatorAddress
    ) public {
        investigators.push(Investigator(_protocolID,_investigatorAddress));
        projects.push(
            Project(false, _protocolID, _promoterID, investigators.length-1)
        );
        uint256 projectID = projects.length - 1;

        emit projectCreation(projectID);
    }

    function validateProject(uint256 _projectID) public {
        //  require(hasRole("AUTHORITY", msg.sender), "You are not authority!");
        projects[_projectID].validated = true;

        emit projectValidation(_projectID);
    }

    function addPatient(
        address _patientAddress,
        uint256 _investigatorID,
        string memory _dataCID,
        string memory _nameCID
    ) public {
        //  require(hasRole("INVESTIGATOR", msg.sender), "You are not investigator!");

        patients.push(
            Patient(_patientAddress, _investigatorID, _dataCID, _nameCID, true)
        );
    }

    function revokeConsent(uint256 _patientID) public {
        require(
            patients[_patientID].patientAddress == msg.sender,
            "you are not authorized to do that!"
        );
        patients[_patientID].consent = false;
    }

    function collectData(uint256 _patientID,string memory _newDataCID) public {
        require(
            investigators[patients[_patientID].investigatorID]
                .investigaterAddress == msg.sender,
            "You are not authorized to access this patient's data!"
        );
        patients[_patientID].dataCID = _newDataCID;
    }









    /*     function createTestCenter(uint _protocolID,,uint[] memory _investigatorsIDs) public {
        // require(hasRole("PROMOTER", msg.sender),"You are not promoter!");
        testCenters.push(TestCenter(_protocolID,_promotersIDs,_investigatorsIDs));
        
        
        for (uint index = 1; index < _investigatorsIDs.length; index++) {
            investigators[_investigatorsIDs[index]].protocols.push(_protocolID);
        }
    } */

    // //addresses that can interact with SuiviMed
    // mapping(address => admin) public whitelist;

    // //
    // struct Admin{
    //     bytes32 role; //role = promoteur, autorite, investigateur
    //     bytes32 protocole;
    // }

    // struct Patient{
    //     address addr;
    //     bool consent;
    //     bytes32 dataCID;
    // }

    // //definition de l'administrateurs
    // constructor () {
    //     whitelist[msg.sender] = true;
    // }

    // function consent() {
    // }

    // function revokeConsent(){
    // }

    // function collectData() {
    // }

    // function readData(){
    // }

    // function uploadToIPFS() {
    // }

    // function encryptData() {
    // }

    // function decryptData() {
    // }

    // function retrieveDataFromIPFS () {
    // }

    // function destroyDataAccess() {
    // }
}

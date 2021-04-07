// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMed is AccessControl {
    
    bytes32 public constant AUTHORITY = keccak256("AUTHORITY");
    bytes32 public constant ADMINSAUTHORITY = keccak256("ADMINSAUTHORITY");
    bytes32 public constant PROMOTER = keccak256("PROMOTER");
    bytes32 public constant ADMINSPROMOTER = keccak256("ADMINSPROMOTER");
    bytes32 public constant INVESTIGATOR = keccak256("INVESTIGATOR");
    
    struct Promoter {
        uint256 protocolID;
        address promoterAddress;
    }

    struct Authority {
        uint256[] projectsIDs;
        address authorityAddress;
    }

    struct Investigator {
        uint256 protocolID;
        address investigaterAddress;
    }

    struct Patient {
        address patientAddress;
        uint256 investigatorID;
        string[] dataCID;
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
    Authority[] public authorities;

    event projectCreation(uint256 _projectID);
    event projectValidation(uint256 _projectID);

    constructor (address root,address _addressPromoter,address _addressAuthority)
    {
        // @dev Add `root` to the admin role as a member.
        _setupRole(DEFAULT_ADMIN_ROLE,root);
        // @dev Set ADMINSPROMOTER as Admins of PROMOTER
        _setRoleAdmin(ADMINSPROMOTER, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(PROMOTER,ADMINSPROMOTER);
        _setRoleAdmin(INVESTIGATOR,PROMOTER);
        // @dev Set ADMINSAUTHORITY as Admins of AUTHORITY
        _setRoleAdmin(ADMINSAUTHORITY, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY,ADMINSAUTHORITY);
        // @dev Set first admins addresses for Authorities and Promoters
        _setupRole(ADMINSAUTHORITY,_addressAuthority);
        _setupRole(ADMINSPROMOTER,_addressPromoter);
        // @dev root renounces its admin priviledge
        renounceRole(DEFAULT_ADMIN_ROLE,root);
    }

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
        require(hasRole(ADMINSPROMOTER, msg.sender), "You are not Promoter Admin!");
        grantRole(PROMOTER,_addressPromoter);
        Promoter memory promoter;
        promoter.promoterAddress = _addressPromoter;
        promoters.push(promoter); 
    }
   
    function addAuthority(address _addressAuthority) public {
        require(hasRole(ADMINSAUTHORITY, msg.sender), "You are not Authority Admin!");
        // grantRole("PROMOTER", _addressPromoter);
        grantRole(AUTHORITY,_addressAuthority);
        Authority memory authority;
        authority.authorityAddress = _addressAuthority;
        authorities.push(authority);
    }
    
    function createProject(
        uint256 _protocolID,
        uint256 _promoterID,
        address _investigatorAddress
    ) public {
        require(hasRole(PROMOTER, msg.sender), "You are not Promoter!");
        investigators.push(Investigator(_protocolID,_investigatorAddress));
        grantRole(INVESTIGATOR,_investigatorAddress);
        projects.push(
            Project(false, _protocolID, _promoterID, investigators.length-1)
        );
        uint256 projectID = projects.length - 1;

        emit projectCreation(projectID);
    }

    function validateProject(uint256 _projectID,uint _authorityID) public {
        require(hasRole(AUTHORITY, msg.sender), "You are not authority!");
        projects[_projectID].validated = true;
        authorities[_authorityID].projectsIDs.push(_projectID);
        emit projectValidation(_projectID);
    }

    function addPatient(
        address _patientAddress,
        uint256 _investigatorID,
        string memory _dataCID,
        string memory _nameCID
    ) public {
        require(hasRole(INVESTIGATOR, msg.sender), "You are not investigator!");
        Patient memory _patient;
        
        _patient.patientAddress = _patientAddress;
        _patient.investigatorID = _investigatorID;
        _patient.nameCID = _nameCID;
        _patient.consent = true;
       
        patients.push(_patient);
        
        patients[patients.length -1].dataCID.push(_dataCID);
        
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
        //@dev to keep historic of dataCID in the blockchain
        patients[_patientID].dataCID.push(_newDataCID);
    }

    function getPatientDataCID(uint256 _patientID) view public returns (string[] memory) {
        return patients[_patientID].dataCID;
    }


}

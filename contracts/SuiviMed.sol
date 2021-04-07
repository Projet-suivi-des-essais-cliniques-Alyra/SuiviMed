// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMed is AccessControl {
    
    bytes32 public constant AUTHORITY = keccak256("AUTHORITY");
    bytes32 public constant AUTHORITYADMIN = keccak256("AUTHORITYADMIN");
    bytes32 public constant PROMOTER = keccak256("PROMOTER");
    bytes32 public constant PROMOTERADMIN = keccak256("PROMOTERADMIN");
    bytes32 public constant INVESTIGATOR = keccak256("INVESTIGATOR");
    
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
        uint256 projectID;
        string[] dataCID;
        string nameCID;
        bool consent;
    }

    struct Protocol {
        bool validated;
        uint promoterID;
        string descriptionCID;
        string treatmentsListCID;
        bool alertOn;
        uint256 date;
    }

    struct Project {
        uint256 protocolID;
        uint256 promoterID;
        uint256 investigatorID;
    }
    
    // @dev To keep track which authority has validated protocols 
    mapping(uint=>address) validatedProtocolByAuthority;
    // @dev to keep track which patients were added to a project
    mapping(uint=>uint[]) projectIDToPatientsIDs;
    // @dev to keep track which projects are associated with a protocol (for now only one)
    mapping(uint=>uint) protocolIDToProjectID;
    // @dev for multisig agreement on resuming clinical trials
    mapping(address=>bool) agreedOnResume;
    
    
    Protocol[] public protocols;
    Promoter[] public promoters;
    Investigator[] public investigators;
    Project[] public projects;
    Patient[] public patients;
    Authority[] public authorities;

    event projectCreation(uint256 _projectID);
    event protocolValidation(uint256 _protocolID);
    event alert(uint _patientID,uint _projectID);
    event protocolUpdated(uint _protocolID);

    constructor (address root,address _addressPromoter,address _addressAuthority)
    {
        // @dev Add `root` to the admin role as a member.
        _setupRole(DEFAULT_ADMIN_ROLE,root);
        // @dev Set PROMOTERADMIN as Admins of PROMOTER
        _setRoleAdmin(PROMOTERADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(PROMOTER,PROMOTERADMIN);
        // @dev Set PROMOTER as Admins of INVESTIGATOR
        _setRoleAdmin(INVESTIGATOR,PROMOTER);
        // @dev Set AUTHORITYADMIN as Admins of AUTHORITY
        _setRoleAdmin(AUTHORITYADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY,AUTHORITYADMIN);
        // @dev Set first admins addresses for Authorities and Promoters
        _setupRole(AUTHORITYADMIN,_addressAuthority);
        _setupRole(PROMOTERADMIN,_addressPromoter);
        // @dev root renounces its admin priviledge
        renounceRole(DEFAULT_ADMIN_ROLE,root);
    }

    function createProtocol(
        uint _promoterID,
        string memory _descriptionCID,
        string memory _treatmentsListCID
    ) public {
        require(hasRole(PROMOTER, msg.sender),"You are not promoter!");
        protocols.push(
            Protocol(false,_promoterID,_descriptionCID, _treatmentsListCID, false, block.timestamp)
        );
    }
    
    function addPromoter(address _addressPromoter) public {
        require(hasRole(PROMOTERADMIN, msg.sender), "You are not Promoter Admin!");
        grantRole(PROMOTER,_addressPromoter);
        Promoter memory promoter;
        promoter.promoterAddress = _addressPromoter;
        promoters.push(promoter); 
    }
   
    function addAuthority(address _addressAuthority) public {
        require(hasRole(AUTHORITYADMIN, msg.sender), "You are not Authority Admin!");
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
        require(protocols[_protocolID].validated = true,"This protocol has not been validated!");
        investigators.push(Investigator(_protocolID,_investigatorAddress));
        grantRole(INVESTIGATOR,_investigatorAddress);
        projects.push(
            Project(_protocolID, _promoterID, investigators.length-1)
        );
        uint256 projectID = projects.length - 1;
        protocolIDToProjectID[_protocolID]=projectID;

        emit projectCreation(projectID);
    }

    function validateProtocol(uint256 _protocolID,uint _authorityID) public {
        require(hasRole(AUTHORITY, msg.sender), "You are not authority!");
        protocols[_protocolID].validated = true;
        validatedProtocolByAuthority[_protocolID] = authorities[_authorityID].authorityAddress;
        authorities[_authorityID].protocolsIDs.push(_protocolID); //may be removed ...???
        emit protocolValidation(_protocolID);
    }
    
    function updateProtocol(uint _protocolID,string memory _newDescriptionCID,string memory _newTreatmentsListCID) public {
        require(promoters[protocols[_protocolID].promoterID].promoterAddress == msg.sender,"You are not allowed to update the protocol!");
        protocols[_protocolID].descriptionCID = _newDescriptionCID;
        protocols[_protocolID].treatmentsListCID = _newTreatmentsListCID;
        protocols[_protocolID].validated = false;
        for (uint i=0; i<projectIDToPatientsIDs[protocolIDToProjectID[_protocolID]].length; i++) {
        patients[projectIDToPatientsIDs[protocolIDToProjectID[_protocolID]][i]].consent = false;
        }
        emit protocolUpdated(_protocolID);
    }
    

    function addPatient(
        address _patientAddress,
        uint256 _investigatorID,
        uint256 _projectID,
        string memory _dataCID,
        string memory _nameCID
    ) public {
        require(hasRole(INVESTIGATOR, msg.sender), "You are not investigator!");
        //@notice prevents adding patients for the study if protocol has an alert on
        require(protocols[projects[_projectID].protocolID].alertOn==false,"This protocol has an alert!");
        
        Patient memory _patient;
        
        _patient.patientAddress = _patientAddress;
        _patient.investigatorID = _investigatorID;
        _patient.projectID = _projectID;
        _patient.nameCID = _nameCID;
        _patient.consent = true;
       
        patients.push(_patient);
        
        patients[patients.length -1].dataCID.push(_dataCID);
        
        projectIDToPatientsIDs[_projectID].push(patients.length -1);
        
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
        require(patients[_patientID].consent = true,"The patient's consent to the protocol is not given");
        //@notice stops collecting data on patients if protocol has an alert on
        require(protocols[patients[_patientID].projectID].alertOn==false);
        //@dev to keep historic of dataCID in the blockchain
        patients[_patientID].dataCID.push(_newDataCID);
    }

    function getPatientDataCID(uint256 _patientID) view public returns (string[] memory) {
        return patients[_patientID].dataCID;
    }

    function setAlertOn(uint _patientID,uint _protocolID) public {
        require(
            investigators[patients[_patientID].investigatorID]
                .investigaterAddress == msg.sender,
            "You are not authorized to access this patient's data!"
        );
        protocols[_protocolID].alertOn = true;
        emit alert(_patientID,_protocolID);
    }
    
    function agreeOnResume(uint _protocolID) public {
        require (msg.sender == promoters[protocols[_protocolID].promoterID].promoterAddress || msg.sender==validatedProtocolByAuthority[_protocolID]);
        require (agreedOnResume[msg.sender] == false);
        agreedOnResume[msg.sender] = true;
    }
    
    
    function resumeAfterAlert(uint _protocolID) public {
        require (agreedOnResume[promoters[protocols[_protocolID].promoterID].promoterAddress] == true && agreedOnResume[validatedProtocolByAuthority[_protocolID]] == true);
        protocols[_protocolID].alertOn = false;
        agreedOnResume[promoters[protocols[_protocolID].promoterID].promoterAddress] = false;
        agreedOnResume[validatedProtocolByAuthority[_protocolID]] = false;
        
    }

}

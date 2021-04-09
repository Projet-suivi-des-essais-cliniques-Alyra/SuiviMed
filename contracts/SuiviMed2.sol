// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMed2 is AccessControl {
    
    // @dev 
    bytes32 public constant AUTHORITY = keccak256("AUTHORITY");
    bytes32 public constant AUTHORITYADMIN = keccak256("AUTHORITYADMIN");
    bytes32 public constant PROMOTER = keccak256("PROMOTER");
    bytes32 public constant PROMOTERADMIN = keccak256("PROMOTERADMIN");
    bytes32 public constant INVESTIGATOR = keccak256("INVESTIGATOR");
    
    struct Patient {
        address patientAddress;
        address investigatorAddress;
        uint256 projectID;
        string[] dataCID;
        string nameCID;
        bool consent;
    }

    struct Protocol {
        bool validated;
        bool alertOn;
        uint256 date;
        address promoterAddress;
        string descriptionCID;
        string treatmentsListCID;
    }

    struct Project {
        uint256 protocolID;
        address promoterAddress;
        address[] investigatorsAddresses;
    }
    
    // @dev To keep track which authority has validated protocols 
    mapping(uint=>address) protocolValidatedByAuthority;
    // @dev to keep track which patients were added to a project
    mapping(uint=>uint[]) projectIDToPatientsIDs;
    // @dev to keep track which projects are associated with a protocol (for now only one)
    mapping(uint=>uint) protocolIDToProjectID;
    // @dev for multisig agreement on resuming clinical trials
    mapping(address=>bool) agreedOnResume;
    
    // @notice ces tableaux enregistrent les infos des projets ainsi que leurs participants sur la blockchain
    Protocol[] public protocols;
    Project[] public projects;
    Patient[] public patients;
    
    // @notice The events are broadcasting alerts and infos, 
    // @notice and allow tracking smart contract interactions
    event promoterAdded(address _addressPromoter);
    event authorityAdded(address _addressAuthority);
    event protocolCreation(address _promoterAddress,uint _protocolID);
    event projectCreation(uint256 _projectID,uint _protocolID);
    event investigatorAdded(address _investigatorAddress);
    event protocolValidation(uint256 _protocolID, address _authorityAddress);
    event patientAdded(uint _patientID,uint _projectID);
    event consentRevoked(uint _patientID);
    event newConsent(uint _patientID);
    event dataCollected(uint _patientID);
    event alert(uint _patientID,uint _projectID);
    event agreedOnResumeEvent(uint _protocolID,address _personAgreeing);
    event resumedAfterAlert(uint _protocolID);
    event protocolUpdated(uint _protocolID);

    // @dev the constructor creates the admins of promoters and authorities
    // @dev using addresses provided to the root of the client promoter and of an authority 
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

    function addPromoter(address _addressPromoter) public {
        require(hasRole(PROMOTERADMIN, msg.sender),"You are not Promoter Admin!");
        grantRole(PROMOTER,_addressPromoter);
        emit promoterAdded(_addressPromoter);
    }
   
    function addAuthority(address _addressAuthority) public {
        require(hasRole(AUTHORITYADMIN, msg.sender), "You are not Authority Admin!");
        grantRole(AUTHORITY,_addressAuthority);
        emit authorityAdded(_addressAuthority);
    }
    
    function addInvestigator(address _addressInvestigator,uint _projectID) public {
        require(hasRole(PROMOTER, msg.sender),"You are not Promoter!");
        grantRole(INVESTIGATOR,_addressInvestigator);
        emit investigatorAdded(_addressInvestigator);
        projects[_projectID].investigatorsAddresses.push(_addressInvestigator);
    }
    
    // @notice promoters can create new protocols with this function
    function createProtocol(
        string memory _descriptionCID,
        string memory _treatmentsListCID
    ) public {
        require(hasRole(PROMOTER, msg.sender),"You are not Promoter!");
        protocols.push(
            Protocol(false,false, block.timestamp,msg.sender,_descriptionCID, _treatmentsListCID)
        );
        uint _protocolID=protocols.length-1;
        emit protocolCreation(msg.sender,_protocolID);
    }
    
    
    function createProject(
        uint256 _protocolID,
        address _investigatorAddress
    ) public {
        require(hasRole(PROMOTER, msg.sender),"You are not Promoter!");
        require(protocols[_protocolID].validated = true,"This protocol has not been validated!");
        grantRole(INVESTIGATOR,_investigatorAddress);
        emit investigatorAdded(_investigatorAddress);
        Project memory project;
        project.promoterAddress=msg.sender;
        project.protocolID=_protocolID;
        projects.push(project);
        uint _projectID = projects.length - 1;
        projects[_projectID].investigatorsAddresses.push(_investigatorAddress);
        protocolIDToProjectID[_protocolID]=_projectID;
        emit projectCreation(_projectID,_protocolID);
    }

    function validateProtocol(uint256 _protocolID) public {
        // @dev require that the authority validating has been registered as authority and is the one specified
        require(hasRole(AUTHORITY, msg.sender), "You are not Authority!");
        protocols[_protocolID].validated = true;
        protocolValidatedByAuthority[_protocolID] = msg.sender;
        emit protocolValidation(_protocolID,msg.sender);
    }
    
    function updateProtocol(uint _protocolID,string memory _newDescriptionCID,string memory _newTreatmentsListCID) public {
        require(protocols[_protocolID].promoterAddress == msg.sender,"You are not allowed to update the protocol!");
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
        uint256 _projectID,
        string memory _dataCID,
        string memory _nameCID
    ) public {
        require(hasRole(INVESTIGATOR, msg.sender), "You are not Investigator!");
        require(protocols[projects[_projectID].protocolID].alertOn==false,"This protocol has an alert!");
        Patient memory _patient;
        _patient.patientAddress = _patientAddress;
        _patient.investigatorAddress = msg.sender;
        _patient.projectID = _projectID;
        _patient.nameCID = _nameCID;
        _patient.consent = true;
        patients.push(_patient);
        uint _patientID= patients.length -1;
        patients[_patientID].dataCID.push(_dataCID);
        projectIDToPatientsIDs[_projectID].push(_patientID);
        emit patientAdded(_patientID,_projectID);
    }
    
    function consent(uint256 _patientID) public {
        require(
            patients[_patientID].patientAddress == msg.sender,
            "you are not authorized to do that!"
        );
        patients[_patientID].consent = true;
        emit newConsent(_patientID);
    }

    function revokeConsent(uint256 _patientID) public {
        require(
            patients[_patientID].patientAddress == msg.sender,
            "you are not authorized to do that!"
        );
        patients[_patientID].consent = false;
        emit consentRevoked(_patientID);
    }

    function collectData(uint256 _patientID,string memory _newDataCID) public {
        require(
            patients[_patientID].investigatorAddress == msg.sender,
            "You are not authorized to access this patient's data!"
        );
        require(patients[_patientID].consent = true,"No patient's consent!");
        //@notice stops collecting data on patients if protocol has an alert on
        require(protocols[patients[_patientID].projectID].alertOn==false,"Alert on this protocol!");
        //@dev to keep historic of dataCID in the blockchain
        patients[_patientID].dataCID.push(_newDataCID);
        emit dataCollected(_patientID);
    }

    function getPatientDataCID(uint256 _patientID) view public returns (string[] memory) {
        return patients[_patientID].dataCID;
    }

    function setAlertOn(uint _patientID,uint _protocolID) public {
        require(
            patients[_patientID].investigatorAddress == msg.sender,
            "You are not authorized to access this patient's data!"
        );
        protocols[_protocolID].alertOn = true;
        emit alert(_patientID,_protocolID);
    }
    
    // @notice this function collects agreement of promoters and authorities to resume clinical trials
    function agreeOnResume(uint _protocolID) public {
        require (msg.sender == protocols[_protocolID].promoterAddress || msg.sender==protocolValidatedByAuthority[_protocolID]);
        require (agreedOnResume[msg.sender] == false);
        agreedOnResume[msg.sender] = true;
        emit agreedOnResumeEvent(_protocolID,msg.sender);
    }
    
    // @notice this function allows resuming clinical trials with agreement of promoters and authorities
    function resumeAfterAlert(uint _protocolID) public {
        require (agreedOnResume[protocols[_protocolID].promoterAddress] == true && agreedOnResume[protocolValidatedByAuthority[_protocolID]] == true);
        protocols[_protocolID].alertOn = false;
        agreedOnResume[protocols[_protocolID].promoterAddress] = false;
        agreedOnResume[protocolValidatedByAuthority[_protocolID]] = false;
        emit resumedAfterAlert(_protocolID);
    }

}
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMed is AccessControl{

    //addresses that can interact with SuiviMed
    mapping(address => admin) public whitelist;

    //
    struct Admin{
        bytes32 role; //role = promoteur, autorite, investigateur
        bytes32 protocole;
    }

    struct Patient{
        address addr;
        bool consent;
        bytes32 dataIPFS;
    }

    //definition de l'administrateurs
    constructor () {
        whitelist[msg.sender] = true;        
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

}

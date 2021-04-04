// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuiviMedControlCenter is AccessControl{
  
    //addresses that can interact with SuiviMedControlCenter (promoters,authorities...)
    address[] promotersWhitelist;
    address[] authoritiesWhitelist;

    testCenters[] public deployedtestCenters;
    
    protocols[]  public protocolsArray;

    struct Protocol {
        bytes32 descriptionOnIPFS;
        uint date;
    }
    //
    struct Admin{
        bytes32 role; //role = promoter, autorithy, investigator
        uint[] testCentersIds;
        uint[] protocolsIds;
    }


    //whitelist contains the list of patients and investigators
    function createTestCenter(Protocol _protocol,address[] memory _authorities,
    address[] memory _promoters)
        public
        payable
    {
        require(msg.value > 0, "Low price!");
        require(signedByPromoters(_promoters,_protocol), "not signed by promoters!");
        require(signedByAuthorities(_authorities,_protocol),"not signed by authorities!");

        TestCenter testCenter = new testCenter(
            msg.sender,
            _protocol,
            msg.value
        );

        deployedtestCenters.push(testCenter);

        //transfer money to testCenter
        address payable receiver = payable(address(testCenter));
        receiver.transfer(msg.value);
    }

    function signedByPromoters(){
    }

    function signedByAuthorities(){
    }

    function Protocol () {
    }
    
    function getDeployedTestCenters() public view returns (testCenter[] memory) {
        return deployedTestCenters;
    }

    function resumeAfterAlert(){
    }

    function addWhitelistedPromoters(){
    }

    function removeWhitelistedPromoters(){
    }

    function addWhitelistedAuthorities(){
    }

    function removeWhitelistedAuthorities(){
    }

}
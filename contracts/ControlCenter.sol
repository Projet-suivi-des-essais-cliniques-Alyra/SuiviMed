// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./TestCenter.sol";

contract ControlCenter is AccessControl {
    TestCenter[] deployedtestCenters;

    struct Protocol {
        string protocolA_CID;
        string protocolB_CID;
        uint256 date;
    }

    Protocol public protocol =
        Protocol(
            "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdF",
            block.timestamp
        );

    address[2] public authorities = [
        0xe5AF13a5E443287f8c8190A6C168983abDbe9E96,
        0x7625d6c5Af7B0a164514643f03e82347D2A121E3
    ];
    address[2] public promoters = [
        0x3635fc0ED49288237dd0bebA412e12A91Ac52471,
        0x194454F5CcD670C9a3f32ab0d065b0E475F9Ef57
    ];

    //whitelist contains the list of patients and investigators
    function createTestCenter(
        Protocol memory _protocol,
        address[] memory _authorities,
        address[] memory _promoters
    ) public payable {
        // require(msg.value > 0, "Low price!");
        // require(signedByPromoters(_promoters,_protocol), "not signed by promoters!");
        // require(signedByAuthorities(_authorities,_protocol),"not signed by authorities!");
        // require(isPromoter(msg.sender));
        // registerPromoters();
        // registerAuthorities();

        TestCenter testCenter =
            new TestCenter(msg.sender, _protocol, msg.value);

        deployedtestCenters.push(testCenter);

        //transfer money to testCenter
        // address payable receiver = payable(address(testCenter));
        // receiver.transfer(msg.value);
    }

    // function registerPromoters(address[] memory _promoters) {}
}

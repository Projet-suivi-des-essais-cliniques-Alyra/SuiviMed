// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
// import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ControlCenter.sol";

contract TestCenter {
    enum Status {DEPLOYED, SUSPENDED, CLOSED}
    Status status;

    struct Investigator {
        bytes32 role;
        Patient[] patients;
    }

    struct Patient {
        bytes32 role;
        address addr;
        bool consent;
        bytes32 dataIPFS;
    }

    address promoterOwner;
    uint256 price;
    ControlCenter.Protocol protocol;

    //creation of the testCenter
    constructor(
        address _promoter,
        ControlCenter.Protocol memory _protocol,
        uint256 _price
    ) {
        promoterOwner = _promoter;
        //createdAt = now;
        protocol = _protocol;
        price = _price;
        status = Status.DEPLOYED;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Groth16Verifier} from "./verifier.sol";

//access 2
contract Access {
    address public verifier;

    mapping(address allowedUser => uint hashUser) public allowedUsers;
    mapping(uint nullifier => bool used) public usedNullifiers;

    constructor(address _verifier) {
        verifier = _verifier;
    }

    function addUser(address newUser, uint hashTarget) public {
        allowedUsers[newUser] = hashTarget;
    }

    function removeNullifier(uint _nullifier) public {
        usedNullifiers[_nullifier] = false;
    }

    function testAccess(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[3] calldata _pubSignals
    ) public {
        uint userAddressSent = _pubSignals[1];
        uint hashTarget = allowedUsers[address(uint160(userAddressSent))];

        uint[3] memory publicSignals = [
            _pubSignals[0],
            userAddressSent,
            hashTarget
        ];

        bool isProoved = Groth16Verifier(verifier).verifyProof(
            _pA,
            _pB,
            _pC,
            publicSignals
        );
        require(isProoved, "skProof failed");

        require(!usedNullifiers[_pubSignals[0]], "nullfier allready used");

        usedNullifiers[_pubSignals[0]] = true;
    }
}

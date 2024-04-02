// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A simple domain registry contract
 * @notice This contract enables Ethereum addresses to register top-level domains.
 * @dev Implements domain registration with an updatable fixed fee. Ownership is managed by OpenZeppelin's Ownable.
 */
contract DomainRegistry is Ownable {
    // @notice Registration fee for a domain
    uint256 public registrationFee;

    // @notice Maps domain names to their Ethereum address owner
    mapping(string => address) private domainToOwner;

    // @notice Emitted when a domain is registered
    event DomainRegistered(string domain, address indexed owner, uint256 timestamp);

    // @notice Emitted when the registration fee is updated
    event RegistrationFeeUpdated(uint256 newFee);

    /**
     * @notice Create a new DomainRegistry with a specified fee for registration
     * @param _registrationFee The initial registration fee
     */
    constructor(uint256 _registrationFee) {
        registrationFee = _registrationFee;
    }

    /**
     * @notice Register a domain if it's not already taken and the fee is paid.
     * @dev The domain must be a valid TLD (top-level domain) and not previously registered.
     * @param domain The domain to be registered
     */
    function registerDomain(string memory domain) public payable {
        require(msg.value >= registrationFee, "Insufficient funds for registration.");
        require(validateDomain(domain), "Invalid domain format.");
        require(domainToOwner[domain] == address(0), "Domain is already registered.");

        domainToOwner[domain] = msg.sender;

        emit DomainRegistered(domain, msg.sender, block.timestamp);
    }

    /**
     * @dev Validates a domain to ensure it conforms to TLD criteria.
     * @param domain The domain to validate
     * @return isValid True if the domain is a valid TLD
     */
    function validateDomain(string memory domain) internal pure returns (bool isValid) {
        for (uint i = 0; i < bytes(domain).length; i++) {
            if (bytes(domain)[i] == '.') {
                return false;
            }
        }
        return true;
    }

    /**
     * @notice Updates the domain registration fee.
     * @param _newFee The new registration fee
     */
    function updateRegistrationFee(uint256 _newFee) public onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    /**
     * @notice Retrieves the owner of a specific domain.
     * @param domain The domain to query the owner
     * @return owner The address of the domain owner
     */
    function getOwnerOfDomain(string memory domain) public view returns (address) {
        return domainToOwner[domain];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A simple domain registry contract
/// @notice This contract allows for the registration of top-level domains associated with Ethereum addresses.
/// @dev This contract implements domain registration with a fixed fee that can be updated by the contract owner.
contract DomainRegistry is Ownable {
    /// @notice Registration fee for each domain
    uint256 public registrationFee;

    /// @notice Maps domain names to their respective Ethereum address owner
    mapping(string => address) private domainToOwner;

    /// @notice Maps an Ethereum address to their list of domains
    mapping(address => string[]) private domainsByOwner;

    /// @notice Emitted when a domain is registered
    event DomainRegistered(string domain, address indexed owner, uint256 timestamp);

    /// @notice Emitted when the registration fee is updated
    event RegistrationFeeUpdated(uint256 newFee);

    /// @param _registrationFee The initial registration fee for domain registration
    constructor(uint256 _registrationFee) {
        registrationFee = _registrationFee;
    }

    /// @notice Registers a domain
    /// @dev Registers a domain to the sender's address if the domain is not already registered, the fee is paid, and the domain is valid.
    /// @param domain The domain to be registered
    function registerDomain(string memory domain) public payable {
        require(msg.value >= registrationFee, "Insufficient funds for registration.");
        require(validateDomain(domain), "Invalid domain format.");
        require(domainToOwner[domain] == address(0), "Domain is already registered.");

        domainToOwner[domain] = msg.sender;
        domainsByOwner[msg.sender].push(domain);

        emit DomainRegistered(domain, msg.sender, block.timestamp);
    }

    /// @notice Validates the domain format as a TLD
    /// @param domain The domain to validate
    /// @return isValid True if the domain is a valid TLD
    function validateDomain(string memory domain) internal pure returns (bool isValid) {
        for (uint i = 0; i < bytes(domain).length; i++) {
            if (bytes(domain)[i] == '.') {
                return false;
            }
        }
        return true;
    }

    /// @notice Allows the owner to update the registration fee
    /// @param _newFee The new fee for registering a domain
    function updateRegistrationFee(uint256 _newFee) public onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    /// @notice Retrieves the list of domains owned by a specific address
    /// @param _owner The address to query the domains of
    /// @return domains The list of domains owned by the address
    function getDomainsByOwner(address _owner) public view returns (string[] memory) {
        return domainsByOwner[_owner];
    }
}

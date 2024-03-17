// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A simple domain registry contract
/// @notice This contract allows for the registration of top-level domains associated with Ethereum addresses.
/// @dev This contract implements domain registration with a fixed fee that can be updated by the owner.
contract DomainRegistry {
    /// @notice Owner of the contract
    address public owner;

    /// @notice Registration fee for each domain
    uint256 public registrationFee;

    /// @notice Maps domain names to their respective Ethereum address owner
    mapping(string => address) public domainToOwner;

    /// @notice Maps an Ethereum address to their list of domains
    mapping(address => string[]) public domainsByOwner;

    /// @notice Emitted when a domain is registered
    /// @param domain The registered domain
    /// @param owner The Ethereum address of the domain owner
    /// @param timestamp The block timestamp when the domain was registered
    event DomainRegistered(string domain, address indexed owner, uint256 timestamp);

    /// @notice Emitted when the registration fee is updated
    /// @param newFee The new registration fee
    event RegistrationFeeUpdated(uint256 newFee);

    /// @notice Creates a domain registry contract with a specified registration fee
    /// @param _registrationFee The initial registration fee for domain registration
    constructor(uint256 _registrationFee) {
        owner = msg.sender;
        registrationFee = _registrationFee;
    }

    /// @notice Ensures only the owner can perform certain actions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    /// @notice Registers a domain
    /// @dev Registers a domain to the sender's address if the domain is not already registered and the fee is paid
    /// @param domain The domain to be registered
    function registerDomain(string memory domain) public payable {
        require(msg.value >= registrationFee, "Insufficient funds for registration.");
        require(domainToOwner[domain] == address(0), "Domain is already registered.");

        domainToOwner[domain] = msg.sender;
        domainsByOwner[msg.sender].push(domain);

        emit DomainRegistered(domain, msg.sender, block.timestamp);
    }

    /// @notice Allows the owner to update the registration fee
    /// @param _newFee The new fee for registering a domain
    function updateRegistrationFee(uint256 _newFee) public onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    /// @notice Retrieves the list of domains owned by a specific address
    /// @param _owner The address to query the domains of
    /// @return The list of domains owned by the address
    function getDomainsByOwner(address _owner) public view returns (string[] memory) {
        return domainsByOwner[_owner];
    }

    /// @notice Withdraws the balance to the owner's address
    /// @dev Only the owner can call this function
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

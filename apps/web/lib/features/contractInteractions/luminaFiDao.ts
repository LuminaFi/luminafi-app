import { ethers } from 'ethers';

/**
 * Enum types for LuminaFiDAO
 */
export enum ProposalType {
    UpdateMinVotes = 0,
    UpdateInsuranceBps = 1,
    GrantRole = 2,
    RevokeRole = 3,
    Other = 4
}

export enum ProposalStatus {
    Active = 0,
    Executed = 1,
    Rejected = 2,
    Expired = 3
}

/**
 * Interface for proposal data
 */
export interface Proposal {
    id: number;
    proposer: string;
    description: string;
    callData: string;
    targetContract: string;
    votesFor: number;
    votesAgainst: number;
    startTime: number;
    endTime: number;
    proposalType: ProposalType;
    status: ProposalStatus;
}

/**
 * Interface for governance parameters
 */
export interface GovernanceParams {
    votingPeriod: number;
    quorum: number;
    majority: number;
}

/**
 * LuminaFiDAO Client
 * A TypeScript client for interacting with the LuminaFiDAO smart contract
 */
export class LuminaFiDAOClient {
    private contract: ethers.Contract;
    private signer: ethers.Signer | null;

    // Role constants
    public readonly ADMIN_ROLE: string;
    public readonly MEMBER_ROLE: string;

    /**
     * Constructor
     * @param contractAddress The address of the LuminaFiDAO contract
     * @param contractABI The ABI of the LuminaFiDAO contract
     * @param providerOrSigner The ethers.js provider or signer
     */
    constructor(
        contractAddress: string,
        contractABI: any,
        providerOrSigner: ethers.providers.Provider | ethers.Signer
    ) {
        if (ethers.Signer.isSigner(providerOrSigner)) {
            this.signer = providerOrSigner;
            this.contract = new ethers.Contract(
                contractAddress,
                contractABI,
                this.signer
            );
        } else {
            this.contract = new ethers.Contract(
                contractAddress,
                contractABI,
                providerOrSigner
            );
            this.signer = null;
        }

        // Initialize role constants
        this.ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
        this.MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));
    }

    /**
     * Connect a signer to the client to perform write operations
     * @param signer An ethers.js signer
     * @returns The connected client
     */
    connect(signer: ethers.Signer): LuminaFiDAOClient {
        this.signer = signer;
        this.contract = this.contract.connect(signer);
        return this;
    }

    /**
     * Check if the client has a signer connected
     * @throws Error if no signer is connected
     */
    private checkSigner(): void {
        if (!this.signer) {
            throw new Error("No signer connected. Use connect() method to attach a signer.");
        }
    }

    /**
     * Check if the connected account has admin role
     * @returns True if the connected account has admin role
     */
    async isAdmin(): Promise<boolean> {
        if (!this.signer) return false;

        try {
            const address = await this.signer.getAddress();
            return await this.hasRole(this.ADMIN_ROLE, address);
        } catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    }

    /**
     * Check if the connected account has member role
     * @returns True if the connected account has member role
     */
    async isMember(): Promise<boolean> {
        if (!this.signer) return false;

        try {
            const address = await this.signer.getAddress();
            return await this.hasRole(this.MEMBER_ROLE, address);
        } catch (error) {
            console.error("Error checking member status:", error);
            return false;
        }
    }

    /**
     * Check if an address has a specific role
     * @param role Role to check
     * @param address Address to check
     * @returns True if the address has the role
     */
    async hasRole(role: string, address: string): Promise<boolean> {
        try {
            return await this.contract.hasRole(role, address);
        } catch (error) {
            console.error(`Error checking if ${address} has role ${role}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // GOVERNANCE METHODS
    // =========================================================================

    /**
     * Create a new proposal
     * @param description Description of the proposal
     * @param callData Encoded call data for the proposal
     * @param targetContract Address of the contract to be called if proposal passes
     * @param proposalType Type of the proposal
     * @returns Transaction receipt and proposal ID
     */
    async createProposal(
        description: string,
        callData: string,
        targetContract: string,
        proposalType: ProposalType
    ): Promise<{ receipt: ethers.ContractReceipt; proposalId: number | null }> {
        this.checkSigner();

        try {
            const tx = await this.contract.createProposal(
                description,
                callData,
                targetContract,
                proposalType
            );

            const receipt = await tx.wait();

            // Find the ProposalCreated event to get the proposal ID
            let proposalId = null;
            for (const event of receipt.events || []) {
                if (event.event === "ProposalCreated" && event.args) {
                    proposalId = event.args.proposalId.toNumber();
                    break;
                }
            }

            return { receipt, proposalId };
        } catch (error) {
            console.error("Error creating proposal:", error);
            throw error;
        }
    }

    /**
     * Vote on a proposal
     * @param proposalId ID of the proposal to vote on
     * @param support True to vote in favor, false to vote against
     * @returns Transaction receipt
     */
    async vote(
        proposalId: number,
        support: boolean
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.vote(proposalId, support);
            return await tx.wait();
        } catch (error) {
            console.error(`Error voting on proposal ${proposalId}:`, error);
            throw error;
        }
    }

    /**
     * Execute a proposal that has passed voting
     * @param proposalId ID of the proposal to execute
     * @returns Transaction receipt
     */
    async executeProposal(
        proposalId: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.executeProposal(proposalId);
            return await tx.wait();
        } catch (error) {
            console.error(`Error executing proposal ${proposalId}:`, error);
            throw error;
        }
    }

    /**
     * Add a member to the DAO (admin only)
     * @param newMember Address of the new member
     * @returns Transaction receipt
     */
    async addMember(
        newMember: string
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.addMember(newMember);
            return await tx.wait();
        } catch (error) {
            console.error(`Error adding member ${newMember}:`, error);
            throw error;
        }
    }

    /**
     * Remove a member from the DAO (admin only)
     * @param member Address of the member to remove
     * @returns Transaction receipt
     */
    async removeMember(
        member: string
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.removeMember(member);
            return await tx.wait();
        } catch (error) {
            console.error(`Error removing member ${member}:`, error);
            throw error;
        }
    }

    /**
     * Set the voting period (admin only)
     * @param newPeriod New voting period in seconds
     * @returns Transaction receipt
     */
    async setVotingPeriod(
        newPeriod: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.setVotingPeriod(newPeriod);
            return await tx.wait();
        } catch (error) {
            console.error(`Error setting voting period to ${newPeriod}:`, error);
            throw error;
        }
    }

    /**
     * Set the quorum (admin only)
     * @param newQuorum New quorum value
     * @returns Transaction receipt
     */
    async setQuorum(
        newQuorum: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.setQuorum(newQuorum);
            return await tx.wait();
        } catch (error) {
            console.error(`Error setting quorum to ${newQuorum}:`, error);
            throw error;
        }
    }

    /**
     * Set the majority (admin only)
     * @param newMajority New majority percentage (51-100)
     * @returns Transaction receipt
     */
    async setMajority(
        newMajority: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.setMajority(newMajority);
            return await tx.wait();
        } catch (error) {
            console.error(`Error setting majority to ${newMajority}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // GOVERNANCE VIEW METHODS
    // =========================================================================

    /**
     * Get proposal details
     * @param proposalId ID of the proposal
     * @returns Proposal information
     */
    async getProposal(proposalId: number): Promise<Proposal> {
        try {
            const proposal = await this.contract.proposals(proposalId);

            return {
                id: proposal.id.toNumber(),
                proposer: proposal.proposer,
                description: proposal.description,
                callData: proposal.callData,
                targetContract: proposal.targetContract,
                votesFor: proposal.votesFor.toNumber(),
                votesAgainst: proposal.votesAgainst.toNumber(),
                startTime: proposal.startTime.toNumber(),
                endTime: proposal.endTime.toNumber(),
                proposalType: proposal.proposalType,
                status: proposal.status
            };
        } catch (error) {
            console.error(`Error getting proposal ${proposalId}:`, error);
            throw error;
        }
    }

    /**
     * Get governance parameters
     * @returns Governance parameters
     */
    async getGovernanceParams(): Promise<GovernanceParams> {
        try {
            const [votingPeriod, quorum, majority] = await Promise.all([
                this.contract.votingPeriod(),
                this.contract.quorum(),
                this.contract.majority()
            ]);

            return {
                votingPeriod: votingPeriod.toNumber(),
                quorum: quorum.toNumber(),
                majority: majority.toNumber()
            };
        } catch (error) {
            console.error("Error getting governance parameters:", error);
            throw error;
        }
    }

    /**
     * Get the LuminaFi contract address
     * @returns LuminaFi contract address
     */
    async getLuminaFiAddress(): Promise<string> {
        try {
            return await this.contract.luminaFi();
        } catch (error) {
            console.error("Error getting LuminaFi address:", error);
            throw error;
        }
    }

    /**
     * Check if a user has voted on a proposal
     * @param proposalId ID of the proposal
     * @param userAddress Address of the user
     * @returns True if the user has voted
     */
    async hasVoted(proposalId: number, userAddress: string): Promise<boolean> {
        try {
            // Note: This function is not available in the contract directly
            // We would need to add a view function in the contract for this
            // This is a placeholder for demonstration purposes
            throw new Error("Function not implemented in contract");
        } catch (error) {
            console.error(`Error checking if ${userAddress} has voted on proposal ${proposalId}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // CALLDATA CREATION HELPERS
    // =========================================================================

    /**
     * Create calldata for updating minimum votes
     * @param newMinVotes New minimum votes
     * @returns Encoded calldata
     */
    createCallDataForUpdateMinVotes(newMinVotes: number): string {
        try {
            const functionSignature = "setMinVotesRequired(uint256)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParam = ethers.utils.defaultAbiCoder.encode(["uint256"], [newMinVotes]);
            return functionSelector + encodedParam.substring(2); // Remove 0x prefix from param
        } catch (error) {
            console.error(`Error creating calldata for updateMinVotes with value ${newMinVotes}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for updating insurance BPS
     * @param newBps New insurance BPS
     * @returns Encoded calldata
     */
    createCallDataForUpdateInsuranceBps(newBps: number): string {
        try {
            const functionSignature = "setInsurancePoolBps(uint256)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParam = ethers.utils.defaultAbiCoder.encode(["uint256"], [newBps]);
            return functionSelector + encodedParam.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for updateInsuranceBps with value ${newBps}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for granting a role
     * @param role Role to grant
     * @param account Account to grant the role to
     * @returns Encoded calldata
     */
    createCallDataForGrantRole(role: string, account: string): string {
        try {
            const functionSignature = "grantRole(bytes32,address)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParams = ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address"],
                [role, account]
            );
            return functionSelector + encodedParams.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for grantRole to ${account}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for revoking a role
     * @param role Role to revoke
     * @param account Account to revoke the role from
     * @returns Encoded calldata
     */
    createCallDataForRevokeRole(role: string, account: string): string {
        try {
            const functionSignature = "revokeRole(bytes32,address)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParams = ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address"],
                [role, account]
            );
            return functionSelector + encodedParams.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for revokeRole from ${account}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for granting verifier role
     * @param verifier Address to grant verifier role to
     * @returns Encoded calldata
     */
    createCallDataForGrantVerifierRole(verifier: string): string {
        try {
            const functionSignature = "grantVerifierRole(address)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParam = ethers.utils.defaultAbiCoder.encode(["address"], [verifier]);
            return functionSelector + encodedParam.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for grantVerifierRole to ${verifier}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for revoking verifier role
     * @param verifier Address to revoke verifier role from
     * @returns Encoded calldata
     */
    createCallDataForRevokeVerifierRole(verifier: string): string {
        try {
            const functionSignature = "revokeVerifierRole(address)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParam = ethers.utils.defaultAbiCoder.encode(["address"], [verifier]);
            return functionSelector + encodedParam.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for revokeVerifierRole from ${verifier}:`, error);
            throw error;
        }
    }

    /**
     * Create calldata for updating voter weight
     * @param voter Address of the voter
     * @param weight New weight
     * @returns Encoded calldata
     */
    createCallDataForUpdateVoterWeight(voter: string, weight: number): string {
        try {
            const functionSignature = "updateVoterWeight(address,uint256)";
            const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
            const encodedParams = ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256"],
                [voter, weight]
            );
            return functionSelector + encodedParams.substring(2);
        } catch (error) {
            console.error(`Error creating calldata for updateVoterWeight for ${voter}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    /**
     * Listen for ProposalCreated events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onProposalCreated(
        callback: (proposalId: number, proposer: string, description: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.ProposalCreated();
        const listener = (proposalId: ethers.BigNumber, proposer: string, description: string) => {
            callback(proposalId.toNumber(), proposer, description);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for Voted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onVoted(
        callback: (proposalId: number, voter: string, support: boolean) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.Voted();
        const listener = (proposalId: ethers.BigNumber, voter: string, support: boolean) => {
            callback(proposalId.toNumber(), voter, support);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for ProposalExecuted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onProposalExecuted(
        callback: (proposalId: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.ProposalExecuted();
        const listener = (proposalId: ethers.BigNumber) => {
            callback(proposalId.toNumber());
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for ProposalRejected events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onProposalRejected(
        callback: (proposalId: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.ProposalRejected();
        const listener = (proposalId: ethers.BigNumber) => {
            callback(proposalId.toNumber());
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for RoleGranted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onRoleGranted(
        callback: (role: string, account: string, sender: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.RoleGranted();
        const listener = (role: string, account: string, sender: string) => {
            callback(role, account, sender);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for RoleRevoked events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onRoleRevoked(
        callback: (role: string, account: string, sender: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.RoleRevoked();
        const listener = (role: string, account: string, sender: string) => {
            callback(role, account, sender);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Remove an event listener
     * @param eventName Name of the event
     * @param listener Listener to remove
     */
    removeListener(eventName: string, listener: ethers.providers.Listener): void {
        this.contract.removeListener(eventName, listener);
    }

    /**
     * Remove all listeners for a specific event
     * @param eventName Name of the event (optional, if not provided removes all listeners)
     */
    removeAllListeners(eventName?: string): void {
        this.contract.removeAllListeners(eventName);
    }
}

// Factory function to create a new client
export async function createLuminaFiDAOClient(
    contractAddress: string,
    abi: any,
    provider: ethers.providers.Provider | ethers.Signer
): Promise<LuminaFiDAOClient> {
    return new LuminaFiDAOClient(contractAddress, abi, provider);
}
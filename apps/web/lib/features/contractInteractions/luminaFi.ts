import { ethers } from 'ethers';

/**
 * Types for LuminaFi contract interaction
 */
export enum CredentialLevel {
    None = 0,
    Basic = 1,
    Intermediate = 2,
    Advanced = 3,
    Expert = 4
}

export enum LoanStatus {
    Pending = 0,
    Approved = 1,
    Funded = 2,
    Active = 3,
    Completed = 4,
    Defaulted = 5
}

export interface UserProfile {
    userAddress: string;
    reputationScore: number;
    hasActiveLoan: boolean;
    activeLoanId: number;
    registered: boolean;
    credentialCount: number;
}

export interface Credential {
    institution: string;
    program: string;
    documentHash: string;
    level: CredentialLevel;
    verified: boolean;
    verificationTimestamp: number;
}

export interface LoanSummary {
    id: number;
    borrower: string;
    amountStablecoin: ethers.BigNumber;
    termMonths: number;
    profitSharePercentage: number;
    status: LoanStatus;
    votes: number;
    totalInvestors: number;
    paidAmount: ethers.BigNumber;
    nextPaymentDue: number;
}

/**
 * LuminaFi Client
 * A TypeScript client for interacting with the LuminaFi smart contract
 */
export class LuminaFiClient {
    private contract: ethers.Contract;
    private signer: ethers.Signer | null;

    // Token contracts
    private investmentToken: ethers.Contract | null = null;
    private stablecoin: ethers.Contract | null = null;

    // Role constants
    public readonly ADMIN_ROLE: string;
    public readonly VERIFIER_ROLE: string;

    /**
     * Constructor
     * @param contractAddress The address of the LuminaFi contract
     * @param contractABI The ABI of the LuminaFi contract
     * @param provider The ethers.js provider or signer
     * @param erc20ABI Optional ERC20 ABI for token interaction
     */
    constructor(
        contractAddress: string,
        contractABI: any,
        providerOrSigner: ethers.providers.Provider | ethers.Signer,
        private erc20ABI?: any
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
        this.VERIFIER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("VERIFIER_ROLE"));

        // Initialize token contracts if ERC20 ABI provided
        if (this.erc20ABI) {
            this.initializeTokenContracts();
        }
    }

    /**
     * Initialize token contracts
     */
    private async initializeTokenContracts(): Promise<void> {
        try {
            const investmentTokenAddress = await this.contract.investmentToken();
            const stablecoinAddress = await this.contract.stablecoin();

            const provider = this.signer || this.contract.provider;

            this.investmentToken = new ethers.Contract(
                investmentTokenAddress,
                this.erc20ABI,
                provider
            );

            this.stablecoin = new ethers.Contract(
                stablecoinAddress,
                this.erc20ABI,
                provider
            );
        } catch (error) {
            console.error("Failed to initialize token contracts:", error);
        }
    }

    /**
     * Connect a signer to the client to perform write operations
     * @param signer An ethers.js signer
     */
    connect(signer: ethers.Signer): LuminaFiClient {
        this.signer = signer;
        this.contract = this.contract.connect(signer);

        // Reconnect token contracts if they exist
        if (this.investmentToken) {
            this.investmentToken = this.investmentToken.connect(signer);
        }

        if (this.stablecoin) {
            this.stablecoin = this.stablecoin.connect(signer);
        }

        return this;
    }

    /**
     * Check if the client has a signer connected
     */
    private checkSigner(): void {
        if (!this.signer) {
            throw new Error(
                'No signer connected. Use connect() method to attach a signer.'
            );
        }
    }

    /**
     * Check if the connected account has admin role
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
     * Check if the connected account has verifier role
     */
    async isVerifier(): Promise<boolean> {
        if (!this.signer) return false;

        try {
            const address = await this.signer.getAddress();
            return await this.hasRole(this.VERIFIER_ROLE, address);
        } catch (error) {
            console.error("Error checking verifier status:", error);
            return false;
        }
    }

    /**
     * Check if an address has a specific role
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
    // USER REGISTRATION AND CREDENTIAL MANAGEMENT
    // =========================================================================

    /**
     * Register a new user
     * @returns Transaction receipt
     */
    async registerUser(): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.registerUser();
            return await tx.wait();
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }

    /**
     * Add educational credential for a user
     * @param institution Name of the educational institution
     * @param program Name of the educational program
     * @param documentHash IPFS hash of the credential document
     * @returns Transaction receipt
     */
    async addCredential(
        institution: string,
        program: string,
        documentHash: string
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.addCredential(institution, program, documentHash);
            return await tx.wait();
        } catch (error) {
            console.error("Error adding credential:", error);
            throw error;
        }
    }

    /**
     * Verify a user's credential (requires VERIFIER_ROLE)
     * @param user Address of the user
     * @param credentialIndex Index of the credential to verify
     * @param level Level of the credential
     * @returns Transaction receipt
     */
    async verifyCredential(
        user: string,
        credentialIndex: number,
        level: CredentialLevel
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.verifyCredential(user, credentialIndex, level);
            return await tx.wait();
        } catch (error) {
            console.error("Error verifying credential:", error);
            throw error;
        }
    }

    /**
     * Get user profile information
     * @param user Address of the user
     * @returns User profile information
     */
    async getUserProfile(user: string): Promise<UserProfile> {
        try {
            const [
                userAddress,
                reputationScore,
                hasActiveLoan,
                activeLoanId,
                registered,
                credentialCount,
            ] = await this.contract.getUserProfile(user);

            return {
                userAddress,
                reputationScore: reputationScore.toNumber(),
                hasActiveLoan,
                activeLoanId: activeLoanId.toNumber(),
                registered,
                credentialCount: credentialCount.toNumber(),
            };
        } catch (error) {
            console.error(`Error getting user profile for ${user}:`, error);
            throw error;
        }
    }

    /**
     * Get user credential information
     * @param user Address of the user
     * @param index Index of the credential
     * @returns Credential information
     */
    async getUserCredential(
        user: string,
        index: number
    ): Promise<Credential> {
        try {
            const [
                institution,
                program,
                documentHash,
                level,
                verified,
                verificationTimestamp,
            ] = await this.contract.getUserCredential(user, index);

            return {
                institution,
                program,
                documentHash,
                level,
                verified,
                verificationTimestamp: verificationTimestamp.toNumber(),
            };
        } catch (error) {
            console.error(`Error getting credential for ${user} at index ${index}:`, error);
            throw error;
        }
    }

    /**
     * Get all credentials for a user
     * @param user Address of the user
     * @returns Array of credentials
     */
    async getAllUserCredentials(user: string): Promise<Credential[]> {
        try {
            const profile = await this.getUserProfile(user);
            const credentials: Credential[] = [];

            for (let i = 0; i < profile.credentialCount; i++) {
                const credential = await this.getUserCredential(user, i);
                credentials.push(credential);
            }

            return credentials;
        } catch (error) {
            console.error(`Error getting all credentials for ${user}:`, error);
            throw error;
        }
    }

    /**
     * Check if a user has verified credentials
     * @param user Address of the user
     * @returns True if the user has verified credentials
     */
    async hasVerifiedCredentials(user: string): Promise<boolean> {
        try {
            return await this.contract.hasVerifiedCredentials(user);
        } catch (error) {
            console.error(`Error checking verified credentials for ${user}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // LOAN MANAGEMENT
    // =========================================================================

    /**
     * Request a loan
     * @param amountStablecoin Amount of stablecoin requested
     * @param termMonths Loan term in months
     * @param profitSharePercentage Profit share percentage in basis points (e.g., 1000 = 10%)
     * @returns Transaction receipt
     */
    async requestLoan(
        amountStablecoin: ethers.BigNumber | string | number,
        termMonths: number,
        profitSharePercentage: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.requestLoan(
                amountStablecoin,
                termMonths,
                profitSharePercentage
            );

            const receipt = await tx.wait();

            // Find the LoanRequested event to get the loan ID
            let loanId = null;
            for (const event of receipt.events || []) {
                if (event.event === "LoanRequested" && event.args) {
                    loanId = event.args.loanId.toNumber();
                    break;
                }
            }

            // Attach the loan ID to the receipt for convenience
            const augmentedReceipt = receipt as ethers.ContractReceipt & { loanId?: number };
            augmentedReceipt.loanId = loanId;

            return augmentedReceipt;
        } catch (error) {
            console.error("Error requesting loan:", error);
            throw error;
        }
    }

    /**
     * Vote for a loan
     * @param loanId ID of the loan to vote for
     * @returns Transaction receipt
     */
    async voteForLoan(loanId: number): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.voteForLoan(loanId);
            return await tx.wait();
        } catch (error) {
            console.error(`Error voting for loan ${loanId}:`, error);
            throw error;
        }
    }

    /**
     * Invest in a loan
     * @param loanId ID of the loan to invest in
     * @param amountInvestmentToken Amount of investment token to invest
     * @param approveFirst If true, approve the token transfer first
     * @returns Transaction receipt
     */
    async investInLoan(
        loanId: number,
        amountInvestmentToken: ethers.BigNumber | string | number,
        approveFirst: boolean = false
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            // Approve token transfer if requested and investment token is initialized
            if (approveFirst && this.investmentToken) {
                const approveTx = await this.investmentToken.approve(
                    this.contract.address,
                    amountInvestmentToken
                );
                await approveTx.wait();
            }

            const tx = await this.contract.investInLoan(loanId, amountInvestmentToken);
            return await tx.wait();
        } catch (error) {
            console.error(`Error investing in loan ${loanId}:`, error);
            throw error;
        }
    }

    /**
     * Make a loan payment
     * @param loanId ID of the loan to make payment for
     * @param approveFirst If true, approve the stablecoin transfer first
     * @returns Transaction receipt
     */
    async makePayment(
        loanId: number,
        approveFirst: boolean = false
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            // Get loan info to determine payment amount
            const loanSummary = await this.getLoanSummary(loanId);
            const loan = await this.contract.loans(loanId);
            const paymentAmount = loan.monthlyPaymentAmount;

            // Approve stablecoin transfer if requested and stablecoin is initialized
            if (approveFirst && this.stablecoin) {
                const approveTx = await this.stablecoin.approve(
                    this.contract.address,
                    paymentAmount
                );
                await approveTx.wait();
            }

            const tx = await this.contract.makePayment(loanId);
            return await tx.wait();
        } catch (error) {
            console.error(`Error making payment for loan ${loanId}:`, error);
            throw error;
        }
    }

    /**
     * Mark a loan as defaulted (requires ADMIN_ROLE)
     * @param loanId ID of the loan to mark as defaulted
     * @returns Transaction receipt
     */
    async defaultLoan(loanId: number): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.defaultLoan(loanId);
            return await tx.wait();
        } catch (error) {
            console.error(`Error defaulting loan ${loanId}:`, error);
            throw error;
        }
    }

    /**
     * Get loan summary information
     * @param loanId ID of the loan
     * @returns Loan summary information
     */
    async getLoanSummary(loanId: number): Promise<LoanSummary> {
        try {
            const summary = await this.contract.getLoanSummary(loanId);

            return {
                id: summary.id.toNumber(),
                borrower: summary.borrower,
                amountStablecoin: summary.amountStablecoin,
                termMonths: summary.termMonths.toNumber(),
                profitSharePercentage: summary.profitSharePercentage.toNumber(),
                status: summary.status,
                votes: summary.votes.toNumber(),
                totalInvestors: summary.totalInvestors.toNumber(),
                paidAmount: summary.paidAmount,
                nextPaymentDue: summary.nextPaymentDue.toNumber()
            };
        } catch (error) {
            console.error(`Error getting loan summary for loan ${loanId}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * Set the insurance pool basis points (requires ADMIN_ROLE)
     * @param newBps New basis points value (e.g., 200 = 2%)
     * @returns Transaction receipt
     */
    async setInsurancePoolBps(
        newBps: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.setInsurancePoolBps(newBps);
            return await tx.wait();
        } catch (error) {
            console.error(`Error setting insurance pool BPS to ${newBps}:`, error);
            throw error;
        }
    }

    /**
     * Set the minimum votes required for loan approval (requires ADMIN_ROLE)
     * @param newMin New minimum votes value
     * @returns Transaction receipt
     */
    async setMinVotesRequired(
        newMin: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.setMinVotesRequired(newMin);
            return await tx.wait();
        } catch (error) {
            console.error(`Error setting minimum votes to ${newMin}:`, error);
            throw error;
        }
    }

    /**
     * Update voter weight (requires ADMIN_ROLE)
     * @param voter Address of the voter
     * @param weight New weight value
     * @returns Transaction receipt
     */
    async updateVoterWeight(
        voter: string,
        weight: number
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.updateVoterWeight(voter, weight);
            return await tx.wait();
        } catch (error) {
            console.error(`Error updating voter weight for ${voter} to ${weight}:`, error);
            throw error;
        }
    }

    /**
     * Grant verifier role to an address (requires ADMIN_ROLE)
     * @param verifier Address to grant the verifier role to
     * @returns Transaction receipt
     */
    async grantVerifierRole(
        verifier: string
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.grantVerifierRole(verifier);
            return await tx.wait();
        } catch (error) {
            console.error(`Error granting verifier role to ${verifier}:`, error);
            throw error;
        }
    }

    /**
     * Revoke verifier role from an address (requires ADMIN_ROLE)
     * @param verifier Address to revoke the verifier role from
     * @returns Transaction receipt
     */
    async revokeVerifierRole(
        verifier: string
    ): Promise<ethers.ContractReceipt> {
        this.checkSigner();

        try {
            const tx = await this.contract.revokeVerifierRole(verifier);
            return await tx.wait();
        } catch (error) {
            console.error(`Error revoking verifier role from ${verifier}:`, error);
            throw error;
        }
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Get the current insurance pool balance
     * @returns Insurance pool balance
     */
    async getInsurancePoolBalance(): Promise<ethers.BigNumber> {
        try {
            return await this.contract.insurancePoolBalance();
        } catch (error) {
            console.error("Error getting insurance pool balance:", error);
            throw error;
        }
    }

    /**
     * Get the current insurance pool BPS
     * @returns Insurance pool BPS
     */
    async getInsurancePoolBps(): Promise<number> {
        try {
            const bps = await this.contract.insurancePoolBps();
            return bps.toNumber();
        } catch (error) {
            console.error("Error getting insurance pool BPS:", error);
            throw error;
        }
    }

    /**
     * Get the current minimum votes required
     * @returns Minimum votes required
     */
    async getMinVotesRequired(): Promise<number> {
        try {
            const minVotes = await this.contract.minVotesRequired();
            return minVotes.toNumber();
        } catch (error) {
            console.error("Error getting minimum votes required:", error);
            throw error;
        }
    }

    /**
     * Get the current voter weight for an address
     * @param voter Address of the voter
     * @returns Voter weight
     */
    async getVoterWeight(voter: string): Promise<number> {
        try {
            const weight = await this.contract.voterWeight(voter);
            return weight.toNumber();
        } catch (error) {
            console.error(`Error getting voter weight for ${voter}:`, error);
            throw error;
        }
    }

    /**
     * Get the investment token address
     * @returns Investment token address
     */
    async getInvestmentTokenAddress(): Promise<string> {
        try {
            return await this.contract.investmentToken();
        } catch (error) {
            console.error("Error getting investment token address:", error);
            throw error;
        }
    }

    /**
     * Get the stablecoin address
     * @returns Stablecoin address
     */
    async getStablecoinAddress(): Promise<string> {
        try {
            return await this.contract.stablecoin();
        } catch (error) {
            console.error("Error getting stablecoin address:", error);
            throw error;
        }
    }

    /**
     * Convert investment token amount to stablecoin amount
     * @param amountInvestmentToken Amount of investment token
     * @returns Equivalent amount of stablecoin
     */
    async convertInvestmentToStablecoin(
        amountInvestmentToken: ethers.BigNumber | string | number
    ): Promise<ethers.BigNumber> {
        try {
            return await this.contract.convertInvestmentToStablecoin(amountInvestmentToken);
        } catch (error) {
            console.error("Error converting investment to stablecoin:", error);
            throw error;
        }
    }

    /**
     * Convert stablecoin amount to investment token amount
     * @param amountStablecoin Amount of stablecoin
     * @returns Equivalent amount of investment token
     */
    async convertStablecoinToInvestment(
        amountStablecoin: ethers.BigNumber | string | number
    ): Promise<ethers.BigNumber> {
        try {
            return await this.contract.convertStablecoinToInvestment(amountStablecoin);
        } catch (error) {
            console.error("Error converting stablecoin to investment:", error);
            throw error;
        }
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    /**
     * Listen for UserRegistered events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onUserRegistered(
        callback: (user: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.UserRegistered();
        const listener = (user: string) => {
            callback(user);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for CredentialAdded events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onCredentialAdded(
        callback: (user: string, institution: string, program: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.CredentialAdded();
        const listener = (user: string, institution: string, program: string) => {
            callback(user, institution, program);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for CredentialVerified events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onCredentialVerified(
        callback: (user: string, credentialIndex: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.CredentialVerified();
        const listener = (user: string, credentialIndex: ethers.BigNumber) => {
            callback(user, credentialIndex.toNumber());
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanRequested events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanRequested(
        callback: (loanId: number, borrower: string, amount: ethers.BigNumber) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanRequested();
        const listener = (loanId: ethers.BigNumber, borrower: string, amount: ethers.BigNumber) => {
            callback(loanId.toNumber(), borrower, amount);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanVoted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanVoted(
        callback: (loanId: number, voter: string) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanVoted();
        const listener = (loanId: ethers.BigNumber, voter: string) => {
            callback(loanId.toNumber(), voter);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanApproved events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanApproved(
        callback: (loanId: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanApproved();
        const listener = (loanId: ethers.BigNumber) => {
            callback(loanId.toNumber());
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanFunded events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanFunded(
        callback: (loanId: number, amountInvestmentToken: ethers.BigNumber) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanFunded();
        const listener = (loanId: ethers.BigNumber, amountInvestmentToken: ethers.BigNumber) => {
            callback(loanId.toNumber(), amountInvestmentToken);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanPayment events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanPayment(
        callback: (loanId: number, amount: ethers.BigNumber) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanPayment();
        const listener = (loanId: ethers.BigNumber, amount: ethers.BigNumber) => {
            callback(loanId.toNumber(), amount);
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanCompleted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanCompleted(
        callback: (loanId: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanCompleted();
        const listener = (loanId: ethers.BigNumber) => {
            callback(loanId.toNumber());
        };
        this.contract.on(filter, listener);
        return listener;
    }

    /**
     * Listen for LoanDefaulted events
     * @param callback Callback function to handle the event
     * @returns Event listener
     */
    onLoanDefaulted(
        callback: (loanId: number) => void
    ): ethers.providers.Listener {
        const filter = this.contract.filters.LoanDefaulted();
        const listener = (loanId: ethers.BigNumber) => {
            callback(loanId.toNumber());
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
}

// Example usage
export async function createLuminaFiClient(
    contractAddress: string,
    abi: any,
    provider: ethers.providers.Provider,
    erc20ABI?: any
): Promise<LuminaFiClient> {
    return new LuminaFiClient(contractAddress, abi, provider, erc20ABI);
}
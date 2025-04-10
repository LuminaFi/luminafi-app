export enum LoanStatus {
  Pending = 0,
  Approved = 1,
  Funded = 2,
  Active = 3,
  Completed = 4,
  Defaulted = 5,
}

export enum CredentialLevel {
  None = 0,
  Basic = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4,
}

export interface BorrowerProfileView {
  name: string;
  institutionName: string;
  userName: string;
  userAddress: string;
  reputationScore: number;
  hasActiveLoan: boolean;
  activeLoanId: number;
  registered: boolean;
  credentialCount: number;
}

export interface InvestorProfileView {
  name: string;
  institutionName: string;
  userName: string;
  sourceOfIncome: string;
  userAddress: string;
  reputationScore: number;
  registered: boolean;
}

export interface CredentialView {
  institution: string;
  program: string;
  documentHash: string;
  level: CredentialLevel;
  verified: boolean;
  verificationTimestamp: number;
}

export interface LoanSummaryBase {
  id: number;
  borrower: string;
  reason: string;
  proof: string;
  amountStablecoin: string;
  termMonths: number;
}

export interface LoanSummaryDetails {
  profitSharePercentage: number;
  status: LoanStatus;
  votes: number;
  totalVoters: number;
  paidAmount: string;
  nextPaymentDue: number;
}

export interface InvestorInfo {
  contribution: string;
  sharePercentage: number;
  votingWeight: number;
}

export interface InvestmentPoolInfo {
  totalPool: string;
  availableFunds: string;
  allocatedFunds: string;
  insurancePool: string;
  investorCount: number;
}

export const TESTNET_SMART_CONTRACT_ADDRESS =
  '0x1691740FB729B0aE288E4d7Fa6F66d49bF9cd24d';

export const INVESTMENT_TOKEN_ADDRESS =
  '0xC2f2f9004B2F3fF1798AaD36bCC910F5c0A7bC4e';

export const LUMINAFI_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_investmentToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stablecoin',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BORROWER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INVESTOR_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERIFIER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Registration functions
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_institutionName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_userName',
        type: 'string',
      },
    ],
    name: 'registerAsBorrower',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_institutionName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_userName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_sourceOfIncome',
        type: 'string',
      },
    ],
    name: 'registerAsInvestor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Investment pool functions - Updated for pool-based model
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountInvestmentToken',
        type: 'uint256',
      },
    ],
    name: 'investInPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountInvestmentToken',
        type: 'uint256',
      },
    ],
    name: 'withdrawInvestment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Loan functions
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountStablecoin',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_termMonths',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_profitSharePercentage',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_reason',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_proof',
        type: 'string',
      },
    ],
    name: 'requestLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'voteForLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'processFunding',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'defaultLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'distributeProfit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Credential management
  {
    inputs: [
      {
        internalType: 'string',
        name: '_institution',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_program',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_documentHash',
        type: 'string',
      },
    ],
    name: 'addCredential',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_credentialIndex',
        type: 'uint256',
      },
      {
        internalType: 'enum LuminaFi.CredentialLevel',
        name: '_level',
        type: 'uint8',
      },
    ],
    name: 'verifyCredential',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Borrower profile view functions
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getBorrowerProfile',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'institutionName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'userName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'userAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'reputationScore',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'hasActiveLoan',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'activeLoanId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'registered',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'credentialCount',
            type: 'uint256',
          },
        ],
        internalType: 'struct LuminaFi.BorrowerProfileView',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Investor profile view functions
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getInvestorProfile',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'institutionName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'userName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'sourceOfIncome',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'userAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'reputationScore',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'registered',
            type: 'bool',
          },
        ],
        internalType: 'struct LuminaFi.InvestorProfileView',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Credential view function
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'getUserCredential',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'institution',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'program',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'documentHash',
            type: 'string',
          },
          {
            internalType: 'enum LuminaFi.CredentialLevel',
            name: 'level',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'verified',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'verificationTimestamp',
            type: 'uint256',
          },
        ],
        internalType: 'struct LuminaFi.CredentialView',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Loan view functions
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoanBasicInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'proof',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoanFinancialInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountStablecoin',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'termMonths',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profitSharePercentage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'monthlyPaymentAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoanStatusInfo',
    outputs: [
      {
        internalType: 'enum LuminaFi.LoanStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'votes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalVoters',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTimestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoanPaymentInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'paidAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextPaymentDue',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Investment pool info functions - Updated for role-based model
  {
    inputs: [
      {
        internalType: 'address',
        name: '_investor',
        type: 'address',
      },
    ],
    name: 'getInvestorInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'contribution',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'sharePercentage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'votingWeight',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPoolInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalInvestment',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableFunds',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'allocatedFunds',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'insuranceBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'investorCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Helper functions
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'hasVerifiedCredentials',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'hasVotingRights',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountInvestmentToken',
        type: 'uint256',
      },
    ],
    name: 'convertInvestmentToStablecoin',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountStablecoin',
        type: 'uint256',
      },
    ],
    name: 'convertStablecoinToInvestment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Admin functions
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newBps',
        type: 'uint256',
      },
    ],
    name: 'setInsurancePoolBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newMin',
        type: 'uint256',
      },
    ],
    name: 'setMinVotesRequired',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_voter',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_weight',
        type: 'uint256',
      },
    ],
    name: 'updateVoterWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_verifier',
        type: 'address',
      },
    ],
    name: 'grantVerifierRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_verifier',
        type: 'address',
      },
    ],
    name: 'revokeVerifierRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
    ],
    name: 'grantAdminRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
    ],
    name: 'revokeAdminRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'UserRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'investor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountInvestmentToken',
        type: 'uint256',
      },
    ],
    name: 'InvestmentAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'investor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountInvestmentToken',
        type: 'uint256',
      },
    ],
    name: 'InvestmentWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalProfit',
        type: 'uint256',
      },
    ],
    name: 'ProfitDistributed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'investor',
        type: 'address',
      },
    ],
    name: 'VotingRightsGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'LoanRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
    ],
    name: 'LoanVoted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountStablecoin',
        type: 'uint256',
      },
    ],
    name: 'LoanFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LoanPayment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanDefaulted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'institution',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'program',
        type: 'string',
      },
    ],
    name: 'CredentialAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'credentialIndex',
        type: 'uint256',
      },
    ],
    name: 'CredentialVerified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newAdminRole',
        type: 'address',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
] as const;

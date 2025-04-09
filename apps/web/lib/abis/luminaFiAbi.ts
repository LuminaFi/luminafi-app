export enum LoanStatus {
  Pending = 0,
  Approved = 1,
  Funded = 2,
  Active = 3,
  Completed = 4,
  Defaulted = 5,
}

export interface UserProfile {
  userAddress: string;
  reputationScore: number;
  hasActiveLoan: boolean;
  activeLoanId: number;
  registered: boolean;
  credentialCount: number;
}

export interface LoanSummary {
  id: number;
  borrower: string;
  amountStablecoin: string;
  termMonths: number;
  profitSharePercentage: number;
  status: LoanStatus;
  votes: number;
  totalVoters: number;
  paidAmount: string;
  nextPaymentDue: number;
}

export interface InvestorInfo {
  contribution: string;
  hasVotingRights: boolean;
  votingWeight: number;
}

export interface InvestmentPoolInfo {
  totalPool: string;
  insurancePool: string;
}

export const TESTNET_SMART_CONTRACT_ADDRESS = "0x47767548Cb3A074E1240e37fB497E082b9cA9A96";

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
    inputs: [],
    name: 'registerAsBorrower',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registerAsInvestor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Investment functions
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'investInLuminaFi',
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
        internalType: 'uint8',
        name: '_level',
        type: 'uint8',
      },
    ],
    name: 'verifyCredential',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // View functions - Getting information
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
        internalType: 'bool',
        name: 'hasVotingRights',
        type: 'bool',
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
    name: 'getInvestmentPoolInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalPool',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'insurancePool',
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
    name: 'getLoanSummary',
    outputs: [
      {
        components: [
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
            internalType: 'uint8',
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
            name: 'paidAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nextPaymentDue',
            type: 'uint256',
          },
        ],
        internalType: 'struct LuminaFi.LoanSummary',
        name: '',
        type: 'tuple',
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
    name: 'getUserProfile',
    outputs: [
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
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'getUserCredential',
    outputs: [
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
        internalType: 'uint8',
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
    inputs: [],
    name: 'totalInvestmentPool',
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
    inputs: [],
    name: 'insurancePoolBalance',
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
        indexed: false,
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
        indexed: false,
        internalType: 'address',
        name: 'investor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'InvestmentReceived',
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
        indexed: false,
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
        name: 'amountInvestmentToken',
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
] as const;

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

export interface LoanSummary {
    id: number;
    borrower: string;
    amountStablecoin: string;
    termMonths: number;
    profitSharePercentage: number;
    status: LoanStatus;
    votes: number;
    totalInvestors: number;
    paidAmount: string;
    nextPaymentDue: number;
}

export const LUMINAFI_ABI = [
    {
        name: 'getUserProfile',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: '_user', type: 'address' }],
        outputs: [
            { name: 'userAddress', type: 'address' },
            { name: 'reputationScore', type: 'uint256' },
            { name: 'hasActiveLoan', type: 'bool' },
            { name: 'activeLoanId', type: 'uint256' },
            { name: 'registered', type: 'bool' },
            { name: 'credentialCount', type: 'uint256' }
        ]
    },
    {
        name: 'getLoanSummary',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: '_loanId', type: 'uint256' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'id', type: 'uint256' },
                    { name: 'borrower', type: 'address' },
                    { name: 'amountStablecoin', type: 'uint256' },
                    { name: 'termMonths', type: 'uint256' },
                    { name: 'profitSharePercentage', type: 'uint256' },
                    { name: 'status', type: 'uint8' },
                    { name: 'votes', type: 'uint256' },
                    { name: 'totalInvestors', type: 'uint256' },
                    { name: 'paidAmount', type: 'uint256' },
                    { name: 'nextPaymentDue', type: 'uint256' }
                ]
            }
        ]
    },
    {
        name: 'registerUser',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: []
    },
    {
        name: 'addCredential',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_institution', type: 'string' },
            { name: '_program', type: 'string' },
            { name: '_documentHash', type: 'string' }
        ],
        outputs: []
    },
    {
        name: 'requestLoan',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_amountStablecoin', type: 'uint256' },
            { name: '_termMonths', type: 'uint256' },
            { name: '_profitSharePercentage', type: 'uint256' }
        ],
        outputs: []
    },
    {
        name: 'voteForLoan',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: '_loanId', type: 'uint256' }],
        outputs: []
    },
    {
        name: 'investInLoan',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_loanId', type: 'uint256' },
            { name: '_amountInvestmentToken', type: 'uint256' }
        ],
        outputs: []
    },
    {
        name: 'makePayment',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: '_loanId', type: 'uint256' }],
        outputs: []
    }
] as const;
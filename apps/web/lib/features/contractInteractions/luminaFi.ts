import { formatUnits, parseUnits } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import {
  LUMINAFI_ABI,
  LoanStatus,
  LoanSummaryBase,
  LoanSummaryDetails,
  BorrowerProfileView,
  InvestorProfileView,
  CredentialView,
} from '../../abis/luminaFiAbi';

export type WriteReturnType = Promise<{
  hash: `0x${string}` | undefined;
  error: string | undefined;
  isPending: boolean;
  isSuccess: boolean;
}>;

export function useBorrowerProfile(
  contractAddress: string,
  userAddress: string,
) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getBorrowerProfile',
    args: [userAddress as `0x${string}`],
  });

  const profile: BorrowerProfileView | undefined = data
    ? {
        name: data.name,
        institutionName: data.institutionName,
        userName: data.userName,
        userAddress: data.userAddress,
        reputationScore: Number(data.reputationScore),
        hasActiveLoan: data.hasActiveLoan,
        activeLoanId: Number(data.activeLoanId),
        registered: data.registered,
        credentialCount: Number(data.credentialCount),
      }
    : undefined;

  return { profile, error, isLoading };
}

export function useInvestorProfile(
  contractAddress: string,
  userAddress: string,
) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getInvestorProfile',
    args: [userAddress as `0x${string}`],
  });

  const profile: InvestorProfileView | undefined = data
    ? {
        name: data.name,
        institutionName: data.institutionName,
        userName: data.userName,
        sourceOfIncome: data.sourceOfIncome,
        userAddress: data.userAddress,
        reputationScore: Number(data.reputationScore),
        registered: data.registered,
      }
    : undefined;

  return { profile, error, isLoading };
}

export function useUserRole(contractAddress: string, userAddress: string) {
  const { data: investorRole } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'INVESTOR_ROLE',
  });

  const { data: borrowerRole } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'BORROWER_ROLE',
  });

  const { data: adminRole } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'ADMIN_ROLE',
  });

  const { data: isInvestor, isLoading: isLoadingInvestor } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'hasRole',
    args: [investorRole as `0x${string}`, userAddress as `0x${string}`],
  });

  const { data: isBorrower, isLoading: isLoadingBorrower } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'hasRole',
    args: [borrowerRole as `0x${string}`, userAddress as `0x${string}`],
  });

  const { data: isAdmin, isLoading: isLoadingAdmin } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'hasRole',
    args: [adminRole as `0x${string}`, userAddress as `0x${string}`],
  });

  const { data: hasVotingRights, isLoading: isLoadingVotingRights } =
    useReadContract({
      address: contractAddress as `0x${string}`,
      abi: LUMINAFI_ABI,
      functionName: 'hasVotingRights',
      args: [userAddress as `0x${string}`],
    });

  const isLoading =
    isLoadingInvestor ||
    isLoadingBorrower ||
    isLoadingAdmin ||
    isLoadingVotingRights;

  return {
    isInvestor: !!isInvestor,
    isBorrower: !!isBorrower,
    isAdmin: !!isAdmin,
    hasVotingRights: !!hasVotingRights,
    hasAnyRole: !!isInvestor || !!isBorrower || !!isAdmin,
    isLoading,
  };
}

export function useInvestorInfo(
  contractAddress: string,
  investorAddress: string,
) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getInvestorInfo',
    args: [investorAddress as `0x${string}`],
  });

  const investorInfo = data
    ? {
        contribution: formatUnits(data[0], 18),
        sharePercentage: Number(data[1]) / 100, // Convert basis points to percentage
        votingWeight: Number(data[2]),
        hasVotingRight: Number(data[2]) > 0, // Derive from voting weight
      }
    : undefined;

  return { investorInfo, error, isLoading };
}

export function usePoolInfo(contractAddress: string) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getPoolInfo',
  });

  const poolInfo = data
    ? {
        totalPool: formatUnits(data[0], 18),
        availableFunds: formatUnits(data[1], 6),
        allocatedFunds: formatUnits(data[2], 6),
        insurancePool: formatUnits(data[3], 6),
        investorCount: Number(data[4]),
      }
    : undefined;

  return { poolInfo, error, isLoading };
}

export function useLoanInformation(contractAddress: string, loanId: number) {
  // Get basic loan information
  const { data: basicInfo, isLoading: isLoadingBasic } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getLoanBasicInfo',
    args: [BigInt(loanId)],
  });

  // Get financial information
  const { data: financialInfo, isLoading: isLoadingFinancial } =
    useReadContract({
      address: contractAddress as `0x${string}`,
      abi: LUMINAFI_ABI,
      functionName: 'getLoanFinancialInfo',
      args: [BigInt(loanId)],
    });

  // Get status information
  const { data: statusInfo, isLoading: isLoadingStatus } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getLoanStatusInfo',
    args: [BigInt(loanId)],
  });

  // Get payment information
  const { data: paymentInfo, isLoading: isLoadingPayment } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getLoanPaymentInfo',
    args: [BigInt(loanId)],
  });

  const isLoading =
    isLoadingBasic || isLoadingFinancial || isLoadingStatus || isLoadingPayment;
  const isError = !basicInfo || !financialInfo || !statusInfo || !paymentInfo;

  const loanBase: LoanSummaryBase | undefined =
    basicInfo && financialInfo
      ? {
          id: loanId,
          borrower: basicInfo[1],
          reason: basicInfo[2],
          proof: basicInfo[3],
          amountStablecoin: formatUnits(financialInfo[0], 6),
          termMonths: Number(financialInfo[1]),
        }
      : undefined;

  const loanDetails: LoanSummaryDetails | undefined =
    financialInfo && statusInfo && paymentInfo
      ? {
          profitSharePercentage: Number(financialInfo[2]),
          status: Number(statusInfo[0]) as LoanStatus,
          votes: Number(statusInfo[1]),
          totalVoters: Number(statusInfo[2]),
          paidAmount: formatUnits(paymentInfo[0], 6),
          nextPaymentDue: Number(paymentInfo[1]),
        }
      : undefined;

  return {
    loanBase,
    loanDetails,
    isError,
    isLoading,
  };
}

export function useCredentialView(
  contractAddress: string,
  userAddress: string,
  index: number,
) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getUserCredential',
    args: [userAddress as `0x${string}`, BigInt(index)],
  });

  const credential: CredentialView | undefined = data
    ? {
        institution: data.institution,
        program: data.program,
        documentHash: data.documentHash,
        level: Number(data.level),
        verified: data.verified,
        verificationTimestamp: Number(data.verificationTimestamp),
      }
    : undefined;

  return { credential, error, isLoading };
}

export function useRegisterAsBorrower(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const registerAsBorrower = async (
    name: string,
    institutionName: string,
    userName: string,
  ) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'registerAsBorrower',
        args: [name, institutionName, userName],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    registerAsBorrower,
  };
}

export function useRegisterAsInvestor(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const registerAsInvestor = async (
    name: string,
    institutionName: string,
    userName: string,
    sourceOfIncome: string,
  ) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'registerAsInvestor',
        args: [name, institutionName, userName, sourceOfIncome],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    registerAsInvestor,
  };
}

export function useInvestInPool(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const investInPool = async (amountInvestmentToken: string) => {
    try {
      const amountInBaseUnits = parseUnits(amountInvestmentToken, 18);
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'investInPool',
        args: [amountInBaseUnits],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    investInPool,
  };
}

export function useWithdrawInvestment(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const withdrawInvestment = async (amountInvestmentToken: string) => {
    try {
      const amountInBaseUnits = parseUnits(amountInvestmentToken, 18);
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'withdrawInvestment',
        args: [amountInBaseUnits],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    withdrawInvestment,
  };
}

export function useAddCredential(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const addCredential = async (
    institution: string,
    program: string,
    documentHash: string,
  ) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'addCredential',
        args: [institution, program, documentHash],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    addCredential,
  };
}

export function useRequestLoan(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const requestLoan = async (
    amountStablecoin: string,
    termMonths: number,
    profitSharePercentage: number,
    reason: string,
    proof: string,
  ) => {
    try {
      const amountInBaseUnits = parseUnits(amountStablecoin, 6);
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'requestLoan',
        args: [
          amountInBaseUnits,
          BigInt(termMonths),
          BigInt(profitSharePercentage),
          reason,
          proof,
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    requestLoan,
  };
}

export function useVoteForLoan(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const voteForLoan = async (loanId: number) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'voteForLoan',
        args: [BigInt(loanId)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    voteForLoan,
  };
}

export function useProcessFunding(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const processFunding = async (loanId: number) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'processFunding',
        args: [BigInt(loanId)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    processFunding,
  };
}

export function useMakePayment(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const makePayment = async (loanId: number) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'makePayment',
        args: [BigInt(loanId)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    makePayment,
  };
}

export function useDistributeProfit(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const distributeProfit = async () => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'distributeProfit',
        args: [],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    distributeProfit,
  };
}

// Role management hooks
export function useGrantVerifierRole(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const grantVerifierRole = async (address: string) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'grantVerifierRole',
        args: [address as `0x${string}`],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    grantVerifierRole,
  };
}

export function useGrantAdminRole(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const grantAdminRole = async (address: string) => {
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'grantAdminRole',
        args: [address as `0x${string}`],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    grantAdminRole,
  };
}

export function useApproveInvestmentToken(
  tokenAddress: string,
  spenderAddress: string,
) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const approveToken = async (amount: string) => {
    try {
      const amountInBaseUnits = parseUnits(amount, 18);
      await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: [
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amountInBaseUnits],
      });
    } catch (e) {
      console.error('Approval error:', e);
    }
  };

  return {
    hash: data,
    error: error?.message,
    isPending,
    isSuccess,
    approveToken,
  };
}

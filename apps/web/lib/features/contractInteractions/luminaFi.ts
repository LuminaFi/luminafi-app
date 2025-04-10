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

  const isLoading = isLoadingInvestor || isLoadingBorrower;

  return {
    isInvestor: !!isInvestor,
    isBorrower: !!isBorrower,
    hasAnyRole: !!isInvestor || !!isBorrower,
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
        hasVotingRight: data[1],
        votingWeight: Number(data[2]),
      }
    : undefined;

  return { investorInfo, error, isLoading };
}

export function useInvestmentPoolInfo(contractAddress: string) {
  const { data, error, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LUMINAFI_ABI,
    functionName: 'getInvestmentPoolInfo',
  });

  const poolInfo = data
    ? {
        totalPool: formatUnits(data[0], 18),
        insurancePool: formatUnits(data[1], 18),
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

export function useInvestInLuminaFi(contractAddress: string) {
  const { writeContractAsync, data, error, isPending, isSuccess } =
    useWriteContract();

  const investInLuminaFi = async (amountInvestmentToken: string) => {
    try {
      const amountInBaseUnits = parseUnits(amountInvestmentToken, 18);
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'investInLuminaFi',
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
    investInLuminaFi,
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

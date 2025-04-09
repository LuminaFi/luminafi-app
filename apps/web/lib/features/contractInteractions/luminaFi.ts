import { formatUnits, parseUnits } from 'viem';
import {
    useReadContract,
    useWriteContract,
} from 'wagmi';

import { LUMINAFI_ABI, LoanStatus, LoanSummary, UserProfile } from '../../abis/luminaFiAbi';

export type WriteReturnType = Promise<{
    hash: `0x${string}` | undefined;
    error: string | undefined;
    isPending: boolean;
    isSuccess: boolean;
}>

export function useUserProfile(contractAddress: string, userAddress: string) {
    const { data, error, isLoading } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'getUserProfile',
        args: [userAddress as `0x${string}`]
    });

    const profile: UserProfile | undefined = data ? {
        userAddress: data[0],
        reputationScore: Number(data[1]),
        hasActiveLoan: data[2],
        activeLoanId: Number(data[3]),
        registered: data[4],
        credentialCount: Number(data[5])
    } : undefined;

    return { profile, error, isLoading };
}

export function useLoanSummary(contractAddress: string, loanId: number) {
    const { data, isError, isLoading } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'getLoanSummary',
        args: [BigInt(loanId)]
    });

    const loan: LoanSummary | undefined = data ? {
        id: Number(data.id),
        borrower: data.borrower,
        amountStablecoin: formatUnits(data.amountStablecoin, 6),
        termMonths: Number(data.termMonths),
        profitSharePercentage: Number(data.profitSharePercentage),
        status: Number(data.status) as LoanStatus,
        votes: Number(data.votes),
        totalInvestors: Number(data.totalInvestors),
        paidAmount: formatUnits(data.paidAmount, 6),
        nextPaymentDue: Number(data.nextPaymentDue)
    } : undefined;

    return { loan, isError, isLoading };
}


export async function useRegisterUser(contractAddress: string): WriteReturnType {
    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'registerUser',
        args: [],
        account: contractAddress as `0x${string}`,
    })

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess,
    };
}

export async function useAddCredential(
    contractAddress: string,
    institution: string,
    program: string,
    documentHash: string
): WriteReturnType {
    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'addCredential',
        args: [institution, program, documentHash],
        account: contractAddress as `0x${string}`,
    })

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess,
    };
}

export async function useRequestLoan(
    contractAddress: string,
    amountStablecoin: string,
    termMonths: number,
    profitSharePercentage: number
): WriteReturnType {

    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    const amountInBaseUnits = parseUnits(amountStablecoin, 6);

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'requestLoan',
        args: [amountInBaseUnits, BigInt(termMonths), BigInt(profitSharePercentage)],
        account: contractAddress as `0x${string}`,
    })

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess,
    };
}

export async function useVoteForLoan(contractAddress: string, loanId: number): WriteReturnType {
    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'voteForLoan',
        args: [BigInt(loanId)],
    });

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess
    };
}

export async function useInvestInLoan(contractAddress: string,
    loanId: number,
    amountInvestmentToken: string): WriteReturnType {
    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    const amountInBaseUnits = parseUnits(amountInvestmentToken, 18);

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'investInLoan',
        args: [BigInt(loanId), amountInBaseUnits],
    });

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess
    };
}

export async function useMakePayment(contractAddress: string, loanId: number): WriteReturnType {
    const { writeContractAsync, data, error, isPending, isSuccess } = useWriteContract();

    await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: LUMINAFI_ABI,
        functionName: 'makePayment',
        args: [BigInt(loanId)],
    });

    return {
        hash: data,
        error: error?.message,
        isPending,
        isSuccess
    };
}
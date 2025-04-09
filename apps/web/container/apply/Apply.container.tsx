'use client';

import { useState } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { abi } from './abi';

interface ApplyFormData {
  amount: string;
}

const ApplyContainer = () => {
  const router = useRouter();
  const { ocAuth } = useOCAuth();
  const {
    data: hash,
    writeContract,
    error,
    isPending: isLoading,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [formData, setFormData] = useState<ApplyFormData>({
    amount: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      writeContract({
        address: ocAuth.ethAddress,
        abi,
        functionName: 'mint',
        // args: [BigInt(tokenId)],
      });
    } catch (err) {
      console.error('Application error:', err);
    }
  };

  return (
    <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      <div className="text-center">
        <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
          Apply for Student Education Loan
        </h1>
        <p className="text-sm">
          Secure your educational future with our innovative blockchain lending
          platform.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-16">
          <div className="mt-6 space-y-10">
            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                Amount
              </Label>
              <Input
                type="number"
                required
                name="amount"
                id="amount"
                className="flex-1"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter loan amount"
                min="0"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
              <div>
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default ApplyContainer;

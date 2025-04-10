'use client';

import { useState } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useRequestLoan } from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';

interface ApplyFormData {
  amount: string;
  borrowTerm: number;
  reason: string;
}

const ApplyContainer = () => {
  const router = useRouter();
  const { ocAuth } = useOCAuth();
  // Use the requestLoan hook from your contract interactions
  const {
    requestLoan,
    error,
    isSuccess: isConfirmed,
    isPending: isLoading,
    hash,
  } = useRequestLoan(TESTNET_SMART_CONTRACT_ADDRESS);

  const [formData, setFormData] = useState<ApplyFormData>({
    amount: '',
    borrowTerm: 0,
    reason: '',
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

    // Default values for proof and profitSharePercentage
    const proof = '';
    const profitSharePercentage = 500; // Setting a default of 5% (500 basis points)

    try {
      console.log('Submitting loan request:');
      console.log('Amount:', formData.amount);
      console.log('Term (years):', formData.borrowTerm);
      console.log('Term (months):', formData.borrowTerm * 12);
      console.log('Reason:', formData.reason);
      // Call the requestLoan function from the hook
      const x = await requestLoan(
        formData.amount,
        formData.borrowTerm * 12, // Convert years to months
        profitSharePercentage,
        formData.reason,
        proof,
      );

      console.log('call result',x);
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
            <div className="flex items-center gap-4">
              <Label htmlFor="borrowTerm" className="min-w-50 text-sm">
                Borrow Term (in years)
              </Label>
              <Input
                type="number"
                required
                name="borrowTerm"
                id="borrowTerm"
                className="flex-1"
                value={formData.borrowTerm}
                onChange={handleInputChange}
                placeholder="Enter borrow term"
                min="0"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="reason" className="min-w-50 text-sm">
                Reason of borrowing
              </Label>
              <Input
                type="text"
                required
                name="reason"
                id="reason"
                className="flex-1"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Reason of borrowing"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
            {hash && (
              <div className="text-sm break-all">Transaction Hash: {hash}</div>
            )}
            {isConfirmed && (
              <div className="text-green-600 text-sm">
                Transaction confirmed. Your loan request has been submitted.
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default ApplyContainer;

'use client';

import { useState, useEffect } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Slider } from '~/components/ui/slider';
import {
  useRequestLoan,
  useBorrowerProfile,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ApplyFormData {
  amount: string;
  borrowTerm: number;
  profitSharePercentage: number;
  reason: string;
  proof: string;
}

const ApplyContainer = () => {
  const router = useRouter();
  const { ocAuth } = useOCAuth();
  const { address, isConnected } = useAccount();

  // Get borrower profile to check if they're registered
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useBorrowerProfile(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

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
    borrowTerm: 1,
    profitSharePercentage: 500, // Default is 5% (500 basis points)
    reason: '',
    proof: '',
  });

  // Handle form submission state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Monitor the state of the transaction
  useEffect(() => {
    if (isConfirmed) {
      setSubmitting(false);
      setSuccess(true);
      toast.success('Loan request submitted successfully!');
    }

    if (error) {
      setSubmitting(false);
      toast.error('Failed to submit loan request', {
        description: error,
      });
    }
  }, [isConfirmed, error]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    // Convert percentage to basis points (e.g. 5% = 500 basis points)
    setFormData((prev) => ({
      ...prev,
      profitSharePercentage: value[0]! * 100,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate data
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast.error('Please enter a valid loan amount');
        setSubmitting(false);
        return;
      }

      if (formData.borrowTerm <= 0) {
        toast.error('Please enter a valid loan term');
        setSubmitting(false);
        return;
      }

      if (!formData.reason) {
        toast.error('Please provide a reason for your loan request');
        setSubmitting(false);
        return;
      }

      console.log('Submitting loan request:');
      console.log('Amount:', formData.amount);
      console.log('Term (years):', formData.borrowTerm);
      console.log('Term (months):', formData.borrowTerm * 12);
      console.log(
        'Profit Share (basis points):',
        formData.profitSharePercentage,
      );
      console.log('Reason:', formData.reason);
      console.log('Proof:', formData.proof);

      // Call the requestLoan function from the hook
      await requestLoan(
        formData.amount,
        formData.borrowTerm * 12, // Convert years to months
        formData.profitSharePercentage,
        formData.reason,
        formData.proof || '', // Default to empty string if no proof
      );
    } catch (err) {
      console.error('Application error:', err);
      setSubmitting(false);
      toast.error('An unexpected error occurred', {
        description: 'Please try again later',
      });
    }
  };

  // Check if user is a registered borrower
  if (!profileLoading && profile && !profile.registered) {
    return (
      <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
        <div className="text-center">
          <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
            Apply for Student Education Loan
          </h1>
          <p className="text-sm mb-8">
            You need to register as a borrower before applying for a loan.
          </p>
          <Button onClick={() => router.push('/register')}>
            Register as Borrower
          </Button>
        </div>
      </section>
    );
  }

  // If user has active loan, show a message
  if (!profileLoading && profile && profile.hasActiveLoan) {
    return (
      <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
        <div className="text-center">
          <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
            You have an active loan
          </h1>
          <p className="text-sm mb-8">
            You cannot apply for another loan while you have an active loan.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            View Your Loan
          </Button>
        </div>
      </section>
    );
  }

  if (!isConnected) {
    return (
      <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
        <div className="text-center">
          <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
            Apply for Student Education Loan
          </h1>
          <p className="text-sm mb-8">
            Please connect your wallet to apply for a loan.
          </p>
          <Button onClick={() => router.push('/connect-wallet')}>
            Connect Wallet
          </Button>
        </div>
      </section>
    );
  }

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

      {success ? (
        <div className="m-auto mt-8 max-w-md">
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your loan request has been submitted and is now pending approval
              from investors.
              <div className="mt-2 text-xs font-mono break-all">
                Transaction: {hash}
              </div>
            </AlertDescription>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => router.push('/dashboard')}>
                View Your Requests
              </Button>
            </div>
          </Alert>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-8">
            <div className="mt-6 space-y-8">
              <div className="flex items-center gap-4">
                <Label htmlFor="amount" className="min-w-50 text-sm">
                  Amount (USDC)
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
                  step="0.01"
                  disabled={submitting}
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
                  min="1"
                  max="5"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="profitShare" className="min-w-50 text-sm">
                    Profit Share (%)
                  </Label>
                  <div className="flex-1">
                    <Slider
                      id="profitShare"
                      defaultValue={[5]}
                      min={5}
                      max={30}
                      step={1}
                      onValueChange={handleSliderChange}
                      disabled={submitting}
                    />
                  </div>
                  <span className="w-12 text-right">
                    {formData.profitSharePercentage / 100}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-[calc(var(--min-w-50)+1rem)]">
                  This is the percentage of the loan amount you will share as
                  profit with investors
                </p>
              </div>

              <div className="flex items-start gap-4">
                <Label htmlFor="reason" className="min-w-50 text-sm pt-2">
                  Reason for borrowing
                </Label>
                <Textarea
                  required
                  name="reason"
                  id="reason"
                  className="flex-1 min-h-[100px]"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Explain the reason for your loan request"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-start gap-4">
                <Label htmlFor="proof" className="min-w-50 text-sm pt-2">
                  Proof (optional)
                </Label>
                <Textarea
                  name="proof"
                  id="proof"
                  className="flex-1"
                  value={formData.proof}
                  onChange={handleInputChange}
                  placeholder="Add any additional information or links to supporting documents"
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !profile?.registered}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit Loan Request'
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default ApplyContainer;

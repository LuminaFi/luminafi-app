'use client';

import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useRouter } from 'next/navigation';
import {
  useRegisterAsBorrower,
  useRegisterAsInvestor,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  fullname: string;
  institutionName: string;
  userName: string;
  companyName: string;
  incomeSource: string;
}

const RegisterContainer = () => {
  const router = useRouter();
  const { ocAuth } = useOCAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'investor'>('student');
  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    institutionName: '',
    userName: ocAuth?.OCId || '',
    companyName: '',
    incomeSource: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  // Hooks for smart contract interaction
  const {
    registerAsBorrower,
    error: borrowerError,
    isPending: borrowerPending,
    isSuccess: borrowerSuccess,
  } = useRegisterAsBorrower(TESTNET_SMART_CONTRACT_ADDRESS);

  const {
    registerAsInvestor,
    error: investorError,
    isPending: investorPending,
    isSuccess: investorSuccess,
  } = useRegisterAsInvestor(TESTNET_SMART_CONTRACT_ADDRESS);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field: keyof FormData,
  ) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const registerBorrower = async () => {
    if (!formData.fullname || !formData.institutionName) {
      setAlertMessage({
        type: 'error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    try {
      await registerAsBorrower(
        formData.fullname,
        formData.institutionName,
        formData.userName || ocAuth?.OCId || 'user',
      );

      router.push('/upload-credentials')
    } catch (err) {
      console.error('Registration error:', err);
      setAlertMessage({
        type: 'error',
        message: 'Failed to register as a student. Please try again.',
      });
    }
  };

  const registerInvestor = async () => {
    if (!formData.fullname || !formData.companyName || !formData.incomeSource) {
      setAlertMessage({
        type: 'error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    try {
      await registerAsInvestor(
        formData.fullname,
        formData.companyName,
        formData.userName || ocAuth?.OCId || 'user',
        formData.incomeSource,
      );

      router.push('/dashboard/investor');
    } catch (err) {
      console.error('Registration error:', err);
      setAlertMessage({
        type: 'error',
        message: 'Failed to register as an investor. Please try again.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMessage(null);

    if (activeTab === 'student') {
      await registerBorrower();
    } else {
      await registerInvestor();
    }

    setIsLoading(false);
  };

  // Update alert message based on transaction status
  useState(() => {
    if (borrowerError || investorError) {
      setAlertMessage({
        type: 'error',
        message:
          borrowerError ||
          investorError ||
          'An error occurred during registration',
      });
    } else if (borrowerSuccess || investorSuccess) {
      setAlertMessage({
        type: 'success',
        message: 'Registration successful!',
      });

      // Redirect after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  });

  const isPending = borrowerPending || investorPending;

  return (
    <section className="flex bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-12">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
              Create a LuminaFi Account
            </h1>
            <p className="text-sm">
              Welcome! Register an account to get started
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              className={`cursor-pointer pb-2 text-lg font-medium transition-colors ${
                activeTab === 'student'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('student')}
            >
              Student
            </button>
            <div className="mx-6 h-5 w-[1px] bg-border dark:bg-zinc-50" />
            <button
              type="button"
              className={`cursor-pointer pb-2 text-lg font-medium transition-colors ${
                activeTab === 'investor'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('investor')}
            >
              Investor
            </button>
          </div>

          {alertMessage && (
            <Alert
              variant={
                alertMessage.type === 'error' ? 'destructive' : 'default'
              }
              className={
                alertMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : ''
              }
            >
              {alertMessage.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle>
                {alertMessage.type === 'error' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="block text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                required
                name="fullname"
                id="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange(e, 'fullname')}
                disabled={isLoading || isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="block text-sm">
                Username
              </Label>
              <Input
                type="text"
                required
                name="userName"
                id="userName"
                value={formData.userName || ocAuth?.OCId || ''}
                onChange={(e) => handleInputChange(e, 'userName')}
                disabled={true}
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Auto-generated from your OpenCampus ID
              </p>
            </div>

            {activeTab === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="institutionName" className="block text-sm">
                  Institution Name
                </Label>
                <Input
                  type="text"
                  required
                  name="institutionName"
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => handleInputChange(e, 'institutionName')}
                  disabled={isLoading || isPending}
                />
              </div>
            )}

            {activeTab === 'investor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="block text-sm">
                    Company/Institution Name
                  </Label>
                  <Input
                    type="text"
                    required
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange(e, 'companyName')}
                    disabled={isLoading || isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeSource" className="block text-sm">
                    Income Source
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange(value, 'incomeSource')
                    }
                    value={formData.incomeSource}
                    disabled={isLoading || isPending}
                  >
                    <SelectTrigger name="incomeSource" id="incomeSource">
                      <SelectValue placeholder="Select income source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isPending}
            >
              {isLoading || isPending
                ? 'Creating Account...'
                : 'Create Account'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegisterContainer;

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

interface FormData {
  fullname: string;
  institutionName?: string;
  companyName?: string;
  incomeSource?: string;
}

const RegisterContainer = () => {
  const router = useRouter();
  const { ocAuth } = useOCAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'investor'>('student');
  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    institutionName: '',
    companyName: '',
    incomeSource: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activeTab === 'student' ? {  
          userId: ocAuth.OCId,
          userName: ocAuth.OCId,
          walletAddress: ocAuth.ethAddress,
          fullName: formData.fullname, 
          role: activeTab, 
          transcript: null, 
          essay: '', 
          institutionName: '', 
          amount: 0,
        } : {
          userId: ocAuth.OCId,
          userName: ocAuth.OCId,
          walletAddress: ocAuth.ethAddress,          
          fullName: formData.fullname,
          companyName: formData.companyName,
          incomeSource: formData.incomeSource,
          role: activeTab,
          transcript: null, 
          essay: '', 
          institutionName: '', 
          amount: 0,          
        }),
      });

      if (response.ok) {
        router.push('/upload-credentials');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="block text-sm">
                Fullname
              </Label>
              <Input
                type="text"
                required
                name="fullname"
                id="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange(e, 'fullname')}
              />
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
                />
              </div>
            )}

            {activeTab === 'investor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="block text-sm">
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    required
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange(e, 'companyName')}
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegisterContainer;

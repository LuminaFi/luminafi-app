'use client';

import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const RegisterContainer = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'investor'>('student');

  return (
    <section className="flex bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      <form
        action=""
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
              <Input type="text" required name="fullname" id="fullname" />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeSource" className="block text-sm">
                    Income Source
                  </Label>
                  <Select>
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

            <Button className="w-full">Create Account</Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegisterContainer;

'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
// import { TextEffect } from '~/components/motion-primitives/text-effect';

const ApplyContainer = () => {
  return (
    <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      {/* <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
        <TextEffect
          preset="fade-in-blur"
          speedSegment={0.3}
          as="h1"
          className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[4.25rem]"
        >
          Apply for Student Education Loan
        </TextEffect>
        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          delay={0.5}
          as="p"
          className="mx-auto mt-8 max-w-2xl text-balance text-lg"
        >
          Secure your educational future with our innovative blockchain lending
          platform.
        </TextEffect>
      </div> */}
      <div className="text-center">
        <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
          Apply for Student Education Loan
        </h1>
        <p className="text-sm">
          {' '}
          Secure your educational future with our innovative blockchain lending
          platform.
        </p>
      </div>

      <form
        action=""
        className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-16">
          <div className="mt-6 space-y-10">
            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                Amount
              </Label>
              <Input
                type="text"
                required
                name="amount"
                id="amount"
                className="flex-1"
              />
            </div>

            <Button className="w-full">Continue</Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ApplyContainer;

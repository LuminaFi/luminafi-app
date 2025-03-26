'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
// import { TextEffect } from '~/components/motion-primitives/text-effect';
import { Textarea } from '~/components/ui/textarea';
import { UploadIcon } from 'lucide-react';
import { Separator } from '~/components/ui/separator';

const UploadCredentialsContainer = () => {
  return (
    <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      {/* <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
        <TextEffect
          preset="fade-in-blur"
          speedSegment={0.3}
          as="h1"
          className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[4.25rem]"
        >
          Credentials
        </TextEffect>
      </div> */}
      <div className="text-center">
        <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
          Credentials
        </h1>
        <Separator className="mb-8 max-w-[200px] mx-auto bg-zinc-50" />
      </div>

      <form
        action=""
        className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-16">
          <div className="mt-6 space-y-10">
            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                File
              </Label>
              <div className="flex-1">
                <Input
                  type="file"
                  required
                  name="file"
                  id="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full cursor-pointer"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  <UploadIcon /> Upload File
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                Description
              </Label>
              <Textarea id="msg" rows={5} />
            </div>

            <Button className="w-full">Apply</Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UploadCredentialsContainer;

'use client';

import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
// import { TextEffect } from '~/components/motion-primitives/text-effect';
import { Textarea } from '~/components/ui/textarea';
import { Separator } from '~/components/ui/separator';
import UploadCredential from '~/components/uploadCredential';
import { useState } from 'react';

const UploadCredentialsContainer = () => {
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);
  const [essayUrl, setEssayUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcriptUrl,
          essayUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Successfully submitted:', data);
      // Optionally: show success UI or reset form
    } catch (error) {
      console.error('❌ Submission failed:', error);
    }
  };
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
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-1/2 overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border py-10 px-36 min-w-[500px] space-y-16">
          <div className="mt-6 space-y-10">
            <UploadCredential label="Transcript" onUploaded={setTranscriptUrl}/>
            <UploadCredential label="Essay" onUploaded={setEssayUrl}/>

            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                Description
              </Label>
              <Textarea id="msg" rows={5} />
            </div>

            <Button type="submit" className="w-full">Apply</Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UploadCredentialsContainer;

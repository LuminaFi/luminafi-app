'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
// import { TextEffect } from '~/components/motion-primitives/text-effect';
import { Textarea } from '~/components/ui/textarea';
import { UploadIcon } from 'lucide-react';
import { Separator } from '~/components/ui/separator';
import { useRef, useState } from 'react';
import fileUploadService from '~/services/fileUpload.service';
import { useAddCredential } from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


const UploadCredentialsContainer = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const {
    addCredential,
    error,
    isPending,
    isSuccess
  } = useAddCredential(TESTNET_SMART_CONTRACT_ADDRESS);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

      try {
        const url = await fileUploadService.uploadFile(file);
        console.log('Upload successful:', url);
        if (url) {
          setUploadUrl(url);
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await addCredential("test", "test", uploadUrl!);

    setIsLoading(false);
  }

  // Update alert message based on transaction status
  useState(() => {
    if (error) {
      setAlertMessage({
        type: 'error',
        message:
          error ||
          'An error occurred during registration',
      });
    } else if (isSuccess) {
      setAlertMessage({
        type: 'success',
        message: 'Credential Uploaded!',
      });

      // Redirect after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  });
  
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
            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                File
              </Label>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  required
                  name="file"
                  id="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon /> Upload File
                </Button>
                {fileName && <p className="text-sm mt-2 text-muted-foreground">Selected: {fileName}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="amount" className="min-w-50 text-sm">
                Description
              </Label>
              <Textarea id="msg" rows={5} />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isPending}>Apply</Button>
          </div>
        </div>
      </form>

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
    </section>
  );
};

export default UploadCredentialsContainer;

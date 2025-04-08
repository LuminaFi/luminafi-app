import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { UploadIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import fileUploadService from '~/services/fileUpload.service';

export default function UploadCredential({ label, onUploaded }: { label: string, onUploaded: (url: string) => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

      try {
        const url = await fileUploadService.uploadFile(file);
        console.log('Upload successful:', url);
        if (url) {
          setUploadUrl(url);
          onUploaded?.(url);
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="amount" className="min-w-50 text-sm">
        { label }
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
        {uploadUrl && (
          <a href={uploadUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">
            View uploaded file
          </a>
        )}
      </div>
    </div>
  );
}
import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL as string;
const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string;
const SUPABASE_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string;

class FileUploadService {
  private client: any;
  private bucketName: string;
  
  constructor() {
    this.bucketName = SUPABASE_BUCKET_NAME;
    this.client = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);
  }

  async uploadFile(file: any) {
    if (!file) {
      return null;
    }

    const filePath = `uploads/${Date.now()}-${file.name}`
    const { error } = await this.client.storage.from(this.bucketName).upload(filePath, file);
    if (error) {
      console.error("Upload error", error.message);
      return null;
    }

    const { data: publicUrlData } = this.client.storage.from(this.bucketName).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;
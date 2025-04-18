import { Loader2 } from 'lucide-react';

export const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Authenticating...</p>
    </div>
  </div>
);

import React from 'react';
import { Button } from '~/components/ui/button';
import { ExternalLink } from 'lucide-react';

type BlockExplorerLinkProps = {
  txHash: string;
  text?: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
};

export const BlockExplorerLink: React.FC<BlockExplorerLinkProps> = ({
  txHash,
  text,
  variant = 'default',
  size = 'default',
  className,
}) => {
  // This is a placeholder URL, update with the actual block explorer URL for your network
  const blockExplorerBaseUrl = 'https://openscan.opencampus.dev/tx/';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `${blockExplorerBaseUrl}${txHash}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      {text || (
        <>
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </>
      )}
    </Button>
  );
};

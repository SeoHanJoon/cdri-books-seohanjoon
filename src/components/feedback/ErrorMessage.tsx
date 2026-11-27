import { Button } from '@/components/ui/Button';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p role="alert" className="text-caption text-text-secondary">
        {message}
      </p>
      <Button variant="primary" onClick={onRetry} className="px-5">
        다시 시도
      </Button>
    </div>
  );
}

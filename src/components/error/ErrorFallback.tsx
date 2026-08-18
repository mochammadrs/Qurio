"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset: () => void;
}

export function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleGoHome = () => {
    onReset();
    router.push('/');
  };

  const handleTryAgain = () => {
    onReset();
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
        </div>

        <div className="bg-surface-card border border-border rounded-lg p-8">
          <h1 className="text-headline-lg text-text-primary mb-3 text-center">
            Terjadi Kesalahan
          </h1>
          <p className="text-text-muted text-center mb-6">
            Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan akan segera memperbaikinya.
          </p>

          {isDevelopment && error && (
            <details className="mb-6 bg-surface-low rounded-md p-4 border border-border">
              <summary className="cursor-pointer font-semibold text-text-secondary mb-2">
                Detail Error (Development Mode)
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Error Message:</p>
                  <pre className="text-xs text-error bg-surface-container p-2 rounded mt-1 overflow-x-auto">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Stack Trace:</p>
                    <pre className="text-xs text-error bg-surface-container p-2 rounded mt-1 overflow-x-auto max-h-40 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Component Stack:</p>
                    <pre className="text-xs text-error bg-surface-container p-2 rounded mt-1 overflow-x-auto max-h-40 overflow-y-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleTryAgain}
              variant="primary"
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Lagi
            </Button>
            <Button
              onClick={handleGoHome}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-text-subtle mt-6">
          Jika masalah ini terus berlanjut, silakan hubungi support kami.
        </p>
      </div>
    </div>
  );
}

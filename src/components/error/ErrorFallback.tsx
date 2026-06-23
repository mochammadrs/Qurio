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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Oops! Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan akan segera memperbaikinya.
          </p>

          {isDevelopment && error && (
            <details className="mb-6 bg-red-50 rounded-lg p-4 border border-red-200">
              <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                Detail Error (Development Mode)
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-red-900">Error Message:</p>
                  <pre className="text-xs text-red-700 bg-red-100 p-2 rounded mt-1 overflow-x-auto">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <p className="text-sm font-semibold text-red-900">Stack Trace:</p>
                    <pre className="text-xs text-red-700 bg-red-100 p-2 rounded mt-1 overflow-x-auto max-h-40 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <p className="text-sm font-semibold text-red-900">Component Stack:</p>
                    <pre className="text-xs text-red-700 bg-red-100 p-2 rounded mt-1 overflow-x-auto max-h-40 overflow-y-auto">
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Jika masalah ini terus berlanjut, silakan hubungi support kami.
        </p>
      </div>
    </div>
  );
}

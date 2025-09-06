'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CheckCircle2, XCircle } from 'lucide-react';

// A wrapper component is needed to use `useSearchParams` within a Suspense boundary
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email, please wait...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Verification token not found. The link may be invalid.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Verification failed.');
                }

                setStatus('verified');
                setMessage(data.message);

            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'An unexpected error occurred.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">Email Verification</CardTitle>
                <CardDescription>
                    {status === 'loading' ? 'Attempting to verify your account.' : 'Verification process complete.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <LoadingSpinner size="lg" />
                        <p>{message}</p>
                    </div>
                )}
                {status === 'verified' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <p className="font-semibold text-lg">{message}</p>
                        <Button asChild className="mt-4">
                            <Link href="/login">Proceed to Login</Link>
                        </Button>
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                        <p className="font-semibold text-lg text-red-600">Verification Failed</p>
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default function VerifyEmailPage() {
    return (
         <div className="container flex items-center justify-center min-h-[80vh] px-4">
            <Suspense fallback={
                <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
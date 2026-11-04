'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, ApiError } from '@/lib/api/client';

const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onCredentialsSubmit = async (values: LoginValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api<{
        user: { mustEnable2fa?: boolean };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (res.data?.user?.mustEnable2fa) {
        router.replace('/admin/settings?setup2fa=1');
      } else {
        router.replace(nextPath);
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === 'TOTP_REQUIRED') {
        setStep('totp');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const onTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      await api('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code: totpCode.trim() }),
      });
      router.replace(nextPath);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {step === 'credentials' ? (
              <Lock className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 'credentials' ? 'Admin Sign In' : 'Two-Factor Verification'}
          </CardTitle>
          <CardDescription>
            {step === 'credentials'
              ? 'Sign in with your portfolio administrator account.'
              : 'Enter the 6-digit verification code from your authenticator app.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'credentials' ? (
            <form
              onSubmit={handleSubmit(onCredentialsSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password ? (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                ) : null}
              </div>

              {errorMessage ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={onTotpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="totp-code">6-Digit Code</Label>
                <Input
                  id="totp-code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest"
                />
              </div>

              {errorMessage ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || totpCode.trim().length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginFormInner />
    </Suspense>
  );
}


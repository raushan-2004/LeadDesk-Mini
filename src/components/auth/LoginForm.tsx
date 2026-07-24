'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    if (submitting) return;
    setSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result) {
        if (result.error) {
          // If status is 401 or the error indicates a credential or callback route failure
          if (
            result.status === 401 ||
            result.error.includes('CredentialsSignin') ||
            result.error.includes('CallbackRouteError') ||
            result.error.includes('credentials')
          ) {
            setAuthError('Invalid email or password.');
          } else {
            setAuthError('Unable to sign in right now. Please try again.');
          }
          setValue('password', ''); // Clear password input
        } else if (result.ok) {
          // Successful sign-in: navigate using Next.js router replace and refresh
          router.replace('/admin');
          router.refresh();
        } else {
          setAuthError('Unable to sign in right now. Please try again.');
          setValue('password', '');
        }
      } else {
        setAuthError('Unable to sign in right now. Please try again.');
        setValue('password', '');
      }
    } catch {
      setAuthError('Unable to sign in right now. Please try again.');
      setValue('password', '');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">
          LeadDesk
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          Admin sign in
        </p>
      </div>

      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-sm font-semibold text-red-600 dark:text-red-400 text-center"
        >
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={submitting}
            className={`w-full px-4 py-2.5 rounded border text-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:ring-2 focus:outline-none transition-all ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-zinc-300'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={submitting}
            className={`w-full px-4 py-2.5 rounded border text-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:ring-2 focus:outline-none transition-all ${
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-zinc-300'
            }`}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-950 text-sm font-bold transition-all focus:ring-2 focus:outline-none focus:ring-zinc-950 dark:focus:ring-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded px-1.5 py-1"
        >
          &larr; Back to website
        </Link>
      </div>
    </div>
  );
}

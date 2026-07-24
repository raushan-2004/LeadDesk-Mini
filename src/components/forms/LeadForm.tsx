'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, CreateLeadInput } from '@/lib/validations/lead';
import { BUDGET_RANGES, BUDGET_LABELS } from '@/constants/lead';

export default function LeadForm() {
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [generalErrorMessage, setGeneralErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      budget: undefined,
      message: '',
    },
  });

  const onSubmit = async (data: CreateLeadInput) => {
    if (submitStatus === 'SUBMITTING') return;
    setSubmitStatus('SUBMITTING');
    setGeneralErrorMessage(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 201 && result.success) {
        setSubmitStatus('SUCCESS');
        reset();
      } else if (response.status === 400 && result.error?.code === 'VALIDATION_ERROR') {
        setSubmitStatus('ERROR');
        // Map server validation errors back to corresponding form fields
        if (result.error.fields) {
          Object.entries(result.error.fields).forEach(([field, messages]) => {
            const msgArray = messages as string[];
            if (msgArray.length > 0) {
              setError(field as keyof CreateLeadInput, {
                type: 'server',
                message: msgArray[0],
              });
            }
          });
        }
      } else {
        // Unexpected or Server-side errors: show a sanitized safe message
        setSubmitStatus('ERROR');
        setGeneralErrorMessage('Something went wrong while sending your inquiry. Please try again.');
      }
    } catch (err) {
      console.error('API submission network error:', err);
      setSubmitStatus('ERROR');
      setGeneralErrorMessage('Something went wrong while sending your inquiry. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-md bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800"
      noValidate
    >
      {submitStatus === 'SUCCESS' && (
        <div
          role="alert"
          className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-zinc-900/50 dark:text-green-450 border border-green-200 dark:border-green-900"
        >
          <span className="font-semibold">Success!</span> Thanks — your project inquiry has been received. We will get back to you shortly.
        </div>
      )}

      {submitStatus === 'ERROR' && generalErrorMessage && (
        <div
          role="alert"
          className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-zinc-900/50 dark:text-red-450 border border-red-200 dark:border-red-900"
        >
          <span className="font-semibold">Error!</span> {generalErrorMessage}
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          disabled={submitStatus === 'SUBMITTING'}
          className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 ${
            errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          disabled={submitStatus === 'SUBMITTING'}
          className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 ${
            errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Budget Selector */}
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Budget Range
        </label>
        <select
          id="budget"
          disabled={submitStatus === 'SUBMITTING'}
          className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 ${
            errors.budget ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          aria-invalid={errors.budget ? 'true' : 'false'}
          aria-describedby={errors.budget ? 'budget-error' : undefined}
          {...register('budget')}
        >
          <option value="">Select a budget range</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range}>
              {BUDGET_LABELS[range]}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p id="budget-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.budget.message}
          </p>
        )}
      </div>

      {/* Message Textarea */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          disabled={submitStatus === 'SUBMITTING'}
          className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 ${
            errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-red-650 dark:text-red-450">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitStatus === 'SUBMITTING'}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-350 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitStatus === 'SUBMITTING' ? 'Sending inquiry...' : 'Send inquiry'}
      </button>
    </form>
  );
}

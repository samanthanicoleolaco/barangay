'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errTitle = 'Invalid email or password';
        let errDesc = error.message;

        if (error.message.toLowerCase().includes('email not confirmed')) {
          errTitle = 'Email verification required';
          errDesc = 'Please check your inbox and click the link we sent before logging in.';
        }

        toast.error(errTitle, {
          description: errDesc,
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      toast.success('Welcome back!', {
        description: 'Login successful.',
      });

      setIsLoading(false);
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f0f5f4]">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 sm:p-9">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-[#0d9488] flex items-center justify-center">
            <Pill className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-1.5">
          B-Healthcare
        </h1>
        <p className="text-center text-sm text-gray-500 mb-7">
          Barangay Healthcare System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="healthworker@barangay.gov"
              required
              className="w-full h-11 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 bg-[#0d9488] text-white text-sm font-bold rounded-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#0f766e] transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#0d9488] font-bold hover:underline">
            Sign up here
          </Link>
        </p>
        <p className="text-center text-[11px] text-gray-400 mt-3 italic">
          Exclusive for barangay health workers and staff
        </p>
      </div>
    </div>
  );
}

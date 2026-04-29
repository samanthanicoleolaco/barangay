'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please ensure both password and confirmation are the same.',
      });
      return;
    }
    
    if (!agreed) {
      toast.warning('Agreement required', {
        description: 'Please check the box to continue.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            position: position,
          },
        },
      });

      if (error) {
        let errTitle = 'Error signing up';
        let errDesc = error.message;

        if (error.message.toLowerCase().includes('rate limit')) {
          errTitle = 'Too many requests';
          errDesc = "You've reached the signup limit (Supabase anti-spam). Please try a different email or wait 15 minutes.";
        }

        toast.error(errTitle, {
          description: errDesc,
          duration: 6000,
        });
        setIsLoading(false);
        return;
      }

      toast.success('Account created successfully!', {
        description: 'You can now log in with your new account.',
      });

      setIsLoading(false);
      router.push('/login');
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f0f5f4]">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 sm:p-9">
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#0d9488] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-[#0d9488] flex items-center justify-center">
            <Pill className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-1.5">
          Create an Account
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join the B-Healthcare Inventory System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full h-11 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@barangay.gov"
              required
              className="w-full h-11 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full h-11 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors appearance-none"
            >
              <option value="" disabled>Select position</option>
              <option value="bhw">Barangay Health Worker (BHW)</option>
              <option value="midwife">Midwife</option>
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin Staff</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full h-11 px-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full h-11 px-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#0d9488] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mt-4 mb-6">
            <input
              type="checkbox"
              id="agreed"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-[#0d9488] border-gray-300 rounded focus:ring-[#0d9488] cursor-pointer"
            />
            <label htmlFor="agreed" className="text-[12px] text-gray-500 leading-relaxed cursor-pointer select-none">
              I agree to the terms and confirm that I am authorized personnel of the barangay health office.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#0d9488] text-white text-sm font-bold rounded-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#0f766e] transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0d9488] font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

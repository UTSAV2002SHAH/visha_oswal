"use client";

import React, { useState, useMemo } from 'react';
import { CloseIcon } from '../../ui/icons/CloseIcon';
import { EyeIcon } from '../../ui/icons/EyeIcon';
import { EyeSlashIcon } from '../../ui/icons/EyeSlashIcon';
import { CheckIcon } from '../../ui/icons/CheckIcon';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';

import toast from 'react-hot-toast';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordCriteria = useMemo(() => ({
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  }), [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
      if (!allCriteriaMet) {
        setError('Password does not meet all requirements.');
        setIsLoading(false);
        return;
      }
    }

    const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'An error occurred.');
      }

      if (mode === 'signin') {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back!');
        onLoginSuccess();
      } else {
        toast.success('Account created! Please sign in.');
        setMode('signin');
        setError('');
      }

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'signin' ? 'signup' : 'signin'));
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google Sign In Failed: No credentials');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Google Sign In Failed');
      }

      localStorage.setItem('token', data.token);
      toast.success(data.msg || 'Welcome!'); // Data msg might be undefined, fallback
      onLoginSuccess();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCriterion: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <li className={`flex items-center text-sm transition-colors ${met ? 'text-green-400' : 'text-gray-400'}`}>
      <CheckIcon className="w-4 h-4 mr-2" />
      <span>{text}</span>
    </li>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-300 mb-6">
          {mode === 'signin'
            ? 'Sign in to continue.'
            : 'Get started with a new account.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" required={mode === 'signup'} disabled={isLoading} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" required disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input id="password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm pr-10" required disabled={isLoading} />
              <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200" aria-label={isPasswordVisible ? "Hide password" : "Show password"} disabled={isLoading}>
                {isPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <ul className="mt-2 space-y-1 text-xs">
              <PasswordCriterion met={passwordCriteria.minLength} text="At least 8 characters" />
              <PasswordCriterion met={passwordCriteria.uppercase} text="Contains an uppercase letter" />
              <PasswordCriterion met={passwordCriteria.lowercase} text="Contains a lowercase letter" />
              <PasswordCriterion met={passwordCriteria.number} text="Contains a number" />
            </ul>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed">
            {isLoading ? (
              <SpinnerIcon className="animate-spin h-5 w-5" />
            ) : (
              mode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between gap-4">
            <div className="h-px bg-white/20 w-full" />
            <span className="text-gray-400 text-sm whitespace-nowrap">Or continue with</span>
            <div className="h-px bg-white/20 w-full" />
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              ux_mode="redirect"
              login_uri={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/google`}
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error('Google Login Failed');
              }}
              theme="filled_black"
              shape="pill"
              width="300" // Optional, tries to fill
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} className="font-medium text-saffron-400 hover:text-saffron-300 disabled:opacity-50" disabled={isLoading}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

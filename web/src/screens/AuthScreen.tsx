import React, { useState } from 'react';
import { HavenLogo } from '../components/Logo';
import { Mail, Lock, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (isGuest: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [householdName, setHouseholdName] = useState('My Home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(false);
  };

  return (
    <div className="min-h-screen bg-linen dark:bg-charcoal flex flex-col justify-center p-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <HavenLogo size={70} className="justify-center mb-3" />
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {isSignUp ? 'Create your Haven' : 'Welcome back'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isSignUp ? 'Set up your home inventory memory layer' : 'Sign in to access your household inventory'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Household Name
              </label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g. Green Nest"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-haven-600 hover:bg-haven-700 text-white font-semibold text-sm shadow-md shadow-haven-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-slate-200 dark:border-slate-800" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linen dark:bg-charcoal px-3 text-xs text-slate-400 font-medium">
            OR
          </span>
        </div>

        {/* Guest Access Button */}
        <button
          onClick={() => onLogin(true)}
          className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-haven-600 dark:text-haven-400" />
          <span>Continue as Demo Guest</span>
        </button>

        <div className="mt-5 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-500 hover:text-haven-600 dark:hover:text-haven-400 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-haven-600" />
        <span>Supabase Row-Level Security Enabled</span>
      </div>
    </div>
  );
};

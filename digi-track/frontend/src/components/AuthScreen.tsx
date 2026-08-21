import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

interface AuthScreenProps {
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'signin', onSuccess }) => {
  const { login, signup, userProfile } = useExpense();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const demoAccounts = [
    {
      name: 'Anjali Sharma',
      email: 'anjali.sharma@example.com',
      role: 'Personal Account (₹60,000/mo)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALJHF-hvH31xNBqTITD_O-8KMerMQELXYXRYccFFIwNqqcr6ojnfHfV6pj4Bfb009_ZBb9WVs_Tt8IqECY-GzBKDYhVT5SzkZVhEMmNpwkQD5oSQOQ-BYVNI1nA1LakhO05K7hVJ7OO7jqdAqiKryDQzPlUquhhqAbJoNbn5CZ0n78FZ_AMu7N_96xg0VRkCPhf-svK5yjI4-bOhkxLjtB3izHs-UHwkkQwB167rzegPaTepK7IPMhcw',
      symbol: '₹',
      code: 'INR',
    },
    {
      name: 'Vikram Patel',
      email: 'vikram.patel@techfin.io',
      role: 'Consultant & Pro (₹95,000/mo)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      symbol: '₹',
      code: 'INR',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@global.dev',
      role: 'International ($2,500/mo)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      symbol: '$',
      code: 'USD',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signin') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        login(email.trim(), undefined);
        if (onSuccess) onSuccess();
      }, 500);
    } else {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        signup(name.trim(), email.trim(), currencySymbol, currencyCode);
        if (onSuccess) onSuccess();
      }, 500);
    }
  };

  const handleDemoLogin = (acc: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(acc.email, acc.name, acc.avatar);
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleOAuthLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoEmail = provider === 'Google' ? 'demo.google@example.com' : 'demo.apple@example.com';
      const demoName = provider === 'Google' ? 'Google Demo User' : 'Apple Demo User';
      login(demoEmail, demoName);
      if (onSuccess) onSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eff4ff] via-[#f8fafc] to-[#eef7f6] flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="w-full max-w-md flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#005c55] text-white flex items-center justify-center shadow-lg shadow-[#005c55]/20 mb-3 animate-in zoom-in-95">
          <span className="material-symbols-outlined text-[32px] fill-1">
            account_balance_wallet
          </span>
        </div>
        <h1 className="font-display text-[26px] sm:text-[28px] font-extrabold text-[#0b1c30] tracking-tight">
          Digi Track
        </h1>
        <p className="text-[14px] text-[#3e4947] font-medium mt-1">
          {mode === 'signin' ? 'Sign in to access your budget & expense logs' : 'Create an account to track expenses and smart AI tips'}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-elevation-2 border border-[#bdc9c6]/40 p-6 sm:p-8 relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#eff4ff] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl font-display text-[14px] font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl font-display text-[14px] font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {forgotPasswordSent && (
          <div className="mb-4 p-3 bg-[#e5eeff] text-[#004eaa] rounded-xl text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Password reset link sent to your email address!</span>
          </div>
        )}

        {/* Primary Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[13px] font-bold text-[#0b1c30] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#bdc9c6]/60 focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 text-[14px] text-[#0b1c30] placeholder-[#6e7977] outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[13px] font-bold text-[#0b1c30] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-[18px]">
                mail
              </span>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#bdc9c6]/60 focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 text-[14px] text-[#0b1c30] placeholder-[#6e7977] outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[13px] font-bold text-[#0b1c30]">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordSent(true)}
                  className="text-[12px] font-semibold text-[#005c55] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#bdc9c6]/60 focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 text-[14px] text-[#0b1c30] placeholder-[#6e7977] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7977] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Currency selection on signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[13px] font-bold text-[#0b1c30] mb-1.5">
                Primary Currency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
                  { code: 'USD', symbol: '$', label: 'USD ($)' },
                  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
                ].map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setCurrencyCode(curr.code);
                      setCurrencySymbol(curr.symbol);
                    }}
                    className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                      currencyCode === curr.code
                        ? 'bg-[#005c55] text-white border-[#005c55]'
                        : 'bg-[#eff4ff] text-[#3e4947] border-[#bdc9c6]/40 hover:bg-[#e5eeff]'
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Remember me checkbox */}
          {mode === 'signin' && (
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#005c55] border-[#bdc9c6] focus:ring-[#005c55]"
              />
              <span className="text-[13px] text-[#3e4947] font-medium select-none">
                Keep me signed in on this device
              </span>
            </label>
          )}

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#005c55] hover:bg-[#004d47] active:scale-[0.99] text-white font-display text-[15px] font-bold shadow-md shadow-[#005c55]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* OAuth Dividers */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#bdc9c6]/40" />
          </div>
          <span className="relative bg-white px-3 text-[12px] font-semibold text-[#6e7977] uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#bdc9c6]/60 bg-white hover:bg-[#eff4ff]/60 transition-colors text-[13px] font-bold text-[#0b1c30] shadow-xs active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('Apple')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#bdc9c6]/60 bg-white hover:bg-[#eff4ff]/60 transition-colors text-[13px] font-bold text-[#0b1c30] shadow-xs active:scale-95"
          >
            <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.73 1.03.08 2.07-.53 2.67-1.25z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-5 border-t border-[#bdc9c6]/40">
          <p className="text-[12px] font-bold text-[#6e7977] uppercase tracking-wider mb-2 text-center">
            Or Instant 1-Click Demo Profiles
          </p>
          <div className="flex flex-col gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoLogin(acc)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#eff4ff]/60 hover:bg-[#e5eeff] transition-all text-left group border border-transparent hover:border-[#005c55]/30"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#bdc9c6]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#0b1c30] group-hover:text-[#005c55] transition-colors leading-tight">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-[#6e7977]">{acc.role}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 bg-white text-[#005c55] rounded-lg shadow-xs group-hover:bg-[#005c55] group-hover:text-white transition-all">
                  Switch &amp; Enter
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-6 text-center text-[12px] text-[#6e7977] max-w-sm">
        <p className="flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#005c55]">
            lock
          </span>
          Offline-first local encryption &amp; AI-assisted analysis
        </p>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Building2, Eye, EyeOff, User, Phone, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  // Mode: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form States
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');

  // Register Form States (New FMCG Company / Distributorship)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('distributor_owner');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setErrorMsg(result.message || 'Invalid email or password');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: regRole,
      });

      if (result.success) {
        setSuccessMsg('Distributorship registered successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setErrorMsg(result.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register distributorship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#051c1f] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans py-12">
      {/* Background glowing decorations */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00897b]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#005a63]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a896] to-[#028090] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-teal-900/40">
              +
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">
              [Distributor] <span className="text-[#2dd4bf]">ERP</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8ea8a2]">
            Enterprise Multi-Company FMCG Distribution Suite
          </p>
        </div>

        {/* Card with Mode Switcher */}
        <div className="bg-[#072428]/90 border border-[#0f4e54]/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-[#041618] rounded-xl border border-[#0f4e54]/60">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-[#00897b] to-[#006d77] text-white shadow-sm'
                  : 'text-[#8ea8a2] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#00897b] to-[#006d77] text-white shadow-sm'
                  : 'text-[#8ea8a2] hover:text-white'
              }`}
            >
              Register Company
            </button>
          </div>

          <div className="border-b border-[#0f4e54]/50 pb-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              {activeTab === 'signin' ? 'Sign In to Your Distributorship' : 'Register New FMCG Distributorship'}
            </h2>
            <p className="text-xs text-[#8ea8a2] mt-0.5">
              {activeTab === 'signin'
                ? 'Enter your company email and password to access portal'
                : 'Create an isolated workspace for your business enterprise'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-500/50 rounded-lg p-3 flex items-start gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-3 flex items-start gap-2 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Distributor Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8ea8a2]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. agarwal@fmcg.com"
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-9 pr-3 py-2.5 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8ea8a2]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-9 pr-10 py-2.5 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8ea8a2] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00897b] to-[#006d77] hover:from-[#009688] hover:to-[#00796b] text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-teal-900/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@gmail.com');
                    setPassword('admin123');
                    setErrorMsg('');
                  }}
                  className="text-[11px] text-[#2dd4bf] hover:underline"
                >
                  Use Demo: admin@gmail.com / admin123
                </button>
              </div>
            </form>
          ) : (
            /* 2. REGISTER NEW DISTRIBUTORSHIP FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Distributorship / Firm Legal Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8ea8a2]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sharma FMCG Agency & Supply"
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-9 pr-3 py-2 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Email (Owner Login ID)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8ea8a2]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. sharma@gmail.com"
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-9 pr-3 py-2 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8ea8a2]">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98..."
                      className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-8 pr-2 py-2 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role in Enterprise
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg px-2.5 py-2 focus:outline-hidden focus:border-[#2dd4bf] cursor-pointer"
                  >
                    <option value="distributor_owner">Distributor Owner</option>
                    <option value="billing_operator">Billing Desk</option>
                    <option value="godown_manager">Godown Manager</option>
                    <option value="cashier">Cashier / Accounts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8ea8a2]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#041618] border border-[#0f4e54] text-white text-xs rounded-lg pl-9 pr-10 py-2 placeholder-slate-500 focus:outline-hidden focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8ea8a2] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00897b] to-[#006d77] hover:from-[#009688] hover:to-[#00796b] text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-teal-900/50 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create My FMCG Distributorship</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Lock, User, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../i18n/translations';
import { DEMO_HOSPITAL_CREDENTIALS } from '../data/seedData';
import { generateSalt, hashPassword, verifyPassword } from '../utils/crypto';
import { HospitalAccount } from '../types';

export const HospitalAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setSession, hospitalAccounts, registerHospitalAccount, hospitals } = useAppStore();
  const t = translations[currentLanguage];

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register Form
  const [regHospitalId, setRegHospitalId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regContactPerson, setRegContactPerson] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // List of hospitals that do not yet have an account
  const registeredHospitalIds = new Set(hospitalAccounts.map((a) => a.hospitalId));
  const unregisteredHospitals = hospitals.filter((h) => !registeredHospitalIds.has(h.id));

  // Quick Demo Hospital Login (Sagar Care)
  const handleUseDemoHospital = async () => {
    setLoading(true);
    setErrorMsg('');

    // Ensure demo account exists in store
    const existing = hospitalAccounts.find(
      (a) => a.username.toLowerCase() === DEMO_HOSPITAL_CREDENTIALS.username.toLowerCase()
    );

    if (!existing) {
      registerHospitalAccount({
        hospitalId: DEMO_HOSPITAL_CREDENTIALS.hospitalId,
        username: DEMO_HOSPITAL_CREDENTIALS.username,
        salt: DEMO_HOSPITAL_CREDENTIALS.salt,
        hash: DEMO_HOSPITAL_CREDENTIALS.hash,
        contactPerson: DEMO_HOSPITAL_CREDENTIALS.contactPerson,
      });
    }

    setSession({
      type: 'hospital',
      hospitalId: DEMO_HOSPITAL_CREDENTIALS.hospitalId,
      username: DEMO_HOSPITAL_CREDENTIALS.username,
    });

    setLoading(false);
    navigate('/portal');
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const account = hospitalAccounts.find(
        (a) => a.username.toLowerCase() === usernameInput.trim().toLowerCase()
      );

      if (!account) {
        setErrorMsg(t.auth.invalidCredentials);
        setLoading(false);
        return;
      }

      const isValid = await verifyPassword(passwordInput, account.salt, account.hash);
      if (!isValid) {
        setErrorMsg(t.auth.invalidCredentials);
        setLoading(false);
        return;
      }

      setSession({
        type: 'hospital',
        hospitalId: account.hospitalId,
        username: account.username,
      });

      navigate('/portal');
    } catch (err) {
      setErrorMsg('Error verifying credentials');
    } finally {
      setLoading(false);
    }
  };

  // Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regHospitalId) {
      setErrorMsg('Please select your hospital');
      return;
    }

    // Username validation: 4-20 chars: letters, numbers, . - _
    const usernameRegex = /^[a-zA-Z0-9._-]{4,20}$/;
    if (!usernameRegex.test(regUsername)) {
      setErrorMsg('Username must be 4–20 characters (letters, numbers, dot, dash, underscore)');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    // Check if hospital already has account
    if (hospitalAccounts.some((a) => a.hospitalId === regHospitalId)) {
      setErrorMsg(t.auth.hospitalAlreadyHasAccount);
      return;
    }

    // Check if username taken
    if (hospitalAccounts.some((a) => a.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setErrorMsg(t.auth.usernameTaken);
      return;
    }

    setLoading(true);
    try {
      const salt = generateSalt(16);
      const hash = await hashPassword(regPassword, salt);

      const newAccount: HospitalAccount = {
        hospitalId: regHospitalId,
        username: regUsername.trim(),
        salt,
        hash,
        contactPerson: regContactPerson.trim() || undefined,
      };

      const success = registerHospitalAccount(newAccount);
      if (success) {
        setSession({
          type: 'hospital',
          hospitalId: regHospitalId,
          username: regUsername.trim(),
        });
        navigate('/portal');
      } else {
        setErrorMsg('Failed to register hospital account. Try again.');
      }
    } catch {
      setErrorMsg('Encryption error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-4">
      <div className="max-w-md w-full mx-auto space-y-5">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back} to Welcome</span>
        </button>

        {/* Demo Hospital Shortcut Button */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Demo Credentials
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono">
              sagarcare / demo1234
            </span>
          </div>
          <button
            onClick={handleUseDemoHospital}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{t.auth.useDemoHospital}</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-800 mb-1">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="font-black text-xl text-slate-900">
              {t.auth.hospitalLoginTitle}
            </h1>
            <p className="text-xs text-slate-500">
              Authorized Visakhapatnam hospital staff only
            </p>
          </div>

          {/* Tabs: Sign In / Create Account */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.auth.signInTab}
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.auth.createAccountTab}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
              {errorMsg}
            </p>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.username} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. sagarcare"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 text-sm outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 text-sm outline-none text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-sm active:scale-98 transition-all"
              >
                {loading ? t.common.loading : t.auth.signInBtn}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.selectHospital} *
                </label>
                <select
                  value={regHospitalId}
                  onChange={(e) => setRegHospitalId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="">-- Choose Hospital --</option>
                  {unregisteredHospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.locality})
                    </option>
                  ))}
                </select>
                {unregisteredHospitals.length === 0 && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    All demo hospitals currently have registered accounts. You can sign in with sagarcare.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.username} (4-20 characters) *
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. harbourcity_opd"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.auth.password} (min 6) *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.auth.confirmPassword} *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.contactPerson}
                </label>
                <input
                  type="text"
                  value={regContactPerson}
                  onChange={(e) => setRegContactPerson(e.target.value)}
                  placeholder="e.g. Dr. Haritha (OPD Incharge)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-sm active:scale-98 transition-all"
              >
                {loading ? t.common.loading : t.auth.createAccountBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

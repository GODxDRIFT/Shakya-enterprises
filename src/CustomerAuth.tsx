// src/CustomerAuth.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Mail, Lock, User, Chrome, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';

type Screen = 'login' | 'signup' | 'forgot';

interface AuthModalProps {
  onClose: () => void;
  initialScreen?: Screen;
}

const Field = ({ icon: Icon, label, type = 'text', value, onChange, placeholder }: {
  icon?: React.ElementType; label?: string; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30" />}
      <input
        type={isPassword ? (show ? 'text' : 'password') : type}
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={cn("w-full border border-brand-charcoal/15 py-3 pr-3 text-sm bg-white focus:outline-none focus:border-brand-olive transition-colors", Icon ? "pl-9" : "pl-3")}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-charcoal">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};

export const AuthModal = ({ onClose, initialScreen = 'login' }: AuthModalProps) => {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true); setError('');
    try { await login(form.email, form.password); onClose(); }
    catch (e: unknown) { setError(e instanceof Error ? friendlyError(e.message) : 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try { await signup(form.name, form.email, form.password); onClose(); }
    catch (e: unknown) { setError(e instanceof Error ? friendlyError(e.message) : 'Signup failed'); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try { await loginWithGoogle(); onClose(); }
    catch (e: unknown) { setError(e instanceof Error ? friendlyError(e.message) : 'Google login failed'); }
    finally { setLoading(false); }
  };

  const handleForgot = async () => {
    if (!form.email) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    try { await resetPassword(form.email); setSuccess('Reset link sent! Check your email.'); }
    catch (e: unknown) { setError(e instanceof Error ? friendlyError(e.message) : 'Failed to send reset email'); }
    finally { setLoading(false); }
  };

  const friendlyError = (msg: string) => {
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) return 'Invalid email or password.';
    if (msg.includes('email-already-in-use')) return 'This email is already registered.';
    if (msg.includes('weak-password')) return 'Password must be at least 6 characters.';
    if (msg.includes('popup-closed')) return 'Google sign-in was cancelled.';
    return 'Something went wrong. Please try again.';
  };

  const goTo = (s: Screen) => { setScreen(s); setError(''); setSuccess(''); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', damping: 28 }} className="relative bg-white w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden">

        <div className="p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-brand-charcoal/30 hover:text-brand-charcoal"><X size={18} /></button>

          <AnimatePresence mode="wait">
            {/* ── Login ── */}
            {screen === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Welcome back</p>
                <h2 className="serif text-2xl text-brand-charcoal mb-6">Sign In</h2>
                {error && <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 mb-4"><AlertCircle size={13} />{error}</div>}
                <div className="space-y-3 mb-5">
                  <Field icon={Mail} type="email" value={form.email} onChange={v => set('email', v)} placeholder="Email address" />
                  <Field icon={Lock} type="password" value={form.password} onChange={v => set('password', v)} placeholder="Password" />
                </div>
                <button onClick={() => goTo('forgot')} className="text-[10px] text-brand-gold hover:underline mb-5 block">Forgot password?</button>
                <button onClick={handleLogin} disabled={loading} className="w-full py-3.5 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50 mb-3">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <button onClick={handleGoogle} disabled={loading} className="w-full py-3 border border-brand-charcoal/20 text-[11px] font-bold text-brand-charcoal hover:bg-brand-cream transition-colors flex items-center justify-center gap-2 mb-5">
                  <Chrome size={14} /> Continue with Google
                </button>
                <p className="text-center text-xs text-brand-charcoal/50">Don't have an account? <button onClick={() => goTo('signup')} className="text-brand-gold font-bold hover:underline">Sign Up</button></p>
              </motion.div>
            )}

            {/* ── Signup ── */}
            {screen === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Join us</p>
                <h2 className="serif text-2xl text-brand-charcoal mb-6">Create Account</h2>
                {error && <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 mb-4"><AlertCircle size={13} />{error}</div>}
                <div className="space-y-3 mb-5">
                  <Field icon={User} value={form.name} onChange={v => set('name', v)} placeholder="Full name" />
                  <Field icon={Mail} type="email" value={form.email} onChange={v => set('email', v)} placeholder="Email address" />
                  <Field icon={Lock} type="password" value={form.password} onChange={v => set('password', v)} placeholder="Password (min 6 chars)" />
                  <Field icon={Lock} type="password" value={form.confirm} onChange={v => set('confirm', v)} placeholder="Confirm password" />
                </div>
                <button onClick={handleSignup} disabled={loading} className="w-full py-3.5 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50 mb-3">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <button onClick={handleGoogle} disabled={loading} className="w-full py-3 border border-brand-charcoal/20 text-[11px] font-bold text-brand-charcoal hover:bg-brand-cream transition-colors flex items-center justify-center gap-2 mb-5">
                  <Chrome size={14} /> Continue with Google
                </button>
                <p className="text-center text-xs text-brand-charcoal/50">Already have an account? <button onClick={() => goTo('login')} className="text-brand-gold font-bold hover:underline">Sign In</button></p>
              </motion.div>
            )}

            {/* ── Forgot Password ── */}
            {screen === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Reset password</p>
                <h2 className="serif text-2xl text-brand-charcoal mb-3">Forgot Password?</h2>
                <p className="text-sm text-brand-charcoal/50 mb-6">Enter your email and we'll send you a reset link.</p>
                {error && <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 mb-4"><AlertCircle size={13} />{error}</div>}
                {success && <div className="flex items-center gap-2 text-emerald-600 text-xs bg-emerald-50 p-3 mb-4"><CheckCircle2 size={13} />{success}</div>}
                <Field icon={Mail} type="email" value={form.email} onChange={v => set('email', v)} placeholder="Email address" />
                <button onClick={handleForgot} disabled={loading || !!success} className="w-full py-3.5 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50 mt-4 mb-4">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
                <p className="text-center text-xs text-brand-charcoal/50"><button onClick={() => goTo('login')} className="text-brand-gold font-bold hover:underline">← Back to Sign In</button></p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

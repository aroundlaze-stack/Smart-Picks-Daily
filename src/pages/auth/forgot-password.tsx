// ─── Forgot Password Page ─────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { SEO } from '../../components/seo';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <SEO title="Reset Password | Smart Picks Daily" description="Reset your Smart Picks Daily password." url="/forgot-password" />

      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-[0_0_60px_rgba(79,140,255,0.06)]">
            {submitted ? (
              /* ── Success state ── */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-3">Check your inbox</h2>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  If <strong className="text-foreground">{email}</strong> is registered with Smart Picks Daily,
                  you'll receive a password reset link within a few minutes.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Didn't receive it? Check your spam folder, or try again.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setEmail(''); }}
                    className="w-full border border-border text-foreground py-3 rounded-xl font-semibold hover:bg-muted/40 transition-all"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/login"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,140,255,0.25)] hover:bg-primary/90 flex items-center justify-center"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="text-primary" size={24} />
                  </div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Reset your password</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6 text-sm"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,140,255,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </motion.button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  <Link href="/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

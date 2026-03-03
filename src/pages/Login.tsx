import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const { resetPassword } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setIsSendingReset(true);

    try {
      await resetPassword(forgotEmail);
      setResetSent(true);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-noise" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-army-700 flex items-center justify-center">
              <span className="text-lg font-bold text-white">DE</span>
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight">DAHAR</span>
              <span className="text-xl font-light text-muted-foreground ml-1">ENGINEER</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <div className="bg-secondary/30 p-8 border border-border/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="pl-10 bg-background border-border/50 focus:border-army-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 bg-background border-border/50 focus:border-army-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                             hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border/50" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotEmail(formData.email);
                }}
                className="text-army-400 hover:text-army-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-army-700 hover:bg-army-600 text-white"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary/30 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full border-border/50 hover:bg-secondary"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-army-400 hover:text-army-300 transition-colors font-medium">
            Create one
          </Link>
        </p>

        {/* Back to Home */}
        <Link
          to="/"
          className="block text-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </motion.div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-secondary border border-border/50 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reset Password</h3>
                <button onClick={() => setIsForgotModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-army-500/10 text-army-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-2">Check your email</h4>
                  <p className="text-xs text-muted-foreground mb-6">
                    We've sent a password reset link to <span className="text-foreground font-medium">{forgotEmail}</span>.
                  </p>
                  <Button
                    onClick={() => {
                      setIsForgotModalOpen(false);
                      setResetSent(false);
                    }}
                    className="w-full bg-army-700 hover:bg-army-600"
                  >
                    Got it
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {forgotError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {forgotError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail" className="text-xs">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgotEmail"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="pl-9 h-10 bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="flex-1 h-10 text-xs border-border/50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSendingReset}
                      className="flex-1 h-10 text-xs bg-army-700 hover:bg-army-600"
                    >
                      {isSendingReset ? 'Sending...' : 'Send Link'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

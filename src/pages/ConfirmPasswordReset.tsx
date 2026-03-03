import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ConfirmPasswordReset() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token: routeToken } = useParams<{ token: string }>();
    const { confirmPasswordReset, isLoading } = useAuth();

    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Extract token from URL
    useEffect(() => {
        let t = routeToken;

        if (!t) {
            const params = new URLSearchParams(location.search);
            t = params.get('token') || undefined;
        }

        // Check hash for PocketBase redirects (in case redirect handler wasn't used)
        if (!t && location.hash) {
            if (location.hash.includes('confirm-password-reset/')) {
                t = location.hash.split('confirm-password-reset/')[1]?.split('?')[0];
            } else {
                const hashParams = new URLSearchParams(location.hash.split('?')[1]);
                t = hashParams.get('token') || undefined;
            }
        }

        if (t) {
            setToken(t);
        } else {
            // Only set error if not in success state
            if (!isSuccess) {
                setError('Invalid or missing reset token.');
            }
        }
    }, [location, routeToken, isSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            await confirmPasswordReset(token, password);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may be expired.');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-noise" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-md px-6 text-center"
                >
                    <div className="bg-secondary/30 p-8 border border-border/30">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-16 h-16 text-army-500 animate-bounce" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
                        <p className="text-muted-foreground mb-6">
                            Your password has been reset successfully. You will be redirected to the login page shortly.
                        </p>
                        <Link to="/login">
                            <Button className="w-full bg-army-700 hover:bg-army-600 text-white">
                                Go to Login Now
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold">Create New Password</h1>
                    <p className="text-muted-foreground mt-1">
                        Please enter your new password below
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {token && !isSuccess && (
                    <div className="bg-secondary/30 p-8 border border-border/30">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                        className="pl-10 bg-background border-border/50 focus:border-army-500"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full bg-army-700 hover:bg-army-600 text-white"
                            >
                                {isLoading ? (
                                    'Resetting...'
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                )}

                {!token && !isLoading && (
                    <div className="text-center bg-secondary/30 p-8 border border-border/30">
                        <p className="text-muted-foreground mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link to="/forgot-password">
                            <Button className="w-full bg-army-700 hover:bg-army-600 text-white">
                                Request New Link
                            </Button>
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

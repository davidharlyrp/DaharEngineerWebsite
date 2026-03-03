import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Mail,
    ArrowRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword() {
    const { resetPassword, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await resetPassword(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
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
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground mt-1">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Success Content */}
                {isSubmitted ? (
                    <div className="bg-secondary/30 p-8 border border-border/30 text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-12 h-12 text-army-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                        <p className="text-muted-foreground mb-6">
                            We've sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox (and spam folder) to continue.
                        </p>
                        <Link to="/login">
                            <Button className="w-full bg-army-700 hover:bg-army-600 text-white">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Forgot Password Form */
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className="pl-10 bg-background border-border/50 focus:border-army-500"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-army-700 hover:bg-army-600 text-white"
                            >
                                {isLoading ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="block text-center mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to login
                </Link>
            </motion.div>
        </div>
    );
}

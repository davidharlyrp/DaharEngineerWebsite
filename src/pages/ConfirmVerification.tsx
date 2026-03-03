import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '@/lib/pocketbase/client';
import { SimpleModal } from '@/components/ui/SimpleModal';
import { Loader2 } from 'lucide-react';

export default function ConfirmVerification() {
    const { token: routeToken } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | undefined>(routeToken);
    const [isVerifying, setIsVerifying] = useState(true);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    useEffect(() => {
        // If token is not in route params, look in the hash (standard for PocketBase)
        if (!routeToken) {
            const hash = window.location.hash;
            if (hash.includes('confirm-verification/')) {
                const extractedToken = hash.split('confirm-verification/')[1]?.split('?')[0];
                if (extractedToken) {
                    setToken(extractedToken);
                }
            }
        }
    }, [routeToken]);

    useEffect(() => {
        const confirmVerification = async () => {
            if (!token) {
                setModalState({
                    isOpen: true,
                    title: 'Invalid Token',
                    message: 'The verification token is missing or invalid.',
                    type: 'error'
                });
                setIsVerifying(false);
                return;
            }

            try {
                await pb.collection('users').confirmVerification(token);
                setModalState({
                    isOpen: true,
                    title: 'Verification Success',
                    message: 'Your email has been successfully verified. You can now access all features of your account.',
                    type: 'success'
                });
            } catch (error) {
                console.error('Verification error:', error);
                setModalState({
                    isOpen: true,
                    title: 'Verification Failed',
                    message: 'This link may have expired or already been used. Please try requesting a new verification email from your dashboard.',
                    type: 'error'
                });
            } finally {
                setIsVerifying(false);
            }
        };

        confirmVerification();
    }, [token]);

    const handleClose = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            {isVerifying ? (
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-army-500 animate-spin mx-auto" />
                    <p className="text-muted-foreground animate-pulse">Verifying your email...</p>
                </div>
            ) : (
                <SimpleModal
                    isOpen={modalState.isOpen}
                    onClose={handleClose}
                    title={modalState.title}
                    message={modalState.message}
                    type={modalState.type}
                    actionLabel="Go to Dashboard"
                    onAction={handleClose}
                />
            )}
        </div>
    );
}

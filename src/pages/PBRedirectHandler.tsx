import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PBRedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;

        if (hash) {
            if (hash.includes('confirm-password-reset/')) {
                const token = hash.split('confirm-password-reset/')[1]?.split('?')[0];
                navigate(`/auth/confirm-password-reset?token=${token}`, { replace: true });
                return;
            }

            if (hash.includes('confirm-verification/')) {
                const token = hash.split('confirm-verification/')[1]?.split('?')[0];
                navigate(`/auth/confirm-verification/${token}`, { replace: true });
                return;
            }
        }

        // Default fallback if no hash or unknown hash
        navigate('/', { replace: true });
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse text-sm">
            Redirecting...
        </div>
    );
}

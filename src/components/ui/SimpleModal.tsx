import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    actionLabel?: string;
    onAction?: () => void;
}

export function SimpleModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    actionLabel,
    onAction
}: SimpleModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-sm overflow-hidden bg-secondary border border-border/50 rounded-lg shadow-xl"
                    >
                        <div className="p-6 text-center">
                            <div className={cn(
                                "w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center border",
                                type === 'success' && "bg-army-500/10 border-army-500/20 text-army-500",
                                type === 'error' && "bg-army-500/10 border-army-500/20 text-army-500",
                                type === 'info' && "bg-army-500/10 border-army-500/20 text-army-500"
                            )}>
                                {type === 'success' && (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {type === 'error' && (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                {type === 'info' && (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>

                            <h3 className="text-lg font-bold mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex gap-3 justify-center">
                                {actionLabel && onAction ? (
                                    <Button onClick={onAction} className="bg-army-700 hover:bg-army-600 h-9 px-4 text-xs">
                                        {actionLabel}
                                    </Button>
                                ) : (
                                    <Button onClick={onClose} variant="outline" className="h-9 px-4 text-xs border-border/50">
                                        Close
                                    </Button>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:bg-background/50 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

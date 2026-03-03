import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createInvoice } from '@/lib/xendit/client';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/types';

interface CheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ product, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const invoice = await createInvoice({
        external_id: `order-${product.id}-${Date.now()}`,
        amount: product?.discount_price || product?.main_price,
        payer_email: user?.email || '',
        description: `Purchase: ${product.name}`,
        success_redirect_url: `${window.location.origin}/store/success`,
        failure_redirect_url: `${window.location.origin}/store/failed`,
        customer: {
          given_names: user?.name || '',
          email: user?.email || '',
        },
        items: [
          {
            name: product.name,
            quantity: 1,
            price: product?.discount_price || product?.main_price,
            category: product.category,
          },
        ],
      });

      // Open payment page in new tab
      window.open(invoice.invoice_url, '_blank');

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-secondary/50 border border-border/50 p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Checkout</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Product Info */}
              <div className="bg-background p-4 mb-6">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {product.short_description}
                </p>
                <p className="text-xl font-bold text-army-400">
                  Rp {(product?.discount_price || product?.main_price).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={user?.name || ''}
                    disabled
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Supported payment methods:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Virtual Account', 'Credit Card', 'QRIS', 'E-Wallet', 'Retail'].map((method) => (
                    <span
                      key={method}
                      className="text-xs px-2 py-1 bg-background border border-border/30"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="flex-1 bg-army-700 hover:bg-army-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

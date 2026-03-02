// Xendit Payment Integration
// Documentation: https://developers.xendit.co/

const XENDIT_API_KEY = import.meta.env.VITE_XENDIT_API_KEY || '';
const XENDIT_API_URL = 'https://api.xendit.co';

export interface XenditInvoiceRequest {
  external_id: string;
  amount: number;
  payer_email: string;
  description: string;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  currency?: string;
  invoice_duration?: number;
  customer?: {
    given_names: string;
    email: string;
  };
  items?: XenditInvoiceItem[];
}

export interface XenditInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface XenditInvoiceResponse {
  id: string;
  external_id: string;
  user_id: string;
  status: string;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  payer_email: string;
  description: string;
  expiry_date: string;
  invoice_url: string;
  available_banks: XenditPaymentMethod[];
  available_retail_outlets: XenditPaymentMethod[];
  available_ewallets: XenditPaymentMethod[];
  available_qr_codes: XenditPaymentMethod[];
  available_direct_debits: XenditPaymentMethod[];
  available_paylaters: XenditPaymentMethod[];
  should_exclude_credit_card: boolean;
  should_send_email: boolean;
  created: string;
  updated: string;
  currency: string;
}

export interface XenditPaymentMethod {
  bank_code?: string;
  collection_type?: string;
  transfer_amount?: number;
  bank_branch?: string;
  account_holder_name?: string;
  identity_amount?: number;
}

// Create invoice
export const createInvoice = async (
  data: XenditInvoiceRequest
): Promise<XenditInvoiceResponse> => {
  const response = await fetch(`${XENDIT_API_URL}/v2/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(XENDIT_API_KEY + ':')}`,
    },
    body: JSON.stringify({
      ...data,
      currency: data.currency || 'IDR',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create invoice');
  }

  return response.json();
};

// Get invoice by ID
export const getInvoice = async (invoiceId: string): Promise<XenditInvoiceResponse> => {
  const response = await fetch(`${XENDIT_API_URL}/v2/invoices/${invoiceId}`, {
    headers: {
      'Authorization': `Basic ${btoa(XENDIT_API_KEY + ':')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get invoice');
  }

  return response.json();
};

// Expire invoice
export const expireInvoice = async (invoiceId: string): Promise<void> => {
  const response = await fetch(`${XENDIT_API_URL}/invoices/${invoiceId}/expire!`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(XENDIT_API_KEY + ':')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to expire invoice');
  }
};

// Create payment request for e-wallets and QRIS
export interface XenditPaymentRequest {
  reference_id: string;
  currency: string;
  amount: number;
  checkout_method: string;
  channel_code?: string;
  channel_properties?: {
    success_redirect_url?: string;
    failure_redirect_url?: string;
    cancel_redirect_url?: string;
  };
  metadata?: Record<string, any>;
}

export const createPaymentRequest = async (
  data: XenditPaymentRequest
): Promise<any> => {
  const response = await fetch(`${XENDIT_API_URL}/payment_requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(XENDIT_API_KEY + ':')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create payment request');
  }

  return response.json();
};

// Webhook handler for payment notifications
export interface XenditWebhookPayload {
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string;
  payer_email: string;
  description: string;
  created: string;
  updated: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
  success_redirect_url: string;
  failure_redirect_url: string;
  items?: XenditInvoiceItem[];
}

// Verify webhook signature
export const verifyWebhookSignature = (
  _payload: string,
  _signature: string,
  _webhookToken: string
): boolean => {
  // In production, implement proper signature verification
  // using crypto library to verify Xendit's webhook signature
  return true;
};

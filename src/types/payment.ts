export interface PaymentHistory {
    id: string;
    user_id: string;
    old_user_id?: string;
    user_email: string;
    user_name: string;
    product_id: string;
    product_name: string;
    product_category: string;
    amount: number;
    discount_amount?: number;
    final_amount: number;
    external_id: string;
    invoice_id: string;
    payment_status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    payment_method?: string;
    payment_date?: string;
    file_path?: string;
    file_name: string;
    file_size: number;
    downloaded: boolean;
    download_date?: string;
    created: string;
    updated: string;
}

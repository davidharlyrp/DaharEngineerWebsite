import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Xendit } from 'xendit-node';
import PocketBase from 'pocketbase';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Initialize Xendit
const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || '',
});
const { Invoice } = xenditClient;

// Initialize PocketBase
const pb = new PocketBase(process.env.VITE_POCKETBASE_URL);

async function getAdminPB() {
    if (process.env.PB_ADMIN_EMAIL && process.env.PB_ADMIN_PASSWORD) {
        await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD)
            .catch(err => console.error('PocketBase Admin Auth Failed:', err.message));
    }
    return pb;
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create Payment Invoice
app.post('/api/payment/create', async (req, res) => {
    try {
        const {
            productId,
            userId,
            userEmail,
            userName,
            amount,
            productName,
            productCategory,
            fileName,
            fileSize,
            productSlug
        } = req.body;

        const adminPb = await getAdminPB();

        // 1. Create initial record in payment_history
        const record = await adminPb.collection('payment_history').create({
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            product_id: productId,
            product_name: productName,
            product_category: productCategory,
            amount: amount,
            final_amount: amount,
            payment_status: 'PENDING',
            file_name: fileName,
            file_size: fileSize,
            downloaded: false
        });

        // 2. Create Xendit Invoice
        const invoice = await Invoice.createInvoice({
            data: {
                externalId: record.id,
                amount: amount,
                description: `Purchase: ${productName}`,
                invoiceDuration: 86400,
                customer: {
                    givenNames: userName,
                    email: userEmail,
                },
                currency: 'IDR',
                successRedirectUrl: `${process.env.FRONTEND_URL}/store/product/${productSlug}?status=paid&orderId=${record.id}`,
                failureRedirectUrl: `${process.env.FRONTEND_URL}/store/product/${productSlug}?status=failed`,
            }
        });

        // 3. Update record with Invoice ID
        await adminPb.collection('payment_history').update(record.id, {
            invoice_id: invoice.id
        });

        res.json({ invoiceUrl: invoice.invoiceUrl });
    } catch (error: any) {
        console.error('Payment Creation Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Xendit Webhook
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { status, external_id, payment_method, id } = req.body;

        if (status === 'PAID' || status === 'SETTLED') {
            const adminPb = await getAdminPB();

            // Update payment_history
            await adminPb.collection('payment_history').update(external_id, {
                payment_status: 'PAID',
                payment_method: payment_method,
                payment_date: new Date().toISOString(),
                invoice_id: id // Ensure we have the final ID
            });

            // Increment product stats
            const payment = await adminPb.collection('payment_history').getOne(external_id);
            await adminPb.collection('products').update(payment.product_id, {
                'download_count+': 1 // Actually purchase count, but per user request
            });
        }

        res.status(200).send('OK');
    } catch (error: any) {
        console.error('Webhook Error:', error);
        res.status(500).send(error.message);
    }
});

// Check payment status
app.get('/api/payment/check/:productId/:userId', async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const adminPb = await getAdminPB();

        const records = await adminPb.collection('payment_history').getFullList({
            filter: `product_id = "${productId}" && user_id = "${userId}" && payment_status = "PAID"`,
        });

        res.json({ purchased: records.length > 0 });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Log download
app.post('/api/payment/download', async (req, res) => {
    try {
        const { productId, userId } = req.body;
        const adminPb = await getAdminPB();

        const records = await adminPb.collection('payment_history').getFullList({
            filter: `product_id = "${productId}" && user_id = "${userId}" && payment_status = "PAID"`,
            sort: '-created',
        });

        if (records.length > 0) {
            await adminPb.collection('payment_history').update(records[0].id, {
                downloaded: true,
                download_date: new Date().toISOString()
            });
            res.json({ success: true });
        } else {
            res.status(403).json({ error: 'Not purchased' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Dahar Engineer API running on port ${port}`);
});

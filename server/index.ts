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
            payment_status: 'pending',
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

// Create Booking Invoice
app.post('/api/booking/create', async (req, res) => {
    try {
        const {
            userId,
            userEmail,
            userName,
            amount,
            courseId,
            courseTitle,
            mentorId,
            mentorName,
            mentorEmail,
            sessionDate,
            sessionTime,
            whatsapp,
            topic,
            duration,
            taxAmount,
            subtotal,
            courseType
        } = req.body;

        const adminPb = await getAdminPB();

        // 1. Create initial record in bookings
        const record = await adminPb.collection('bookings').create({
            user_id: userId,
            full_name: userName,
            email: userEmail,
            whatsapp: whatsapp,
            course_id: courseId,
            course_title: courseTitle,
            course_type: courseType,
            mentor_id: mentorId,
            mentor_name: mentorName,
            mentor_email: mentorEmail,
            session_date: sessionDate,
            session_time: sessionTime,
            topic: topic,
            duration: duration,
            price_per_session: amount / (courseType === 'Consultation' ? parseInt(duration) : 1) / 1.12, // Approximation
            subtotal: subtotal,
            tax_percentage: 12,
            tax_amount: taxAmount,
            total_amount: amount,
            payment_status: 'pending',
            booking_status: 'pending'
        });

        // 2. Create Xendit Invoice
        const invoice = await Invoice.createInvoice({
            data: {
                externalId: record.id,
                amount: amount,
                description: `Booking: ${courseTitle} with ${mentorName}`,
                invoiceDuration: 86400,
                customer: {
                    givenNames: userName,
                    email: userEmail,
                    mobileNumber: whatsapp
                },
                currency: 'IDR',
                successRedirectUrl: `${process.env.FRONTEND_URL}/courses/private-courses?status=success&bookingId=${record.id}`,
                failureRedirectUrl: `${process.env.FRONTEND_URL}/courses/private-courses?status=failed`,
            }
        });

        // 3. Update record with Invoice ID
        await adminPb.collection('bookings').update(record.id, {
            invoice_id: invoice.id
        });

        res.json({ invoiceUrl: invoice.invoiceUrl });
    } catch (error: any) {
        console.error('Booking Creation Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Xendit Webhook
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { status, external_id, payment_method, id } = req.body;

        if (status === 'PAID' || status === 'SETTLED') {
            const adminPb = await getAdminPB();

            // Try updating payment_history first (Products)
            try {
                await adminPb.collection('payment_history').update(external_id, {
                    payment_status: 'paid',
                    payment_method: payment_method,
                    payment_date: new Date().toISOString(),
                    invoice_id: id
                });

                // Increment product stats
                const payment = await adminPb.collection('payment_history').getOne(external_id);
                await adminPb.collection('products').update(payment.product_id, {
                    'download_count+': 1
                });

                return res.status(200).send('OK (Product)');
            } catch (err: any) {
                // If not found in payment_history, try bookings
                if (err.status === 404) {
                    try {
                        await adminPb.collection('bookings').update(external_id, {
                            payment_status: 'paid',
                            payment_method: payment_method,
                            payment_date: new Date().toISOString(),
                            booking_status: 'confirmed'
                        });
                        return res.status(200).send('OK (Booking)');
                    } catch (bookErr: any) {
                        if (bookErr.status === 404) {
                            console.error(`Record ${external_id} not found in any collection. Webhook ignored.`);
                            return res.status(200).send('Record not found, ignoring');
                        }
                        throw bookErr;
                    }
                }
                throw err;
            }
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
            filter: `product_id = "${productId}" && user_id = "${userId}" && payment_status = "paid"`,
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
            filter: `product_id = "${productId}" && user_id = "${userId}" && payment_status = "paid"`,
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

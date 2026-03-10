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

        // Function to generate unique 16-char ID
        const generateGroupId = async (): Promise<string> => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < 16; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Check collision
            const existing = await adminPb.collection('bookings').getList(1, 1, {
                filter: `booking_group_id = "${result}"`
            });

            if (existing.totalItems > 0) return generateGroupId();
            return result;
        };

        const bookingGroupId = await generateGroupId();
        const pricePerSession = Math.round(amount / (courseType === 'Consultation' ? parseInt(duration) : 1) / 1.12);

        // 1. Create initial record in bookings
        const record = await adminPb.collection('bookings').create({
            user_id: userId,
            booking_group_id: bookingGroupId,
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
            session_number: 1,
            total_sessions: 1,
            price_per_session: pricePerSession,
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

// Create Coin Purchase Invoice
app.post('/api/coins/create', async (req, res) => {
    try {
        const {
            userId,
            userEmail,
            userName,
            packageType,
            coinQuantity,
            amount
        } = req.body;

        const adminPb = await getAdminPB();
        const subtotal = amount;
        const taxAmount = Math.round(subtotal * 0.12);
        const finalAmount = subtotal + taxAmount;

        // 1. Create initial record in coin_purchases
        const record = await adminPb.collection('coin_purchases').create({
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            package_type: packageType,
            coin_quantity: coinQuantity,
            original_amount: subtotal,
            subtotal: subtotal,
            tax_percentage: 12,
            tax_amount: taxAmount,
            final_amount: finalAmount,
            payment_status: 'pending'
        });

        // 2. Create Xendit Invoice
        const invoice = await Invoice.createInvoice({
            data: {
                externalId: record.id,
                amount: finalAmount,
                description: `Coin Purchase: ${packageType} (${coinQuantity} Coins)`,
                invoiceDuration: 86400,
                customer: {
                    givenNames: userName,
                    email: userEmail,
                },
                currency: 'IDR',
                successRedirectUrl: `${process.env.FRONTEND_URL}/courses/private-courses?status=coin_success&purchaseId=${record.id}`,
                failureRedirectUrl: `${process.env.FRONTEND_URL}/courses/private-courses?status=failed`,
            }
        });

        // 3. Update record with Invoice ID
        await adminPb.collection('coin_purchases').update(record.id, {
            invoice_id: invoice.id
        });

        res.json({ invoiceUrl: invoice.invoiceUrl });
    } catch (error: any) {
        console.error('Coin Purchase Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create Booking with Coin Payment
app.post('/api/booking/coin-payment', async (req, res) => {
    try {
        const {
            userId,
            courseId,
            courseTitle,
            courseType,
            mentorId,
            mentorName,
            mentorEmail,
            sessionDate,
            sessionTime,
            userName,
            userEmail,
            whatsapp,
            topic,
            duration
        } = req.body;

        const adminPb = await getAdminPB();

        // 1. Verify user coin balance
        const user = await adminPb.collection('users').getOne(userId);
        if ((user.total_coins || 0) < 1) {
            return res.status(400).json({ error: 'Insufficient coin balance' });
        }

        // 2. Generate unique 16-char ID (Function copied for simplicity or move to utils)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let bookingGroupId = '';
        for (let i = 0; i < 16; i++) {
            bookingGroupId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // 3. Create booking record
        const record = await adminPb.collection('bookings').create({
            user_id: userId,
            booking_group_id: bookingGroupId,
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
            session_number: 1,
            total_sessions: 1,
            price_per_session: 0,
            subtotal: 0,
            tax_percentage: 0,
            tax_amount: 0,
            total_amount: 0,
            payment_status: 'pending',
            booking_status: 'pending',
            payment_method: 'coin',
            payment_date: new Date().toISOString()
        });

        // 4. Create meeting record
        await createMeetingForBooking(record.id);

        // 5. Deduct 1 coin from user
        await adminPb.collection('users').update(userId, {
            'total_coins-': 1
        });

        // 6. Update booking to paid (triggers email hook)
        await adminPb.collection('bookings').update(record.id, {
            payment_status: 'paid'
        });

        res.json({ success: true, bookingId: record.id });
    } catch (error: any) {
        console.error('Coin Booking Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Xendit Webhook
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { status, external_id, payment_method, id } = req.body;

        if (status === 'PAID' || status === 'SETTLED') {
            const adminPb = await getAdminPB();

            // Try updating payment_history (Products)
            try {
                await adminPb.collection('payment_history').update(external_id, {
                    payment_status: 'paid',
                    payment_method: payment_method,
                    payment_date: new Date().toISOString(),
                    invoice_id: id
                });

                const payment = await adminPb.collection('payment_history').getOne(external_id);
                await adminPb.collection('products').update(payment.product_id, {
                    'download_count+': 1
                });

                return res.status(200).send('OK (Product)');
            } catch (err: any) {
                if (err.status !== 404) throw err;

                // Try updating bookings
                try {
                    // 1. Create meeting record first
                    await createMeetingForBooking(external_id);

                    // 2. Update booking to paid (triggers email hook)
                    await adminPb.collection('bookings').update(external_id, {
                        payment_status: 'paid',
                        payment_method: payment_method,
                        payment_date: new Date().toISOString(),
                        booking_status: 'pending'
                    });

                    return res.status(200).send('OK (Booking)');
                } catch (bookErr: any) {
                    if (bookErr.status !== 404) throw bookErr;

                    // Try updating coin_purchases
                    try {
                        const coinPurchase = await adminPb.collection('coin_purchases').update(external_id, {
                            payment_status: 'paid',
                            payment_method: payment_method,
                            payment_date: new Date().toISOString()
                        });

                        // Update user's coin balance
                        await adminPb.collection('users').update(coinPurchase.user_id, {
                            'total_coins+': coinPurchase.coin_quantity
                        });

                        return res.status(200).send('OK (Coin Purchase)');
                    } catch (coinErr: any) {
                        if (coinErr.status === 404) {
                            console.error(`Record ${external_id} not found in any collection.`);
                            return res.status(200).send('Record not found, ignoring');
                        }
                        throw coinErr;
                    }
                }
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

// Helper to create a meeting for a successful booking
async function createMeetingForBooking(bookingId: string) {
    const adminPb = await getAdminPB();
    const booking = await adminPb.collection('bookings').getOne(bookingId);

    // Generate unique 8-digit meeting_id
    const generateMeetingId = async (): Promise<string> => {
        const id = Math.floor(10000000 + Math.random() * 90000000).toString();
        const existing = await adminPb.collection('meetings').getList(1, 1, {
            filter: `meeting_id = "${id}"`
        });
        if (existing.totalItems > 0) return generateMeetingId();
        return id;
    };

    const meetingId = await generateMeetingId();
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Format scheduled_at
    // session_date is likely ISO or YYYY-MM-DD
    // session_time is likely HH:mm
    const scheduledAt = new Date(`${booking.session_date.split(' ')[0]}T${booking.session_time}:00`);

    await adminPb.collection('meetings').create({
        meeting_id: meetingId,
        passcode: passcode,
        host_name: booking.mentor_name,
        status: 'scheduled',
        scheduled_at: scheduledAt.toISOString(),
        stared_at: null,
        ended_at: null,
        meeting_name: `${booking.course_title} - ${booking.course_type}`,
        booking_id: bookingId
    });
}

app.listen(port, () => {
    console.log(`Dahar Engineer API running on port ${port}`);
});

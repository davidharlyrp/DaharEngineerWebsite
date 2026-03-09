/**
 * PocketBase JavaScript hook for sending booking confirmation emails.
 * Triggers when a booking's payment_status changes to "paid".
 * Sends separate emails to: Admin, Mentor, and User.
 *
 * Save this file as `pb_hooks/booking_payment_emails.pb.js` on your PocketBase server.
 */

// ─── Constants ──────────────────────────────────────────────────
var ADMIN_EMAIL = "admin@daharengineer.com";

// ─── Helpers ────────────────────────────────────────────────────

function formatCurrency(amount) {
    var n = Math.round(Number(amount) || 0);
    return "Rp " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    var d = new Date(dateStr);
    var months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[d.getUTCDay()] + ", " + d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

function esc(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ─── Email Wrapper ──────────────────────────────────────────────

function wrapEmail(inner, footerText) {
    return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'
        + '<body style="margin:0;padding:0;background:#f4f4f7;font-family:\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,sans-serif;">'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">'
        + '<tr><td align="center">'
        + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">'
        + inner
        + '</table>'
        + '<table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td style="padding:20px 32px;text-align:center;">'
        + '<p style="margin:0 0 4px;font-size:11px;color:#9ca3af;">' + esc(footerText) + '</p>'
        + '<p style="margin:0;font-size:10px;color:#d1d5db;">Dahar Engineer &bull; daharengineer.com</p>'
        + '</td></tr></table>'
        + '</td></tr></table></body></html>';
}

function emailHeader(rightLabel) {
    return '<tr><td style="background:#1e293b;padding:20px 32px;">'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
        + '<td style="text-align:left;vertical-align:middle;"><img src="https://daharengineer.com/Logo.png" alt="Dahar Engineer" width="28" height="28" style="height:28px;width:28px;vertical-align:middle;margin-right:8px;display:inline-block;" /><span style="font-size:16px;font-weight:700;color:#ffffff;vertical-align:middle;">Dahar Engineer</span></td>'
        + '<td style="text-align:right;vertical-align:middle;"><span style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:500;">' + esc(rightLabel) + '</span></td>'
        + '</tr></table></td></tr>';
}

function infoRow(label, value) {
    return '<tr>'
        + '<td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + esc(label) + '</td>'
        + '<td style="padding:5px 0;font-size:12px;color:#111827;font-weight:500;">' + esc(value) + '</td>'
        + '</tr>';
}

function infoRowBold(label, value) {
    return '<tr>'
        + '<td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + esc(label) + '</td>'
        + '<td style="padding:5px 0;font-size:12px;color:#111827;font-weight:600;">' + esc(value) + '</td>'
        + '</tr>';
}

function dividerRow() {
    return '<tr><td colspan="2" style="padding:6px 0 2px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>';
}

function tableCard(rows) {
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:16px;">'
        + '<tr><td style="padding:14px 16px;background:#f9fafb;">'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rows + '</table>'
        + '</td></tr></table>';
}

function sectionLabel(text) {
    return '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#727b56;text-transform:uppercase;letter-spacing:0.5px;">' + esc(text) + '</p>';
}

function noteBox(text) {
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4e8;border-radius:8px;border:1px solid #cdd2bc;">'
        + '<tr><td style="padding:14px 16px;text-align:center;">'
        + '<p style="margin:0;font-size:12px;color:#484d36;line-height:1.5;">' + text + '</p>'
        + '</td></tr></table>';
}

// ─── Template Builders ──────────────────────────────────────────

function buildAdminEmail(b) {
    var sessionDate = formatDate(b.session_date);
    var totalAmount = formatCurrency(b.total_amount);
    var paymentMethod = b.payment_method || "-";

    var inner = emailHeader("Admin Notification");

    // Status banner
    inner += '<tr><td style="background:#727b56;padding:20px 32px;text-align:center;">'
        + '<p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">New Booking Payment Received</p>'
        + '<p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.8);">A new booking has been paid and requires attention</p>'
        + '</td></tr>';

    // Body
    inner += '<tr><td style="padding:24px 32px;">';

    // Booking details
    inner += sectionLabel("Booking Details");
    inner += tableCard(
        infoRowBold("Course", b.course_title)
        + infoRow("Type", b.course_type)
        + infoRow("Topic", b.topic || "-")
        + infoRow("Duration", b.duration || "-")
    );

    // Student & Mentor side by side
    inner += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>'
        + '<td width="48%" valign="top">'
        + sectionLabel("Student")
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">'
        + '<tr><td style="padding:12px 14px;background:#f9fafb;">'
        + '<p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + esc(b.full_name) + '</p>'
        + '<p style="margin:0 0 2px;font-size:11px;color:#6b7280;">' + esc(b.email) + '</p>'
        + '<p style="margin:0;font-size:11px;color:#6b7280;">WA: ' + esc(b.whatsapp) + '</p>'
        + '</td></tr></table></td>'
        + '<td width="4%"></td>'
        + '<td width="48%" valign="top">'
        + sectionLabel("Mentor")
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">'
        + '<tr><td style="padding:12px 14px;background:#f9fafb;">'
        + '<p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + esc(b.mentor_name) + '</p>'
        + '<p style="margin:0;font-size:11px;color:#6b7280;">' + esc(b.mentor_email) + '</p>'
        + '</td></tr></table></td>'
        + '</tr></table>';

    // Schedule & Payment
    inner += sectionLabel("Schedule & Payment");
    inner += tableCard(
        infoRowBold("Date", sessionDate)
        + infoRowBold("Time", b.session_time || "-")
        + infoRow("Payment Method", paymentMethod)
        + dividerRow()
        + '<tr><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;width:120px;">Total Paid</td>'
        + '<td style="padding:5px 0;font-size:13px;color:#727b56;font-weight:700;">' + totalAmount + '</td></tr>'
    );

    inner += '<p style="margin:0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + esc(b.id) + '</p>';
    inner += '</td></tr>';

    return wrapEmail(inner, "This is an automated notification for admin.");
}

function buildMentorEmail(b) {
    var sessionDate = formatDate(b.session_date);

    var inner = emailHeader("Mentor Notification");

    // Greeting
    inner += '<tr><td style="padding:24px 32px 0;">'
        + '<p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + esc(b.mentor_name) + '</strong>,</p>'
        + '<p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">You have a new session booking that has been confirmed. Please review the details below and prepare accordingly.</p>'
        + '</td></tr>';

    // Body
    inner += '<tr><td style="padding:20px 32px;">';

    inner += sectionLabel("Session Details");
    inner += tableCard(
        infoRowBold("Course", b.course_title)
        + infoRow("Type", b.course_type)
        + infoRowBold("Date", sessionDate)
        + infoRowBold("Time", b.session_time || "-")
        + infoRow("Duration", b.duration || "-")
        + infoRow("Topic", b.topic || "-")
    );

    inner += sectionLabel("Student Information");
    inner += tableCard(
        infoRowBold("Name", b.full_name)
        + infoRow("Email", b.email)
        + infoRow("WhatsApp", b.whatsapp)
    );

    inner += noteBox("Please ensure you are available at the scheduled time. Contact the student via WhatsApp if needed.");
    inner += '</td></tr>';

    return wrapEmail(inner, "If you have any questions, contact admin@daharengineer.com");
}

function buildUserEmail(b) {
    var sessionDate = formatDate(b.session_date);
    var subtotal = formatCurrency(b.subtotal);
    var taxAmount = formatCurrency(b.tax_amount);
    var totalAmount = formatCurrency(b.total_amount);
    var taxPct = String(b.tax_percentage || 0);
    var paymentMethod = b.payment_method || "-";

    var inner = emailHeader("Booking Confirmation");

    // Success banner
    inner += '<tr><td style="background:linear-gradient(135deg,#727b56 0%,#8f9774 100%);padding:24px 32px;text-align:center;">'
        + '<p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#ffffff;">Payment Confirmed!</p>'
        + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.85);">Your booking has been successfully processed</p>'
        + '</td></tr>';

    // Greeting
    inner += '<tr><td style="padding:24px 32px 0;">'
        + '<p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + esc(b.full_name) + '</strong>,</p>'
        + '<p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">Thank you for your booking! Your payment has been confirmed. Here are your session details:</p>'
        + '</td></tr>';

    // Body
    inner += '<tr><td style="padding:20px 32px;">';

    inner += sectionLabel("Session Information");
    inner += tableCard(
        infoRowBold("Course", b.course_title)
        + infoRow("Type", b.course_type)
        + infoRowBold("Mentor", b.mentor_name)
        + infoRowBold("Date", sessionDate)
        + infoRowBold("Time", b.session_time || "-")
        + infoRow("Duration", b.duration || "-")
        + infoRow("Topic", b.topic || "-")
    );

    inner += sectionLabel("Payment Summary");
    inner += tableCard(
        infoRow("Subtotal", subtotal)
        + infoRow("Tax (" + taxPct + "%)", taxAmount)
        + infoRow("Payment Method", paymentMethod)
        + dividerRow()
        + '<tr><td style="padding:5px 0;font-size:14px;color:#111827;font-weight:700;width:120px;">Total Paid</td>'
        + '<td style="padding:5px 0;font-size:14px;color:#727b56;font-weight:700;">' + totalAmount + '</td></tr>'
    );

    inner += noteBox('Your mentor will contact you before the session. Make sure your WhatsApp is reachable at <strong>' + esc(b.whatsapp) + '</strong>.');
    inner += '<p style="margin:16px 0 0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + esc(b.id) + '</p>';
    inner += '</td></tr>';

    return wrapEmail(inner, "If you have questions, contact us at admin@daharengineer.com");
}

// ─── Send Emails Function ───────────────────────────────────────

function sendBookingEmails(app, record) {
    var b = {
        id: record.get("id") || record.id,
        course_title: record.get("course_title") || "",
        course_type: record.get("course_type") || "",
        full_name: record.get("full_name") || "",
        email: record.get("email") || "",
        whatsapp: record.get("whatsapp") || "",
        mentor_name: record.get("mentor_name") || "",
        mentor_email: record.get("mentor_email") || "",
        session_date: record.get("session_date") || "",
        session_time: record.get("session_time") || "",
        topic: record.get("topic") || "",
        duration: record.get("duration") || "",
        subtotal: record.get("subtotal") || 0,
        tax_percentage: record.get("tax_percentage") || 0,
        tax_amount: record.get("tax_amount") || 0,
        total_amount: record.get("total_amount") || 0,
        payment_method: record.get("payment_method") || "-",
    };

    var senderAddress = app.settings().meta.senderAddress;
    var senderName = app.settings().meta.senderName;
    var mailClient = app.newMailClient();

    // 1. Send to Admin
    try {
        var adminMsg = new MailerMessage({
            from: { address: senderAddress, name: senderName },
            to: [{ address: ADMIN_EMAIL }],
            subject: "New Booking Payment - " + b.course_title + " (" + b.full_name + ")",
            html: buildAdminEmail(b),
        });
        mailClient.send(adminMsg);
        console.log("[BookingEmail] Sent admin email for booking " + b.id);
    } catch (err) {
        console.error("[BookingEmail] Failed to send admin email:", err);
    }

    // 2. Send to Mentor
    if (b.mentor_email) {
        try {
            var mentorMsg = new MailerMessage({
                from: { address: senderAddress, name: senderName },
                to: [{ address: b.mentor_email }],
                subject: "New Session Booking - " + b.course_title + " (" + b.full_name + ")",
                html: buildMentorEmail(b),
            });
            mailClient.send(mentorMsg);
            console.log("[BookingEmail] Sent mentor email to " + b.mentor_email + " for booking " + b.id);
        } catch (err) {
            console.error("[BookingEmail] Failed to send mentor email:", err);
        }
    }

    // 3. Send to User
    if (b.email) {
        try {
            var userMsg = new MailerMessage({
                from: { address: senderAddress, name: senderName },
                to: [{ address: b.email }],
                subject: "Booking Confirmed - " + b.course_title + " | Dahar Engineer",
                html: buildUserEmail(b),
            });
            mailClient.send(userMsg);
            console.log("[BookingEmail] Sent user email to " + b.email + " for booking " + b.id);
        } catch (err) {
            console.error("[BookingEmail] Failed to send user email:", err);
        }
    }
}

// ─── PocketBase Hook: On Record Update ──────────────────────────
// Triggers when a booking record is updated and payment_status changes to "paid"

onRecordUpdateExecute((e) => {
    var record = e.record;
    var original = record.original();

    var newStatus = record.get("payment_status");
    var oldStatus = original.get("payment_status");

    // Continue the update first
    e.next();

    // Send emails only when payment_status just changed to "paid"
    if (newStatus === "paid" && oldStatus !== "paid") {
        try {
            sendBookingEmails(e.app, record);
        } catch (err) {
            console.error("[BookingEmail] Error in update hook:", err);
        }
    }
}, "bookings");

// ─── PocketBase Hook: On Record Create ──────────────────────────
// Handles coin-payment bookings that are created with payment_status = "paid" directly

onRecordCreateExecute((e) => {
    var record = e.record;

    // Continue the create first
    e.next();

    // Send emails if created with payment_status "paid" (e.g. coin payment)
    if (record.get("payment_status") === "paid") {
        try {
            sendBookingEmails(e.app, record);
        } catch (err) {
            console.error("[BookingEmail] Error in create hook:", err);
        }
    }
}, "bookings");

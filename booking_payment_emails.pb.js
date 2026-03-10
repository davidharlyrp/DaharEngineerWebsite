/**
 * PocketBase JavaScript hook for sending booking confirmation emails.
 * Triggers when a booking's payment_status becomes "paid".
 * Sends emails to: Admin, Mentor, and User.
 *
 * IMPORTANT: All logic is inlined inside each hook callback because
 * PocketBase Goja runtime isolates hook callback scope from file scope.
 *
 * Save this file as `pb_hooks/booking_payment_emails.pb.js`
 */

console.log("[BookingEmail] Hook file loaded 1.0.1.");

// ─── UPDATE Hook ────────────────────────────────────────────────
onRecordAfterUpdateSuccess(function (e) {
    try {
        var record = e.record;
        var currentStatus = record.get("payment_status");
        console.log("[BookingEmail] UPDATE: id=" + record.id + " status=" + currentStatus);
        if (currentStatus !== "paid") return;

        var skipSend = false;
        try {
            var orig = record.original();
            if (orig && orig.get("payment_status") === "paid") {
                console.log("[BookingEmail] Already paid, skip.");
                skipSend = true;
            }
        } catch (_) { }
        if (skipSend) return;

        // ── helpers ──
        var ADMIN_EMAIL = "admin@daharengineer.com";
        var fmtCur = function (a) { var n = Math.round(Number(a) || 0); return "Rp " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
        var fmtDate = function (ds) {
            if (!ds) return "-";
            var d = new Date(ds);
            var mo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            var dy = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            return dy[d.getUTCDay()] + ", " + d.getUTCDate() + " " + mo[d.getUTCMonth()] + " " + d.getUTCFullYear();
        };
        var h = function (s) { if (!s) return ""; return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

        // ── email parts ──
        var wrap = function (inner, ft) {
            return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
                + '<body style="margin:0;padding:0;background:#f4f4f7;font-family:\'Segoe UI\',Roboto,Arial,sans-serif;">'
                + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;"><tr><td align="center">'
                + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">'
                + inner + '</table>'
                + '<table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td style="padding:20px 32px;text-align:center;">'
                + '<p style="margin:0 0 4px;font-size:11px;color:#9ca3af;">' + h(ft) + '</p>'
                + '<p style="margin:0;font-size:10px;color:#d1d5db;">Dahar Engineer &bull; daharengineer.com</p>'
                + '</td></tr></table></td></tr></table></body></html>';
        };
        var hdr = function (rl) {
            return '<tr><td style="background:#1e293b;padding:20px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
                + '<td style="text-align:left;vertical-align:middle;"><img src="https://daharengineer.com/Logo.png" alt="DE" width="28" height="28" style="height:28px;width:28px;vertical-align:middle;margin-right:8px;display:inline-block;"/><span style="font-size:16px;font-weight:700;color:#fff;vertical-align:middle;">Dahar Engineer</span></td>'
                + '<td style="text-align:right;vertical-align:middle;"><span style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:500;">' + h(rl) + '</span></td>'
                + '</tr></table></td></tr>';
        };
        var ir = function (l, v) { return '<tr><td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + h(l) + '</td><td style="padding:5px 0;font-size:12px;color:#111827;font-weight:500;">' + h(v) + '</td></tr>'; };
        var irb = function (l, v) { return '<tr><td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + h(l) + '</td><td style="padding:5px 0;font-size:12px;color:#111827;font-weight:600;">' + h(v) + '</td></tr>'; };
        var dvd = '<tr><td colspan="2" style="padding:6px 0 2px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>';
        var tc = function (r) { return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:16px;"><tr><td style="padding:14px 16px;background:#f9fafb;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + r + '</table></td></tr></table>'; };
        var sl = function (t) { return '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#727b56;text-transform:uppercase;letter-spacing:0.5px;">' + h(t) + '</p>'; };
        var nb = function (t) { return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4e8;border-radius:8px;border:1px solid #cdd2bc;"><tr><td style="padding:14px 16px;text-align:center;"><p style="margin:0;font-size:12px;color:#484d36;line-height:1.5;">' + t + '</p></td></tr></table>'; };

        // ── booking data ──
        var b = {
            id: record.id || "", course_title: record.get("course_title") || "", course_type: record.get("course_type") || "",
            full_name: record.get("full_name") || "", email: record.get("email") || "", whatsapp: record.get("whatsapp") || "",
            mentor_name: record.get("mentor_name") || "", mentor_email: record.get("mentor_email") || "",
            session_date: record.get("session_date") || "", session_time: record.get("session_time") || "",
            topic: record.get("topic") || "", duration: record.get("duration") || "",
            subtotal: record.get("subtotal") || 0, tax_percentage: record.get("tax_percentage") || 0,
            tax_amount: record.get("tax_amount") || 0, total_amount: record.get("total_amount") || 0,
            payment_method: record.get("payment_method") || "-"
        };
        var sd = fmtDate(b.session_date);
        var ta = fmtCur(b.total_amount);

        // ── build admin email ──
        var adminHtml = (function () {
            var i = hdr("Admin Notification");
            i += '<tr><td style="background:#727b56;padding:20px 32px;text-align:center;"><p style="margin:0;font-size:20px;font-weight:700;color:#fff;">New Booking Payment Received</p><p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.8);">A new booking has been paid</p></td></tr>';
            i += '<tr><td style="padding:24px 32px;">';
            i += sl("Booking Details") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + ir("Topic", b.topic || "-") + ir("Duration", b.duration || "-"));
            i += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td width="48%" valign="top">' + sl("Student") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"><tr><td style="padding:12px 14px;background:#f9fafb;"><p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + h(b.full_name) + '</p><p style="margin:0 0 2px;font-size:11px;color:#6b7280;">' + h(b.email) + '</p><p style="margin:0;font-size:11px;color:#6b7280;">WA: ' + h(b.whatsapp) + '</p></td></tr></table></td><td width="4%"></td><td width="48%" valign="top">' + sl("Mentor") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"><tr><td style="padding:12px 14px;background:#f9fafb;"><p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + h(b.mentor_name) + '</p><p style="margin:0;font-size:11px;color:#6b7280;">' + h(b.mentor_email) + '</p></td></tr></table></td></tr></table>';
            i += sl("Schedule & Payment") + tc(irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Payment Method", b.payment_method) + dvd + '<tr><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;width:120px;">Total Paid</td><td style="padding:5px 0;font-size:13px;color:#727b56;font-weight:700;">' + ta + '</td></tr>');
            i += '<p style="margin:0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + h(b.id) + '</p></td></tr>';
            return wrap(i, "This is an automated notification for admin.");
        })();

        // ── build mentor email ──
        var mentorHtml = (function () {
            var i = hdr("Mentor Notification");
            i += '<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + h(b.mentor_name) + '</strong>,</p><p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">You have a new session booking. Please review the details below.</p></td></tr>';
            i += '<tr><td style="padding:20px 32px;">';
            i += sl("Session Details") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Duration", b.duration || "-") + ir("Topic", b.topic || "-"));
            i += sl("Student Information") + tc(irb("Name", b.full_name) + ir("Email", b.email) + ir("WhatsApp", b.whatsapp));

            // Fetch meeting link
            try {
                var meeting = e.app.dao().findFirstRecordByData("meetings", "booking_id", record.id);
                if (meeting) {
                    var mid = meeting.get("meeting_id");
                    i += sl("Meeting Link") + nb('<a href="https://meet.daharengineer.com/meet/' + mid + '" style="color:#727b56;font-weight:700;text-decoration:none;">https://meet.daharengineer.com/meet/' + mid + '</a>');
                }
            } catch (_) { }

            i += nb("Please ensure you are available at the scheduled time. Contact the student via WhatsApp if needed.");
            i += '</td></tr>';
            return wrap(i, "If you have any questions, contact admin@daharengineer.com");
        })();

        // ── build user email ──
        var userHtml = (function () {
            var i = hdr("Booking Confirmation");
            i += '<tr><td style="background:linear-gradient(135deg,#727b56 0%,#8f9774 100%);padding:24px 32px;text-align:center;"><p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#fff;">Payment Confirmed!</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,0.85);">Your booking has been successfully processed</p></td></tr>';
            i += '<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + h(b.full_name) + '</strong>,</p><p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">Thank you for your booking! Your payment has been confirmed.</p></td></tr>';
            i += '<tr><td style="padding:20px 32px;">';
            i += sl("Session Information") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + irb("Mentor", b.mentor_name) + irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Duration", b.duration || "-") + ir("Topic", b.topic || "-"));
            i += sl("Payment Summary") + tc(ir("Subtotal", fmtCur(b.subtotal)) + ir("Tax (" + String(b.tax_percentage || 0) + "%)", fmtCur(b.tax_amount)) + ir("Payment Method", b.payment_method) + dvd + '<tr><td style="padding:5px 0;font-size:14px;color:#111827;font-weight:700;width:120px;">Total Paid</td><td style="padding:5px 0;font-size:14px;color:#727b56;font-weight:700;">' + ta + '</td></tr>');

            // Fetch meeting link
            try {
                var meeting = e.app.dao().findFirstRecordByData("meetings", "booking_id", record.id);
                if (meeting) {
                    var mid = meeting.get("meeting_id");
                    i += sl("Meeting Link") + nb('<a href="https://meet.daharengineer.com/meet/' + mid + '" style="color:#727b56;font-weight:700;text-decoration:none;">https://meet.daharengineer.com/meet/' + mid + '</a>');
                }
            } catch (_) { }

            i += nb('Your mentor will contact you before the session. Make sure your WhatsApp is reachable at <strong>' + h(b.whatsapp) + '</strong>.');
            i += '<p style="margin:16px 0 0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + h(b.id) + '</p></td></tr>';
            return wrap(i, "If you have questions, contact us at admin@daharengineer.com");
        })();

        // ── send emails ──
        var sa = e.app.settings().meta.senderAddress;
        var sn = e.app.settings().meta.senderName;
        var mc = e.app.newMailClient();

        try {
            console.log("[BookingEmail] Sending admin email...");
            mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: ADMIN_EMAIL }], subject: "New Booking Payment - " + b.course_title + " (" + b.full_name + ")", html: adminHtml }));
            console.log("[BookingEmail] Admin email SENT.");
        } catch (err) { console.error("[BookingEmail] Admin FAILED:", String(err)); }

        if (b.mentor_email) {
            try {
                console.log("[BookingEmail] Sending mentor email to " + b.mentor_email);
                mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: b.mentor_email }], subject: "New Session Booking - " + b.course_title + " (" + b.full_name + ")", html: mentorHtml }));
                console.log("[BookingEmail] Mentor email SENT.");
            } catch (err) { console.error("[BookingEmail] Mentor FAILED:", String(err)); }
        }

        if (b.email) {
            try {
                console.log("[BookingEmail] Sending user email to " + b.email);
                mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: b.email }], subject: "Booking Confirmed - " + b.course_title + " | Dahar Engineer", html: userHtml }));
                console.log("[BookingEmail] User email SENT.");
            } catch (err) { console.error("[BookingEmail] User FAILED:", String(err)); }
        }

        console.log("[BookingEmail] Done for booking " + b.id);
    } catch (err) {
        console.error("[BookingEmail] UPDATE hook error:", String(err));
    }
}, "bookings");


// ─── CREATE Hook (for coin payments created as "paid") ──────────
onRecordAfterCreateSuccess(function (e) {
    try {
        var record = e.record;
        var currentStatus = record.get("payment_status");
        console.log("[BookingEmail] CREATE: id=" + record.id + " status=" + currentStatus);
        if (currentStatus !== "paid") return;

        // ── helpers ──
        var ADMIN_EMAIL = "admin@daharengineer.com";
        var fmtCur = function (a) { var n = Math.round(Number(a) || 0); return "Rp " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
        var fmtDate = function (ds) {
            if (!ds) return "-";
            var d = new Date(ds);
            var mo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            var dy = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            return dy[d.getUTCDay()] + ", " + d.getUTCDate() + " " + mo[d.getUTCMonth()] + " " + d.getUTCFullYear();
        };
        var h = function (s) { if (!s) return ""; return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

        // ── email parts ──
        var wrap = function (inner, ft) {
            return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
                + '<body style="margin:0;padding:0;background:#f4f4f7;font-family:\'Segoe UI\',Roboto,Arial,sans-serif;">'
                + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;"><tr><td align="center">'
                + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">'
                + inner + '</table>'
                + '<table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td style="padding:20px 32px;text-align:center;">'
                + '<p style="margin:0 0 4px;font-size:11px;color:#9ca3af;">' + h(ft) + '</p>'
                + '<p style="margin:0;font-size:10px;color:#d1d5db;">Dahar Engineer &bull; daharengineer.com</p>'
                + '</td></tr></table></td></tr></table></body></html>';
        };
        var hdr = function (rl) {
            return '<tr><td style="background:#1e293b;padding:20px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
                + '<td style="text-align:left;vertical-align:middle;"><img src="https://daharengineer.com/Logo.png" alt="DE" width="28" height="28" style="height:28px;width:28px;vertical-align:middle;margin-right:8px;display:inline-block;"/><span style="font-size:16px;font-weight:700;color:#fff;vertical-align:middle;">Dahar Engineer</span></td>'
                + '<td style="text-align:right;vertical-align:middle;"><span style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:500;">' + h(rl) + '</span></td>'
                + '</tr></table></td></tr>';
        };
        var ir = function (l, v) { return '<tr><td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + h(l) + '</td><td style="padding:5px 0;font-size:12px;color:#111827;font-weight:500;">' + h(v) + '</td></tr>'; };
        var irb = function (l, v) { return '<tr><td style="padding:5px 0;font-size:12px;color:#6b7280;width:120px;">' + h(l) + '</td><td style="padding:5px 0;font-size:12px;color:#111827;font-weight:600;">' + h(v) + '</td></tr>'; };
        var dvd = '<tr><td colspan="2" style="padding:6px 0 2px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>';
        var tc = function (r) { return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:16px;"><tr><td style="padding:14px 16px;background:#f9fafb;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + r + '</table></td></tr></table>'; };
        var sl = function (t) { return '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#727b56;text-transform:uppercase;letter-spacing:0.5px;">' + h(t) + '</p>'; };
        var nb = function (t) { return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4e8;border-radius:8px;border:1px solid #cdd2bc;"><tr><td style="padding:14px 16px;text-align:center;"><p style="margin:0;font-size:12px;color:#484d36;line-height:1.5;">' + t + '</p></td></tr></table>'; };

        // ── booking data ──
        var b = {
            id: record.id || "", course_title: record.get("course_title") || "", course_type: record.get("course_type") || "",
            full_name: record.get("full_name") || "", email: record.get("email") || "", whatsapp: record.get("whatsapp") || "",
            mentor_name: record.get("mentor_name") || "", mentor_email: record.get("mentor_email") || "",
            session_date: record.get("session_date") || "", session_time: record.get("session_time") || "",
            topic: record.get("topic") || "", duration: record.get("duration") || "",
            subtotal: record.get("subtotal") || 0, tax_percentage: record.get("tax_percentage") || 0,
            tax_amount: record.get("tax_amount") || 0, total_amount: record.get("total_amount") || 0,
            payment_method: record.get("payment_method") || "-"
        };
        var sd = fmtDate(b.session_date);
        var ta = fmtCur(b.total_amount);

        // ── build admin email ──
        var adminHtml = (function () {
            var i = hdr("Admin Notification");
            i += '<tr><td style="background:#727b56;padding:20px 32px;text-align:center;"><p style="margin:0;font-size:20px;font-weight:700;color:#fff;">New Booking Payment Received</p><p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.8);">A new booking has been paid</p></td></tr>';
            i += '<tr><td style="padding:24px 32px;">';
            i += sl("Booking Details") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + ir("Topic", b.topic || "-") + ir("Duration", b.duration || "-"));
            i += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td width="48%" valign="top">' + sl("Student") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"><tr><td style="padding:12px 14px;background:#f9fafb;"><p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + h(b.full_name) + '</p><p style="margin:0 0 2px;font-size:11px;color:#6b7280;">' + h(b.email) + '</p><p style="margin:0;font-size:11px;color:#6b7280;">WA: ' + h(b.whatsapp) + '</p></td></tr></table></td><td width="4%"></td><td width="48%" valign="top">' + sl("Mentor") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"><tr><td style="padding:12px 14px;background:#f9fafb;"><p style="margin:0 0 2px;font-size:13px;color:#111827;font-weight:600;">' + h(b.mentor_name) + '</p><p style="margin:0;font-size:11px;color:#6b7280;">' + h(b.mentor_email) + '</p></td></tr></table></td></tr></table>';
            i += sl("Schedule & Payment") + tc(irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Payment Method", b.payment_method) + dvd + '<tr><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;width:120px;">Total Paid</td><td style="padding:5px 0;font-size:13px;color:#727b56;font-weight:700;">' + ta + '</td></tr>');
            i += '<p style="margin:0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + h(b.id) + '</p></td></tr>';
            return wrap(i, "This is an automated notification for admin.");
        })();

        // ── build mentor email ──
        var mentorHtml = (function () {
            var i = hdr("Mentor Notification");
            i += '<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + h(b.mentor_name) + '</strong>,</p><p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">You have a new session booking. Please review the details below.</p></td></tr>';
            i += '<tr><td style="padding:20px 32px;">';
            i += sl("Session Details") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Duration", b.duration || "-") + ir("Topic", b.topic || "-"));
            i += sl("Student Information") + tc(irb("Name", b.full_name) + ir("Email", b.email) + ir("WhatsApp", b.whatsapp));

            // Fetch meeting link
            try {
                var meeting = e.app.dao().findFirstRecordByData("meetings", "booking_id", record.id);
                if (meeting) {
                    var mid = meeting.get("meeting_id");
                    i += sl("Meeting Link") + nb('<a href="https://meet.daharengineer.com/meet/' + mid + '" style="color:#727b56;font-weight:700;text-decoration:none;">https://meet.daharengineer.com/meet/' + mid + '</a>');
                }
            } catch (_) { }

            i += nb("Please ensure you are available at the scheduled time. Contact the student via WhatsApp if needed.");
            i += '</td></tr>';
            return wrap(i, "If you have any questions, contact admin@daharengineer.com");
        })();

        // ── build user email ──
        var userHtml = (function () {
            var i = hdr("Booking Confirmation");
            i += '<tr><td style="background:linear-gradient(135deg,#727b56 0%,#8f9774 100%);padding:24px 32px;text-align:center;"><p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#fff;">Payment Confirmed!</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,0.85);">Your booking has been successfully processed</p></td></tr>';
            i += '<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 4px;font-size:14px;color:#111827;">Hi <strong>' + h(b.full_name) + '</strong>,</p><p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">Thank you for your booking! Your payment has been confirmed.</p></td></tr>';
            i += '<tr><td style="padding:20px 32px;">';
            i += sl("Session Information") + tc(irb("Course", b.course_title) + ir("Type", b.course_type) + irb("Mentor", b.mentor_name) + irb("Date", sd) + irb("Time", b.session_time || "-") + ir("Duration", b.duration || "-") + ir("Topic", b.topic || "-"));
            i += sl("Payment Summary") + tc(ir("Subtotal", fmtCur(b.subtotal)) + ir("Tax (" + String(b.tax_percentage || 0) + "%)", fmtCur(b.tax_amount)) + ir("Payment Method", b.payment_method) + dvd + '<tr><td style="padding:5px 0;font-size:14px;color:#111827;font-weight:700;width:120px;">Total Paid</td><td style="padding:5px 0;font-size:14px;color:#727b56;font-weight:700;">' + ta + '</td></tr>');

            // Fetch meeting link
            try {
                var meeting = e.app.dao().findFirstRecordByData("meetings", "booking_id", record.id);
                if (meeting) {
                    var mid = meeting.get("meeting_id");
                    i += sl("Meeting Link") + nb('<a href="https://meet.daharengineer.com/meet/' + mid + '" style="color:#727b56;font-weight:700;text-decoration:none;">https://meet.daharengineer.com/meet/' + mid + '</a>');
                }
            } catch (_) { }

            i += nb('Your mentor will contact you before the session. Make sure your WhatsApp is reachable at <strong>' + h(b.whatsapp) + '</strong>.');
            i += '<p style="margin:16px 0 0;font-size:10px;color:#9ca3af;text-align:center;">Booking ID: ' + h(b.id) + '</p></td></tr>';
            return wrap(i, "If you have questions, contact us at admin@daharengineer.com");
        })();

        // ── send emails ──
        var sa = e.app.settings().meta.senderAddress;
        var sn = e.app.settings().meta.senderName;
        var mc = e.app.newMailClient();

        try {
            console.log("[BookingEmail] Sending admin email...");
            mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: ADMIN_EMAIL }], subject: "New Booking Payment - " + b.course_title + " (" + b.full_name + ")", html: adminHtml }));
            console.log("[BookingEmail] Admin email SENT.");
        } catch (err) { console.error("[BookingEmail] Admin FAILED:", String(err)); }

        if (b.mentor_email) {
            try {
                console.log("[BookingEmail] Sending mentor email to " + b.mentor_email);
                mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: b.mentor_email }], subject: "New Session Booking - " + b.course_title + " (" + b.full_name + ")", html: mentorHtml }));
                console.log("[BookingEmail] Mentor email SENT.");
            } catch (err) { console.error("[BookingEmail] Mentor FAILED:", String(err)); }
        }

        if (b.email) {
            try {
                console.log("[BookingEmail] Sending user email to " + b.email);
                mc.send(new MailerMessage({ from: { address: sa, name: sn }, to: [{ address: b.email }], subject: "Booking Confirmed - " + b.course_title + " | Dahar Engineer", html: userHtml }));
                console.log("[BookingEmail] User email SENT.");
            } catch (err) { console.error("[BookingEmail] User FAILED:", String(err)); }
        }

        console.log("[BookingEmail] Done for booking " + b.id);
    } catch (err) {
        console.error("[BookingEmail] CREATE hook error:", String(err));
    }
}, "bookings");

console.log("[BookingEmail] Hooks registered OK.");

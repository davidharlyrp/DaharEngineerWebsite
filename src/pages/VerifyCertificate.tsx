import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Award, Calendar, User, BookOpen, ArrowLeft } from 'lucide-react';
import { pb } from '@/lib/pocketbase/client';
import { SEO } from '@/components/seo/SEO';

interface CertificateData {
    id: string;
    userName: string;
    courseTitle: string;
    completedAt: string;
    certificateId: string;
}

export default function VerifyCertificate() {
    const params = useParams();
    const certId = params['*']; // Get full ID from wildcard route

    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!certId) {
                setError('No certificate ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Ensure ID exactly matches what's in DB (including leading slash if present)
                const decodedId = decodeURIComponent(certId || '');
                const cleanId = decodedId.startsWith('DE/') ? `/${decodedId}` : decodedId;

                console.group('--- DEBUG VERIFICATION ---');
                console.log('Raw certId from URL:', certId);
                console.log('Decoded certId:', decodedId);
                console.log('Final Clean ID for Search:', cleanId);
                console.log('PB URL:', pb.baseUrl);
                console.log('Is User Auth:', pb.authStore.isValid);

                // 1. Try search with filter
                const result = await pb.collection('online_course_progress').getList(1, 1, {
                    filter: `certificateId = "${cleanId}"`,
                    expand: 'userId,courseId'
                });

                console.log('Search with filter result:', result);

                if (result.items.length > 0) {
                    const record = result.items[0];
                    console.log('Match found!', record);
                    setCertificate({
                        id: record.id,
                        userName: record.expand?.userId?.name || 'Anonymous Student',
                        courseTitle: record.expand?.courseId?.title || 'Engineering Course',
                        completedAt: record.completedAt,
                        certificateId: record.certificateId
                    });
                } else {
                    console.warn('No record found with ID:', cleanId);

                    // 2. Fall-back: Try to list ANY record to check collection accessibility
                    console.log('Trying to list ANY record in online_course_progress...');
                    const allRecords = await pb.collection('online_course_progress').getList(1, 5);
                    console.log('Raw List (all):', allRecords);

                    if (allRecords.items.length === 0) {
                        setError('Database kosong atau akses ditolak. Periksa API Rules.');
                    } else {
                        setError('Sertifikat tidak ditemukan dalam database kami.');
                    }
                }
                console.groupEnd();
            } catch (err: any) {
                console.groupEnd();
                console.error('Detailed Verification Error:', err);
                if (err.status === 403 || err.status === 400) {
                    setError('Akses ditolak oleh database. Silakan periksa API Rules di PocketBase.');
                } else {
                    setError(`Gagal memverifikasi: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [certId]);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <SEO
                title="Verify Certificate | Dahar Engineer"
                description="Verify the authenticity of Dahar Engineer certificates."
            />

            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-army-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-army-500/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-xl z-10">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/logo.png" className="w-10 h-10" alt="Logo" />
                        <span className="text-xl font-bold tracking-tighter group-hover:text-army-400 transition-colors">
                            DAHAR ENGINEER
                        </span>
                    </Link>
                </div>

                <div className="bg-secondary/10 border border-border/10 rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-sm relative overflow-hiddenGroup">
                    {loading ? (
                        <div className="flex flex-col items-center py-12">
                            <Loader2 className="w-10 h-10 text-army-500 animate-spin mb-4" />
                            <p className="text-muted-foreground animate-pulse">Verifying certificate...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                            <p className="text-muted-foreground mb-8">{error}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm text-army-400 hover:text-army-300 font-bold uppercase tracking-tight transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    ) : certificate ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-army-500/10 rounded-full flex items-center justify-center mb-6 border border-army-500/20 relative">
                                    <CheckCircle2 className="w-12 h-12 text-army-500 scale-110" />
                                    <div className="absolute inset-0 border-4 border-army-500/20 rounded-full animate-ping" />
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight mb-2">Certificate Verified</h1>
                                <p className="text-army-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Official Recognition</p>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent mb-8" />

                                <div className="w-full space-y-6 text-left">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <User className="w-5 h-5 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Recipient</p>
                                            <p className="text-lg font-bold">{certificate.userName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <BookOpen className="w-5 h-5 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Course Completed</p>
                                            <p className="text-lg font-bold">{certificate.courseTitle}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1 flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Issue Date</p>
                                                <p className="font-bold">{formatDate(certificate.completedAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <Award className="w-5 h-5 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-1">ID Number</p>
                                                <p className="font-bold font-mono text-sm">{certificate.certificateId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 w-full">
                                    <Link
                                        to="/"
                                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-army-700 hover:bg-army-600 font-bold uppercase text-[11px] tracking-tight transition-all shadow-xl shadow-army-700/20"
                                    >
                                        Explore Dahar Engineer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <p className="text-center mt-8 text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} PT. Dahar Engineer Consultant. All Rights Reserved.
                </p>
            </div>
        </div>
    );
}

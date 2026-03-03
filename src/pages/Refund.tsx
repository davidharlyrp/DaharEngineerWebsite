import { SectionReveal } from '@/components/ui-custom';

export default function Refund() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-4xl mx-auto">
                <SectionReveal>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">Refund Policy</h1>
                        <p className="text-muted-foreground italic text-sm">Last Updated: January 2026</p>
                    </div>
                </SectionReveal>

                <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
                    <SectionReveal delay={0.1}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">1. Transparansi Layanan</h2>
                            <p>
                                Di Dahar Engineer, kami berkomitmen untuk memberikan kualitas terbaik dalam setiap kursus, konsultasi, dan produk digital. Kebijakan pengembalian dana ini kami susun untuk menjaga keadilan bagi pengguna dan keberlangsungan operasional kami.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">2. Kursus Privat & Konsultasi</h2>
                            <p className="mb-3 italic text-xs border-l-2 border-army-500 pl-4 py-1 bg-army-500/5 mb-4">
                                Penting: Pengembalian dana tidak dimungkinkan setelah sesi dimulai atau link materi dikirimkan.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>Pembatalan oleh Pengguna:</strong> Pembatalan lebih dari 24 jam sebelum jadwal akan dikembalikan dalam bentuk kredit koin yang dapat digunakan kembali.
                                </li>
                                <li>
                                    <strong>Pembatalan oleh Mentor:</strong> Jika mentor membatalkan jadwal secara sepihak dan tidak ada kesepakatan jadwal pengganti, kami akan mengembalikan koin secara penuh ke akun Anda, jika anda menggunakan koin untuk mem-<span className='italic'>booking</span> kursus. Jika anda menggunakan uang untuk mem-<span className='italic'>booking</span> kursus, kami akan mengembalikan uang secara penuh ke akun Anda dengan segera max 2x24 jam kerja melalui bank transfer.
                                </li>
                            </ul>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">3. Produk Digital (Store)</h2>
                            <p>
                                Karena sifat produk digital yang dapat diunduh langsung setelah pembayaran (<span className='italic'>instant download</span>), kami umumnya tidak melayani pengembalian dana untuk produk digital. Harap periksa rincian produk, fitur, dan dokumentasi sebelum melakukan pembelian. Kami memberikan pengecualian jika file yang diunduh terbukti rusak atau tidak dapat dibuka setelah tim kami memverifikasi laporan Anda.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">4. Sistem Koin</h2>
                            <p>
                                Pembelian koin (Coin Packages) adalah final dan tidak dapat diuangkan kembali. Koin tidak memiliki masa kedaluwarsa dan dapat digunakan kapan saja untuk memesan kursus atau layanan yang didukung pada platform Dahar Engineer.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.5}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">5. Cara Mengajukan Laporan</h2>
                            <p>
                                Jika Anda merasa ada ketidaksesuaian layanan atau kendala teknis dalam mengakses produk yang dibeli, silakan hubungi kami melalui WhatsApp atau email resmi kami. Tim admin kami akan meninjau laporan Anda dalam waktu maksimal 2x24 jam kerja dengan pendekatan kekeluargaan dan profesional.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.6}>
                        <section className="pt-10 border-t border-border/30">
                            <p className="italic text-center">
                                Terima kasih atas pengertian Anda. Kami selalu berupaya untuk memberikan nilai yang sepadan dengan investasi waktu dan biaya yang Anda keluarkan di Dahar Engineer.
                            </p>
                        </section>
                    </SectionReveal>
                </div>
            </div>
        </div>
    );
}

import { SectionReveal } from '@/components/ui-custom';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-4xl mx-auto">
                <SectionReveal>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">Privacy Policy</h1>
                        <p className="text-muted-foreground italic text-sm">Last Updated: January 2026</p>
                    </div>
                </SectionReveal>

                <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
                    <SectionReveal delay={0.1}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">1. Komitmen Privasi Kami</h2>
                            <p>
                                Dahar Engineer menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami. Kami hanya mengumpulkan informasi yang benar-benar dibutuhkan untuk memberikan layanan terbaik bagi kebutuhan teknik Anda.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">2. Informasi yang Kami Kumpulkan</h2>
                            <p className="mb-3">
                                Kami mengumpulkan informasi yang Anda berikan secara langsung saat Anda mendaftar, memesan kursus, atau menghubungi kami:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Informasi Identitas: Nama, alamat email, dan nomor WhatsApp.</li>
                                <li>Informasi Transaksi: Detail pembayaran (diproses melalui gerbang pembayaran aman seperti Xendit).</li>
                                <li>Data Akademik & Profesional: Kursus yang diikuti dan riwayat konsultasi.</li>
                            </ul>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">3. Penggunaan Informasi</h2>
                            <p className="mb-3">Informasi Anda digunakan untuk:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Memproses pesanan dan akses ke produk digital.</li>
                                <li>Menghubungi Anda terkait jadwal konsultasi atau update kursus.</li>
                                <li>Meningkatkan kualitas konten dan pengalaman pengguna di website kami.</li>
                                <li>Memastikan keamanan akun dan mencegah aktivitas ilegal.</li>
                            </ul>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">4. Keamanan Data</h2>
                            <p>
                                Kami menerapkan langkah-langkah keamanan teknis dan organisasional untuk melindungi data Anda. Kata sandi akun Anda disimpan dalam bentuk terenkripsi, dan transaksi keuangan diproses melalui koneksi aman standar industri. Namun, harap diingat bahwa tidak ada metode transmisi data melalui internet yang 100% aman.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.5}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">5. Pembagian Informasi Pihak Ketiga</h2>
                            <p>
                                Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan kepada penyedia layanan eksternal yang esensial (seperti Xendit untuk memproses pembayaran). Selain itu, seluruh data Anda disimpan secara aman dalam sistem database internal kami yang dioperasikan dan dikelola langsung pada infrastruktur server Dahar Engineer.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.6}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">6. Hak Anda</h2>
                            <p>
                                Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda. Anda dapat memperbarui profil Anda melalui dashboard atau menghubungi kami secara langsung untuk bantuan lebih lanjut.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.7}>
                        <section className="pt-10 border-t border-border/30 text-center sm:text-left">
                            <p className="italic">
                                Privasi Anda adalah prioritas kami. Dengan menggunakan layanan Dahar Engineer, Anda mempercayakan data Anda kepada kami, dan kami berkomitmen penuh untuk menjaganya dengan integritas tinggi.
                            </p>
                        </section>
                    </SectionReveal>
                </div>
            </div>
        </div>
    );
}

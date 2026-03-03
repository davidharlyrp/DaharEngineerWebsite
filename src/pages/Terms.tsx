import { SectionReveal } from '@/components/ui-custom';

export default function Terms() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-4xl mx-auto">
                <SectionReveal>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">Terms of Service</h1>
                        <p className="text-muted-foreground italic text-sm">Last Updated: January 2026</p>
                    </div>
                </SectionReveal>

                <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
                    <SectionReveal delay={0.1}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">1. Ketentuan Umum</h2>
                            <p>
                                Selamat datang di Dahar Engineer. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat oleh Ketentuan Layanan ini. Kami berupaya memberikan solusi teknik sipil terbaik dengan prinsip kejujuran dan profesionalisme. Harap baca ketentuan ini dengan saksama.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">2. Penggunaan Layanan</h2>
                            <p className="mb-3">
                                Layanan kami mencakup konsultasi, desain bangunan, kursus privat, produk digital, dan sumber daya teknik lainnya. Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan tidak melanggar hak pihak lain atau membatasi penggunaan mereka atas platform ini.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Anda bertanggung jawab atas keakuratan data yang Anda berikan kepada kami.</li>
                                <li>Konten kursus dan dokumentasi teknis adalah milik intelektual Dahar Engineer dan dilarang untuk disebarluaskan tanpa izin tertulis.</li>
                            </ul>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">3. Akun Pengguna</h2>
                            <p>
                                Untuk mengakses fitur tertentu seperti pembelian kursus atau produk digital, Anda mungkin perlu mendaftarkan akun. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan kata sandi Anda. Kami berhak memberhentikan akun yang terbukti melakukan aktivitas mencurigakan atau melanggar ketentuan kami.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">4. Kekayaan Intelektual</h2>
                            <p>
                                Semua materi yang disediakan melalui platform ini, termasuk namun tidak terbatas pada desain, teks, grafik, logo, dan kode, adalah properti Dahar Engineer atau pemberi lisensi kami. Penggunaan komersial atas materi tersebut tanpa izin eksplisit tidak diperbolehkan.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.5}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">5. Batasan Tanggung Jawab</h2>
                            <p>
                                Meskipun kami berupaya memberikan akurasi teknis tertinggi, Dahar Engineer tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan informasi atau materi dari platform kami di luar pengawasan teknis langsung oleh tim kami. Semua desain sipil harus diverifikasi ulang sesuai dengan regulasi lokal yang berlaku di lokasi proyek Anda.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.6}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">6. Perubahan Ketentuan</h2>
                            <p>
                                Kami dapat memperbarui Ketentuan Layanan ini dari waktu ke waktu untuk mencerminkan perubahan pada layanan kami atau regulasi hukum. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.7}>
                        <section className="pt-10 border-t border-border/30">
                            <p className="italic">
                                Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan ini, silakan hubungi kami melalui halaman Kontak. Kami sangat menghargai kerja sama Anda.
                            </p>
                        </section>
                    </SectionReveal>
                </div>
            </div>
        </div>
    );
}

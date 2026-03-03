import { SectionReveal } from '@/components/ui-custom';

export default function CommunityPolicy() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-4xl mx-auto">
                <SectionReveal>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">Community Policy</h1>
                        <p className="text-muted-foreground italic text-sm">Last Updated: January 2026</p>
                    </div>
                </SectionReveal>

                <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
                    <SectionReveal delay={0.1}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">1. Visi & Misi Komunitas</h2>
                            <p>
                                Platform Dahar Engineer dibangun dengan semangat kolaborasi untuk memajukan dunia konstruksi, khususnya di Indonesia. Melalui Revit Files, Resources, dan Blog, kami bertujuan untuk menjembatani kesenjangan antara teori akademis dan implementasi praktis di lapangan melalui berbagi pengetahuan dan aset digital yang berkualitas.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">2. Penggunaan Aset (Revit Files & Resources)</h2>
                            <p className="mb-3">
                                Seluruh aset yang tersedia di bagian komunitas dapat diunduh oleh pengguna yang telah terdaftar. Kami percaya bahwa akses yang mudah terhadap template dan referensi teknis akan memacu produktivitas engineer Indonesia.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Akses Tanpa Biaya:</strong> Sebagian besar aset komunitas disediakan secara gratis sebagai kontribusi kami untuk industri.</li>
                                <li><strong>Penggunaan Personal & Proyek:</strong> Aset yang diunduh bebas digunakan untuk keperluan belajar maupun proyek profesional.</li>
                                <li><strong>Larangan Redistribusi:</strong> Dilarang menjual kembali atau mengunggah ulang aset Dahar Engineer ke platform lain tanpa izin tertulis, guna menjaga integritas dan sumber data.</li>
                            </ul>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">3. Etika Berbagi di Blog & Discussion</h2>
                            <p>
                                Informasi dan tutorial yang dibagikan melalui Blog dimaksudkan untuk edukasi. Kami mendorong diskusi yang sehat, konstruktif, dan berbasis data teknis. Hindari penyebaran informasi yang tidak terverifikasi atau konten yang bersifat ofensif.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">4. Keanggotaan Komunitas</h2>
                            <p>
                                Beberapa fitur komunitas memerlukan login untuk memastikan ekosistem yang terkendali dan meminimalisir penyalahgunaan (<span className='italic'>spamming</span> atau <span className='italic'>scraping</span>). Kami berhak membatasi akses bagi pengguna yang terbukti melanggar etika penggunaan platform atau merugikan komunitas.
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.5}>
                        <section>
                            <h2 className="text-lg font-bold text-foreground mb-3 uppercase tracking-tight">5. Disclaimer Teknis</h2>
                            <p>
                                Meskipun setiap aset Revit dan Resource telah melalui proses pengecekan internal, penggunaan setiap file dalam proyek nyata sepenuhnya merupakan tanggung jawab engineer yang bersangkutan. Dahar Engineer tidak bertanggung jawab atas kesalahan teknis yang timbul akibat modifikasi atau penggunaan aset yang tidak sesuai dengan standar regulasi setempat (SNI atau peraturan daerah terkait).
                            </p>
                        </section>
                    </SectionReveal>

                    <SectionReveal delay={0.6}>
                        <section className="pt-10 border-t border-border/30 text-center">
                            <p className="italic">
                                Mari bersama-sama membangun infrastruktur Indonesia yang lebih cerdas, efisien, dan berkelanjutan melalui sharing knowledge yang positif.
                            </p>
                        </section>
                    </SectionReveal>
                </div>
            </div>
        </div>
    );
}

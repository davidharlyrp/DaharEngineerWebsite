import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useRef, useState, useEffect, useMemo } from 'react';
import {
    HelpCircle,
    Search,
    ChevronDown,
    Loader2,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { faqService } from '@/services/pb/faq';
import type { FAQ } from '@/types/faq';

const ITEMS_PER_PAGE = 15;

// Hero Section
function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <div ref={ref} className="relative h-screen">
            <motion.div
                style={{ opacity, y }}
                className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-noise" />

                <div className="relative z-10 text-center flex flex-col items-center justify-center px-6 w-full mx-auto h-screen">
                    {/* Video background */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-30"
                        >
                            <source src="/Hero.webm" type="video/webm" />
                        </video>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="w-16 h-16 bg-army-700/10 flex items-center justify-center rounded-2xl mb-8 border border-army-500/20"
                    >
                        <HelpCircle className="w-8 h-8 text-army-400" />
                    </motion.div>

                    <TextReveal
                        text="Frequently Asked"
                        tag="h1"
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2"
                        delay={0.3}
                    />
                    <TextReveal
                        text="Questions"
                        tag="h1"
                        className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-muted-foreground"
                        delay={0.5}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-sm text-muted-foreground mt-6 max-w-xl mx-auto opacity-70 italic"
                    >
                        Find answers to common questions about our services, products, and engineering consultations.
                    </motion.p>
                </div>


                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-muted-foreground"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function FAQPage() {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            setIsLoading(true);
            try {
                const response = await faqService.getFAQs(currentPage, ITEMS_PER_PAGE);
                setFaqs(response.items);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFAQs();
    }, [currentPage]);

    const filteredFAQs = useMemo(() => {
        if (!searchQuery) return faqs;
        const query = searchQuery.toLowerCase();
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            faq.keyword?.toLowerCase().includes(query)
        );
    }, [faqs, searchQuery]);

    // Scroll to section when page changes
    useEffect(() => {
        if (currentPage > 1 && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    return (
        <div className="relative min-h-screen bg-background">
            <HeroSection />

            <div className="relative z-10 bg-background border-t border-border/50">
                <section ref={sectionRef} className="py-20 px-6 lg:px-20">
                    <div className="max-w-4xl mx-auto">

                        {/* Search Bar */}
                        <SectionReveal>
                            <div className="relative mb-12">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                                <Input
                                    placeholder="Search questions or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 bg-secondary/20 border-border/20 h-12 text-sm rounded-none focus:border-army-500/50 transition-all"
                                />
                            </div>
                        </SectionReveal>

                        {/* Accordion List */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-army-500 mb-4" />
                                <p className="text-xs uppercase tracking-widest text-muted-foreground opacity-50">Loading Knowledge Base...</p>
                            </div>
                        ) : filteredFAQs.length > 0 ? (
                            <div className="space-y-8">
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredFAQs.map((faq, index) => (
                                        <SectionReveal key={faq.id} delay={index * 0.05}>
                                            <AccordionItem value={faq.id} className="border-border/10 mb-2 px-6 bg-secondary/5 hover:bg-secondary/10 transition-colors rounded-none border">
                                                <AccordionTrigger className="text-sm font-semibold py-5 hover:no-underline group">
                                                    <span className="group-hover:text-army-400 transition-colors pr-4">{faq.question}</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground leading-relaxed text-xs pb-6 opacity-80 border-t border-border/5 pt-4">
                                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer.replace(/\n/g, '<br />')) }} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </SectionReveal>
                                    ))}
                                </Accordion>

                                {/* Pagination */}
                                {!searchQuery && totalPages > 1 && (
                                    <div className="flex justify-center pt-12 border-t border-border/10">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                        }}
                                                        className={`cursor-pointer text-[10px] uppercase tracking-wider h-9 rounded-none ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                                                    />
                                                </PaginationItem>

                                                {[...Array(totalPages)].map((_, i) => {
                                                    const pageNumber = i + 1;
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationLink
                                                                    isActive={currentPage === pageNumber}
                                                                    onClick={(e) => { e.preventDefault(); setCurrentPage(pageNumber); }}
                                                                    className={`cursor-pointer text-[10px] w-9 h-9 rounded-none border-border/20 ${currentPage === pageNumber ? 'bg-army-700 border-army-600 text-white' : 'hover:bg-secondary'}`}
                                                                >
                                                                    {pageNumber}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    } else if (
                                                        (pageNumber === currentPage - 2 && pageNumber > 1) ||
                                                        (pageNumber === currentPage + 2 && pageNumber < totalPages)
                                                    ) {
                                                        return (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                        }}
                                                        className={`cursor-pointer text-[10px] uppercase tracking-wider h-9 rounded-none ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-border/20 bg-secondary/5">
                                <HelpCircle className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
                                <p className="text-sm font-medium text-muted-foreground">No questions found matching your search.</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-xs text-army-400 hover:text-army-300"
                                >
                                    Clear search
                                </Button>
                            </div>
                        )}

                        {/* Support CTA */}
                        <SectionReveal delay={0.4}>
                            <div className="mt-20 p-8 border border-army-500/20 bg-army-500/5 text-center flex flex-col items-center">
                                <MessageSquare className="w-8 h-8 text-army-400 mb-4" />
                                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight italic">Still have questions?</h3>
                                <p className="text-xs text-muted-foreground mb-6 max-w-sm">
                                    Can't find what you're looking for? Reach out to our team directly through WhatsApp for expert engineering assistance.
                                </p>
                                <Button
                                    onClick={() => navigate('/contact')}
                                    className="bg-army-700 hover:bg-army-600 rounded-none h-10 px-8 text-xs font-bold uppercase tracking-widest gap-2"
                                >
                                    Contact Support <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </SectionReveal>
                    </div>
                </section>
            </div>
        </div>
    );
}

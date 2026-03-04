import { Loader2, BookOpen, Clock, Signal, Users, CheckCircle2, ChevronRight, LayoutList, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SEO } from '@/components/seo/SEO';
import { SectionReveal, TextReveal } from '@/components/ui-custom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { courseService } from '@/services/pb/courses';
import { paymentApi } from '@/services/api/payment';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import type { OnlineCourse } from '@/types/courses';

// Hero Section Component
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

                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-noise opacity-20" />

                <div className="relative z-10 text-center flex flex-col items-center justify-center px-6 w-full mx-auto h-screen border-b border-border/10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-army-500/30 bg-army-500/10 mb-8"
                    >
                        <BookOpen className="w-4 h-4 text-army-400" />
                        <span className="text-sm text-army-400 font-medium tracking-wide">
                            LEARNING PROGRAMS
                        </span>
                    </motion.div>

                    <TextReveal
                        text="Online"
                        tag="h1"
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 uppercase italic"
                        delay={0.3}
                    />
                    <TextReveal
                        text="Courses"
                        tag="h1"
                        className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground uppercase"
                        delay={0.5}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed opacity-80"
                    >
                        Upgrade your skills with our curated professional courses, designed to give you practical knowledge and certification.
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
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 text-white">Scroll</span>
                        <ChevronDown className="w-5 h-5 text-army-500" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function OnlineCourses() {
    const [courses, setCourses] = useState<OnlineCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [purchasedCourses, setPurchasedCourses] = useState<Record<string, boolean>>({});
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchCoursesAndAccess = async () => {
            try {
                const data = await courseService.getOnlineCourses();
                setCourses(data);

                if (isAuthenticated && user?.id) {
                    const accessMap: Record<string, boolean> = {};
                    await Promise.all(data.map(async (course) => {
                        const hasAccess = await paymentApi.checkCourseAccess(course.id, user.id);
                        accessMap[course.id] = hasAccess;
                    }));
                    setPurchasedCourses(accessMap);
                }
            } catch (error) {
                console.error('Failed to fetch online courses:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCoursesAndAccess();

        // Check for success status in URL
        if (searchParams.get('status') === 'paid') {
            const courseId = searchParams.get('courseId');
            if (courseId) {
                setPurchasedCourses(prev => ({ ...prev, [courseId]: true }));
            }
            // Clean up URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('status');
            newParams.delete('courseId');
            setSearchParams(newParams);
        }
    }, [isAuthenticated, user?.id]);

    const handleGetAccess = async (course: OnlineCourse) => {
        if (!isAuthenticated || !user) {
            window.location.href = `/login?redirect=/courses/online-courses`;
            return;
        }

        if (purchasedCourses[course.id]) {
            window.open(`https://course.daharengineer.com/course/${course.slug}`, '_blank');
            return;
        }

        try {
            setIsProcessing(course.id);
            const response = await paymentApi.createCourseInvoice({
                courseId: course.id,
                userId: user.id,
                userEmail: user.email,
                userName: user.name || 'Customer',
                amount: course.discountPrice || course.price,
                courseName: course.title,
                courseSlug: course.slug
            });

            if (response.invoiceUrl) {
                window.location.href = response.invoiceUrl;
            }
        } catch (error) {
            console.error('Failed to create course payment:', error);
            alert('Failed to initialize payment. Please try again.');
        } finally {
            setIsProcessing(null);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="relative">
            <SEO
                title="Online Courses - Dahar Engineer"
                description="Explore our range of professional engineering online courses. Self-paced learning for advanced engineering concepts."
            />

            <HeroSection />
            <div className="h-screen pointer-events-none" />

            <div className="relative z-10 bg-background">
                <section className="py-24 px-6 lg:px-20 border-t border-border/50 shadow-2xl">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16">
                            <SectionReveal>
                                <span className="text-[10px] text-army-400 font-bold uppercase tracking-[0.3em] mb-4 block">Available Modules</span>
                            </SectionReveal>
                            <SectionReveal delay={0.1}>
                                <h2 className="text-3xl font-bold tracking-tight uppercase">Course Directory</h2>
                            </SectionReveal>
                            <div className="w-12 h-1 bg-army-500 mt-4 rounded-full opacity-50" />
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-army-500 mb-4 opacity-50" />
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">Fetching online modules...</p>
                            </div>
                        ) : courses.length > 0 ? (
                            <SectionReveal delay={0.3}>
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                    {courses.map((course) => (
                                        <AccordionItem
                                            key={course.id}
                                            value={course.id}
                                            className="border border-border/10 bg-secondary/5 hover:bg-secondary/10 transition-colors rounded-sm px-4 sm:px-6 shadow-sm overflow-hidden"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-5 group">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left w-full pr-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                            {course.isNew && (
                                                                <span className="bg-army-500 text-[8px] text-white font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">New</span>
                                                            )}
                                                            <h3 className="text-sm sm:text-base font-bold group-hover:text-army-400 transition-colors truncate">
                                                                {course.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground opacity-70">
                                                            <span className="flex items-center gap-1.5">
                                                                <Users className="w-3 h-3 text-army-500/70" />
                                                                {course.expand?.instructor?.name || 'Instructor'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock className="w-3 h-3 text-army-500/70" />
                                                                {course.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 capitalize">
                                                                <Signal className="w-3 h-3 text-army-500/70" />
                                                                {course.level}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:items-end shrink-0 pt-2 sm:pt-0">
                                                        {course.discountPrice ? (
                                                            <>
                                                                <span className="text-[10px] text-muted-foreground line-through opacity-40">{formatPrice(course.price)}</span>
                                                                <span className="text-sm font-bold text-army-400">{formatPrice(course.discountPrice)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-sm font-bold text-army-400">{formatPrice(course.price)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2 pb-8 border-t border-border/5">
                                                <div className="grid lg:grid-cols-3 gap-10 mt-6">
                                                    <div className="lg:col-span-2 space-y-8">
                                                        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2 opacity-60">
                                                                <LayoutList className="w-3 h-3" />
                                                                Course Overview
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                                                {course.description}
                                                            </p>
                                                        </div>

                                                        <div className="grid sm:grid-cols-2 gap-8">
                                                            <div className="animate-in fade-in slide-in-from-left-2 duration-500 delay-100">
                                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 opacity-60">What you'll learn</h4>
                                                                <ul className="space-y-3">
                                                                    {course.features.split('.').map((feature, i) => (
                                                                        <li key={i} className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-snug group/item">
                                                                            <CheckCircle2 className="w-3 h-3 text-army-500 mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                                                                            <span className="group-hover/item:text-foreground transition-colors">{feature.trim()}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div className="animate-in fade-in slide-in-from-right-2 duration-500 delay-200">
                                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 opacity-60">Deliverables</h4>
                                                                <ul className="space-y-3">
                                                                    {course.deliverables.split('.').map((item, i) => (
                                                                        <li key={i} className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-snug group/item">
                                                                            <div className="w-1 h-1 bg-army-400 rounded-full mt-1.5 shrink-0" />
                                                                            <span className="group-hover/item:text-foreground transition-colors">{item.trim()}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                                        <div className="p-6 bg-army-500/5 border border-army-500/10 rounded-sm shadow-inner backdrop-blur-sm">
                                                            <div className="flex items-center justify-between mb-6">
                                                                <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60 text-white">Module Content</div>
                                                                <div className="text-[10px] text-army-400 font-bold">{course.totalModules} Modules • {course.totalSteps} Steps</div>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleGetAccess(course)}
                                                                disabled={isProcessing === course.id}
                                                                className="w-full bg-army-700 hover:bg-army-600 h-10 text-[11px] font-bold uppercase tracking-[0.2em] rounded-none shadow-lg group transition-all duration-300"
                                                            >
                                                                {isProcessing === course.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : purchasedCourses[course.id] ? (
                                                                    'Open Course'
                                                                ) : (
                                                                    'Get Access'
                                                                )}
                                                                <ChevronRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-sm border border-border/5 hover:bg-secondary/20 transition-colors group/instructor">
                                                            {course.expand?.instructor?.image ? (
                                                                <div className="relative overflow-hidden rounded-full w-12 h-12 grayscale group-hover/instructor:grayscale-0 transition-all duration-500">
                                                                    <img
                                                                        src={courseService.getFileUrl({ collectionId: 'mentor', id: course.expand.instructor.id }, course.expand.instructor.image)}
                                                                        alt={course.expand.instructor.name}
                                                                        className="w-full h-full object-cover scale-110 group-hover/instructor:scale-100 transition-transform duration-500"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 bg-army-900/20 rounded-full flex items-center justify-center">
                                                                    <Users className="w-6 h-6 text-army-700/50" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] font-bold truncate group-hover/instructor:text-army-400 transition-colors uppercase tracking-wider">{course.expand?.instructor?.name}</p>
                                                                <p className="text-[10px] text-muted-foreground truncate opacity-70 italic">{course.expand?.instructor?.specialization}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </SectionReveal>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-border/20 rounded-sm bg-secondary/5">
                                <BookOpen className="w-10 h-10 text-muted-foreground/10 mx-auto mb-4" />
                                <p className="text-sm font-medium text-muted-foreground">No courses available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

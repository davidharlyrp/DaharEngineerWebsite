import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Building2,
    Home,
    Factory,
    GraduationCap,
    ArrowRight,
    ShieldCheck,
    ChevronDown
} from 'lucide-react';
import { SectionReveal, TextReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';

const projectTypes = [
    {
        title: 'Residential',
        icon: Home,
        items: ['Single Family Homes', 'Multi-Family Housing', 'Apartment Buildings', 'Condominiums']
    },
    {
        title: 'Commercial',
        icon: Building2,
        items: ['Office Buildings', 'Retail Centers', 'Hotels', 'Mixed-Use Developments']
    },
    {
        title: 'Industrial',
        icon: Factory,
        items: ['Manufacturing Facilities', 'Warehouses', 'Distribution Centers', 'Processing Plants']
    },
    {
        title: 'Institutional',
        icon: GraduationCap,
        items: ['Schools & Universities', 'Healthcare Facilities', 'Government Buildings', 'Religious Buildings']
    }
];

const serviceDetails = [
    {
        id: 'arch',
        title: 'Architectural Design & Planning',
        desc: 'Complete architectural design solutions from concept development to detailed construction drawings, ensuring functional and aesthetic excellence.',
        features: ['Site Analysis & Feasibility Studies', 'Conceptual Design Development', 'Detailed Architectural Drawings', 'Space Planning & Optimization', 'Interior Design Coordination', 'Regulatory Compliance Review'],
        deliverables: ['Architectural Plans & Elevations', 'Section & Detail Drawings', '3D Renderings & Visualizations', 'Design Documentation Package']
    },
    {
        id: 'struct',
        title: 'Structural Engineering Analysis',
        desc: 'Advanced structural analysis and design using cutting-edge software to ensure safety, efficiency, and compliance with building codes.',
        features: ['Load Analysis & Calculations', 'Structural System Design', 'Foundation Design & Analysis', 'Seismic & Wind Load Analysis', 'Material Selection & Optimization', 'Construction Phase Support'],
        deliverables: ['Structural Analysis Reports', 'Engineering Drawings', 'Calculation Packages', 'Material Specifications']
    },
    {
        id: 'bim',
        title: 'Building Information Modeling (BIM)',
        desc: 'Advanced BIM modeling for improved coordination, reduced conflicts, and enhanced project delivery efficiency.',
        features: ['Revit 3D Modeling', 'Multi-Disciplinary Coordination', 'Clash Detection & Resolution', '4D Construction Sequencing', '5D Cost Integration', 'Facility Management Models'],
        deliverables: ['Native BIM Models', 'Coordination Reports', 'Clash Detection Reports', 'BIM Execution Plans']
    },
    {
        id: 'site',
        title: 'Site Planning & Development',
        desc: 'Comprehensive site development planning including utilities, landscaping, and infrastructure design.',
        features: ['Site Layout & Grading', 'Utility Planning & Design', 'Drainage & Stormwater Management', 'Parking & Access Design', 'Landscape Architecture', 'Environmental Impact Assessment'],
        deliverables: ['Site Development Plans', 'Grading & Drainage Plans', 'Utility Layouts', 'Landscape Designs']
    },
    {
        id: 'geo',
        title: 'Geotechnical Engineering Analysis',
        desc: 'Comprehensive soil and foundation analysis to ensure stable and cost-effective foundation systems for your building projects.',
        features: ['Soil Investigation & Testing', 'Foundation Recommendations', 'Slope Stability Analysis', 'Settlement Analysis', 'Retaining Wall Design', 'Ground Improvement Solutions'],
        deliverables: ['Geotechnical Investigation Reports', 'Foundation Design Recommendations', 'Soil Testing Results', 'Construction Guidelines']
    },
    {
        id: '3d',
        title: '3D Modeling & Visualization',
        desc: 'Photorealistic 3D models and architectural visualizations to help clients visualize their projects before construction.',
        features: ['Detailed 3D Building Models', 'Photorealistic Renderings', 'Virtual Reality Walkthroughs', 'Animation & Fly-throughs', 'Material & Lighting Studies', 'Design Presentation Materials'],
        deliverables: ['High-Resolution Renderings', '3D Model Files', 'Virtual Tour Packages', 'Presentation Videos']
    },
    {
        id: 'draw',
        title: 'Technical Drawing',
        desc: 'Precise technical drawings and construction documentation ensuring accurate communication of design intent to contractors.',
        features: ['Shop Drawings', 'As-Built Drawings', 'Detailed Connection Designs', 'Mechanical & Electrical Coordination', 'Plumbing & Sanitary Layouts', 'Reinforcement Detailing'],
        deliverables: ['Detailed CAD/BIM Files', 'Print-Ready Drawing Sets', 'Technical Specifications', 'Bill of Quantities (BoQ) Support']
    },
    {
        id: 'doc',
        title: 'Construction Documentation',
        desc: 'Comprehensive documentation packages that provide clear instructions and specifications for successful project execution.',
        features: ['Project Specifications', 'Contract Documents', 'Bid Package Preparation', 'Permit Application Support', 'Quality Assurance Manuals', 'Maintenance Guidelines'],
        deliverables: ['Full Construction Set', 'Technical Specifications Book', 'Regulatory Approval Documents', 'Project Manuals']
    }
];

export default function BuildingDesign() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="min-h-screen bg-background" ref={containerRef}>
            {/* Hero Section - Synced with PrivateCourses style */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ opacity, y }}
                    className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none"
                >
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <div className="absolute inset-0 bg-noise opacity-20" />

                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
                        <div
                            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 scale-110"
                            style={{ filter: 'grayscale(0.2)' }}
                        />
                    </div>

                    <div className="relative z-10 text-center flex flex-col items-center justify-center px-6 w-full mx-auto h-screen">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-army-500/30 
                         bg-army-500/10 mb-8"
                        >
                            <Building2 className="w-4 h-4 text-army-400" />
                            <span className="text-sm text-army-400 font-medium tracking-wide uppercase">
                                Engineering Services
                            </span>
                        </motion.div>

                        <TextReveal
                            text="Building"
                            tag="h1"
                            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-4 uppercase text-white"
                            delay={0.3}
                        />
                        <TextReveal
                            text="Design"
                            tag="h1"
                            className="text-5xl sm:text-6xl lg:text-8xl font-light tracking-tight text-army-500 uppercase"
                            delay={0.5}
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto font-light"
                        >
                            Transforming complex engineering challenges into innovative, functional, and sustainable building solutions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="mt-10"
                        >
                            <Button asChild className="bg-army-700 hover:bg-army-600 rounded-none h-12 px-10 text-xs font-bold uppercase tracking-widest">
                                <Link to="/contact">Discuss Project</Link>
                            </Button>
                        </motion.div>
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
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">Scroll</span>
                            <ChevronDown className="w-5 h-5 text-army-500" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Spacer to push content down from fixed hero */}
            <div className="h-0" />

            {/* Main Content Sections - Positioned above the fixed hero as user scrolls */}
            <div className="relative z-30 bg-background">
                {/* Intro Section */}
                <section className="py-24 px-6 lg:px-20 border-b border-border/50">
                    <div className="max-w-7xl mx-auto">
                        <SectionReveal>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold tracking-tight uppercase">Tailored Engineering <br />Solutions</h2>
                                    <div className="w-20 h-1 bg-army-500" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    From initial concept to final construction documentation, we provide comprehensive building design services that combine technical expertise with creative vision to deliver exceptional results. Our approach ensures that every project is optimized for performance, safety, and aesthetic value.
                                </p>
                            </div>
                        </SectionReveal>
                    </div>
                </section>

                {/* Project Types Section */}
                <section className="py-20 px-6 lg:px-20 bg-secondary/5">
                    <div className="max-w-7xl mx-auto">
                        <SectionReveal>
                            <h2 className="text-xl font-bold mb-10 uppercase tracking-tight flex items-center gap-3 italic font-black">
                                <span className="w-8 h-px bg-army-500"></span>
                                Project Types We Serve
                            </h2>
                        </SectionReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {projectTypes.map((type, index) => (
                                <SectionReveal key={type.title} delay={index * 0.1}>
                                    <div className="p-6 bg-background border border-border/50 hover:border-army-500/50 transition-all group rounded-sm shadow-sm">
                                        <div className="w-10 h-10 bg-secondary flex items-center justify-center mb-6 group-hover:bg-army-700 group-hover:text-white transition-colors">
                                            <type.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-bold mb-4 uppercase">{type.title}</h3>
                                        <ul className="space-y-2">
                                            {type.items.map(item => (
                                                <li key={item} className="text-[11px] text-muted-foreground flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-army-500"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </SectionReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed Services Accordion */}
                <section className="py-20 px-6 lg:px-20">
                    <div className="max-w-5xl mx-auto">
                        <SectionReveal>
                            <div className="mb-12">
                                <h2 className="text-xl font-bold uppercase tracking-tight italic mb-4">Detailed Service Areas</h2>
                                <p className="text-xs text-muted-foreground max-w-xl">
                                    Explore our specialized engineering capabilities across the entire lifecycle of building development.
                                </p>
                            </div>
                        </SectionReveal>

                        <Accordion type="single" collapsible className="space-y-3">
                            {serviceDetails.map((service, index) => (
                                <SectionReveal key={service.id} delay={index * 0.05}>
                                    <AccordionItem value={service.id} className="border border-border/50 bg-secondary/5 px-6 rounded-none data-[state=open]:border-army-500/40 transition-all shadow-sm">
                                        <AccordionTrigger className="hover:no-underline py-6 group">
                                            <span className="text-sm font-bold uppercase tracking-tighter text-left group-hover:text-army-400 transition-colors">
                                                {service.title}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-8">
                                            <div className="grid gap-8 pt-4 border-t border-border/20">
                                                <div className="space-y-6">
                                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                                        {service.desc}
                                                    </p>

                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-4">Features & Capabilities:</h4>
                                                            <ul className="space-y-2">
                                                                {service.features.map(feature => (
                                                                    <li key={feature} className="text-[11px] text-muted-foreground flex items-center gap-2">
                                                                        <ShieldCheck className="w-3 h-3 text-army-500" />
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-4">Deliverables:</h4>
                                                            <ul className="space-y-2">
                                                                {service.deliverables.map(item => (
                                                                    <li key={item} className="text-[11px] text-muted-foreground flex items-center gap-2">
                                                                        <div className="w-1 h-1 bg-army-500 rounded-full" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4">
                                                        <Button asChild className="bg-army-700 hover:bg-army-600 rounded-none h-10 px-8 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm">
                                                            <Link to="/contact">
                                                                Get Quote <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </SectionReveal>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6 lg:px-20 bg-army-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-10" />
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <SectionReveal>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6 uppercase tracking-tight italic">Have a specific project in mind?</h2>
                            <p className="text-sm text-army-200/70 mb-10 max-w-2xl mx-auto">
                                Our engineering team is ready to provide the technical expertise and creative solutions your building design project requires.
                            </p>
                            <Button asChild variant="outline" className="border-army-500 text-white hover:bg-army-500 hover:text-white rounded-none h-12 px-10 text-xs font-bold uppercase tracking-widest">
                                <Link to="/contact">Start Consultation</Link>
                            </Button>
                        </SectionReveal>
                    </div>
                </section>
            </div>
        </div>
    );
}

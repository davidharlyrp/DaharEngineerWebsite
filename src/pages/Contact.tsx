import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
        className="fixed inset-0 flex items-center justify-center z-0"
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-noise" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-army-500/30 
                       bg-army-500/10 mb-8"
          >
            <Mail className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              GET IN TOUCH
            </span>
          </motion.div>

          <TextReveal
            text="Let's Work"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Together"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Contact Form Section
function ContactFormSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Contact Information
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Get in Touch
                </h2>
              </SectionReveal>
              <LineReveal delay={0.2} className="max-w-md mb-8" />
              
              <SectionReveal delay={0.3}>
                <p className="text-lg text-muted-foreground mb-10">
                  Have a project in mind or need engineering consultation? 
                  We'd love to hear from you. Reach out and let's discuss how we can help.
                </p>
              </SectionReveal>

              <div className="space-y-6 mb-10">
                <SectionReveal delay={0.4}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-army-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <a href="mailto:daharengineer@gmail.com" 
                         className="text-muted-foreground hover:text-army-400 transition-colors">
                        daharengineer@gmail.com
                      </a>
                    </div>
                  </div>
                </SectionReveal>

                <SectionReveal delay={0.5}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-army-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <a href="tel:+6282120867946" 
                         className="text-muted-foreground hover:text-army-400 transition-colors">
                        +62 821-2086-7946
                      </a>
                    </div>
                  </div>
                </SectionReveal>

                <SectionReveal delay={0.6}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-army-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        Bandung, West Java, Indonesia
                      </p>
                    </div>
                  </div>
                </SectionReveal>

                <SectionReveal delay={0.7}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-army-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Working Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </div>

              {/* Social Links */}
              <SectionReveal delay={0.8}>
                <div>
                  <h3 className="font-medium mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a 
                      href="https://instagram.com/dahar.engineer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-secondary/50 hover:bg-army-700 flex items-center justify-center
                                 transition-colors duration-300"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://linkedin.com/company/dahar-engineer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-secondary/50 hover:bg-army-700 flex items-center justify-center
                                 transition-colors duration-300"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://youtube.com/@daharengineer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-secondary/50 hover:bg-army-700 flex items-center justify-center
                                 transition-colors duration-300"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Contact Form */}
            <SectionReveal delay={0.3}>
              <div className="p-8 lg:p-12 bg-secondary/30">
                <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-army-400 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                    <p className="text-muted-foreground">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="bg-background border-border/50 focus:border-army-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="bg-background border-border/50 focus:border-army-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="bg-background border-border/50 focus:border-army-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project..."
                        required
                        rows={5}
                        className="bg-background border-border/50 focus:border-army-500 resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-army-700 hover:bg-army-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Map Section (Placeholder)
function MapSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="aspect-[21/9] bg-gradient-to-br from-army-800/20 to-army-900/20 
                            flex items-center justify-center border border-border/30">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-army-700/40 mx-auto mb-4" />
                <p className="text-muted-foreground">Bandung, West Java, Indonesia</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: 'What services do you offer?',
      answer: 'We offer building design, structural analysis, engineering consultation, online courses, and custom software development for civil engineering applications.'
    },
    {
      question: 'How can I book a consultation?',
      answer: 'You can book a consultation by filling out the contact form above, emailing us directly, or calling our office. We offer both online and offline consultation options.'
    },
    {
      question: 'Do you offer online courses?',
      answer: 'Yes, we offer a variety of online courses on structural engineering, Revit, ETABS, and more. Visit our Courses page to see the full list.'
    },
    {
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary depending on scope and complexity. We will provide a detailed timeline during our initial consultation after understanding your requirements.'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                FAQ
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </SectionReveal>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <SectionReveal key={index} delay={0.1 * (index + 1)}>
                <div className="p-6 bg-secondary/30">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Contact Page
export default function Contact() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <ContactFormSection />
        <MapSection />
        <FAQSection />
      </div>
    </div>
  );
}

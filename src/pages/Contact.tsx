import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CONTACT_CHANNELS, SOCIAL_LINKS } from '@/constants/contact';

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
    whatsapp: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Halo, saya ${formData.name} ingin menghubungi Dahar Engineer:\n\n` +
      `*WhatsApp:* ${formData.whatsapp}\n` +
      `*Email:* ${formData.email}\n` +
      `*Pesan:*\n${formData.message}\n\n` +
      `Saya tunggu balasannya. Terima kasih!`
    );

    // Redirect to WhatsApp using the centralized number
    const whatsappUrl = `https://wa.me/6285536533330?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        subject: '',
        message: ''
      });
    }, 3000);
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
                {CONTACT_CHANNELS.map((channel, index) => (
                  <SectionReveal key={channel.name} delay={0.4 + (index * 0.1)}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-army-700/10 flex items-center justify-center flex-shrink-0">
                        <channel.icon className="w-5 h-5 text-army-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{channel.name}</h3>
                        <a href={channel.href} target="_blank" rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-army-400 transition-colors">
                          {channel.label}
                        </a>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>

              {/* Social Links */}
              <SectionReveal delay={0.8}>
                <div>
                  <h3 className="font-medium mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-secondary/50 hover:bg-army-700 flex items-center justify-center
                                   transition-colors duration-300 group"
                      >
                        <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                      </a>
                    ))}
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
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="0812..."
                          required
                          className="bg-background border-border/50 focus:border-army-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
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

// Map Section
function MapSection() {
  return (
    <section className="h-[600px] relative bg-secondary/20 overflow-hidden">
      <div className="absolute flex items-center justify-center inset-0 mx-auto h-full w-[80dvw] z-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0802851928574!2d107.59680829999999!3d-6.9998273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9228c3ed1fd%3A0xc9baa165d4a3cad8!2sDahar%20Engineer!5e0!3m2!1sid!2sid!4v1749789553737!5m2!1sid!2sid"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(1) grayscale(1) brightness(0.9) contrast(0.9)' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Dahar Engineer Location"
        />
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
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants/contact';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: 'https://portfolio.daharengineer.com' },
    { label: 'FAQ', href: '/faq' },
  ],
  services: [
    { label: 'Building Design', href: '/building-design' },
    { label: 'Online Courses', href: '/courses/online-courses' },
    { label: 'Private Courses', href: '/courses/private-courses' },
    { label: 'Store', href: '/store' },
    { label: 'Software', href: '/software' },
  ],
  community: [
    { label: 'DELinxs', href: 'https://delinxs.com' },
    { label: 'Revit Files', href: '/community/revit-files' },
    { label: 'Resources', href: '/community/resources' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Community Policy', href: '/community-policy' },
  ],
};

export function Footer() {

  return (
    <footer className="bg-background border-t border-border/30 lg:h-fit h-screen flex flex-col items-center justify-between">
      {/* Main Footer */}
      <div className="px-6 lg:px-20 py-16 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src="/logo.png" alt="Dahar Engineer" />
                </div>
                <div>
                  <span className="text-lg font-semibold tracking-tight">DAHAR</span>
                  <span className="text-lg font-light text-muted-foreground ml-1">ENGINEER</span>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Complete construction solutions from planning, building design,
                courses, to software and resources for developing your engineering career.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-army-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-muted-foreground/50" />
                  {CONTACT_INFO.email}
                </a>
                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-army-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-muted-foreground/50" />
                  {CONTACT_INFO.phone}
                </a>
                <a
                  href={CONTACT_INFO.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-army-400 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground/50" />
                  {CONTACT_INFO.location}
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-army-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-army-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-army-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-army-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30 px-6 lg:px-20 py-6 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            2024 Dahar Engineer. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary/50 hover:bg-army-700 flex items-center justify-center
                             transition-colors duration-300 group"
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

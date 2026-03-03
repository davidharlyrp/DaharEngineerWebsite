import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '@/context/MenuContext';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Building2,
  Code2,
  GraduationCap,
  FolderOpen,
  Mail,
  User,
  LogOut,
  X,
  ShoppingBag,
  Box,
  BookOpen,
  FileText,
  LayoutDashboard,
  Users,
  Phone,
  MapPin
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants/contact';

const menuItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About Us', href: '/about', icon: User },
  { label: 'Portfolio', href: 'https://portfolio.daharengineer.com', icon: FolderOpen },
  { label: 'FAQ', href: '/faq', icon: FileText },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'Building Design', href: '/building-design', icon: Building2 },
  { label: 'Online Courses', href: '/courses/online-courses', icon: GraduationCap },
  { label: 'Private Courses', href: '/courses/private-courses', icon: Users },
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'Software', href: '/software', icon: Code2 },
  { label: 'Services', href: '/services', icon: Box },
  { label: 'Blog', href: '/blog', icon: FileText },
  { label: 'Revit Files', href: '/community/revit-files', icon: Box },
  { label: 'Resources', href: '/community/resources', icon: BookOpen },
  { label: 'DELinxs', href: 'https://delinxs.com', icon: LayoutDashboard },
];

export function MenuOverlay() {
  const { isOpen, close } = useMenu();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="menu-overlay flex flex-col"
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={close}
            className="absolute top-6 right-6 p-3 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-8 h-8" />
          </motion.button>

          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Main navigation */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-16 overflow-y-auto">
              <nav className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{
                        delay: 0.1 + index * 0.05,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={close}
                        className={`
                          group flex items-center gap-4 py-1.5 px-4 -mx-4
                          transition-all duration-300
                          ${isActive
                            ? 'text-army-400'
                            : 'text-foreground/60 hover:text-foreground'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-sm lg:text-3xl font-light tracking-tight">
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 bg-army-500 ml-4"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="lg:w-96 border-t lg:border-t-0 lg:border-l border-border/30 
                         px-8 lg:px-12 py-8 lg:py-16 flex flex-col justify-between"
            >
              {/* User section */}
              <div>
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-6 border-b border-border/10 pb-1">
                  Account
                </h3>

                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-army-700 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-medium">{user?.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={close}
                      className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/50 
                                 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={close}
                      className="block w-full py-3 px-4 bg-army-700 hover:bg-army-600 
                                 text-white text-center text-sm font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={close}
                      className="block w-full py-3 px-4 border border-border/50 
                                 hover:border-army-500 text-center text-sm transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="mt-8 lg:mt-0 hidden md:block">
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-6 border-b border-border/10 pb-1">
                  Get in Touch
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-army-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {CONTACT_INFO.email}
                  </a>
                  <a
                    href={CONTACT_INFO.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-army-400 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {CONTACT_INFO.phone}
                  </a>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {CONTACT_INFO.location}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8 lg:mt-0">
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-4 border-b border-border/10 pb-1">
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-army-400 transition-colors"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

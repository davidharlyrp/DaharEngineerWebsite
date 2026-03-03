import {
    Instagram,
    Linkedin,
    Youtube,
    Music2,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import { DiscordIcon } from '@/components/icons/DiscordIcon';

export const CONTACT_INFO = {
    email: 'admin@daharengineer.com',
    phone: '+62 855-3653-3330',
    whatsapp: 'https://wa.me/6285536533330',
    location: 'Bandung, West Java, Indonesia',
    mapsLink: 'https://maps.app.goo.gl/6wSucK8i46ceEu866',
};

export const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/dahar_engineer/',
        icon: Instagram,
        color: 'hover:bg-[#E1306C]', // Optional: specific brand colors
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/dahar-engineer/',
        icon: Linkedin,
        color: 'hover:bg-[#0077B5]',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@dahar_engineer',
        icon: Youtube,
        color: 'hover:bg-[#FF0000]',
    },
    {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@dahar_engineer',
        icon: Music2,
        color: 'hover:bg-[#000000]',
    },
    {
        name: 'Discord',
        href: 'https://discord.gg/PPk643WbMX',
        icon: DiscordIcon,
        color: 'hover:bg-[#5865F2]',
    },
];

export const CONTACT_CHANNELS = [
    {
        name: 'Email',
        value: CONTACT_INFO.email,
        href: `mailto:${CONTACT_INFO.email}`,
        icon: Mail,
        label: 'admin@daharengineer.com'
    },
    {
        name: 'Phone',
        value: CONTACT_INFO.phone,
        href: CONTACT_INFO.whatsapp, // Preferred channel
        icon: Phone,
        label: '+62 855-3653-3330'
    },
    {
        name: 'Location',
        value: CONTACT_INFO.location,
        href: CONTACT_INFO.mapsLink,
        icon: MapPin,
        label: 'Bandung, Indonesia'
    }
];

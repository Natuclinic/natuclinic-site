import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

// Custom/Brand Icons that Lucide doesn't have or that need to be specific
const customIcons = {
    whatsapp: "M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.3-.8-1.8-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3-.6.6-.9 1.3-.9 2.1.1.9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2.9.4 1.4.5.5.2 1 .2 1.6.1.7-.1 1.3-.6 1.7-1.2.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2 5.5 0 9.9-4.4 9.9-9.9.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4",
    // Keep internal unicons paths if they are preferred for specific look
    // but mapping to Lucide is better for bundle size.
};

// Map current icon names to Lucide Icon names
const lucideMapping = {
    "instagram": "Instagram",
    "facebook": "Facebook",
    "linkedin": "Linkedin",
    "youtube": "Youtube",
    "twitter": "Twitter",
    "phone": "Phone",
    "envelope": "Mail",
    "user": "User",
    "search": "Search",
    "arrow-right": "ArrowRight",
    "arrow-left": "ArrowLeft",
    "arrow-up-right": "ArrowUpRight",
    "arrow-down": "ArrowDown",
    "angle-right": "ChevronRight",
    "angle-left": "ChevronLeft",
    "check": "Check",
    "check-circle": "CheckCircle2",
    "times": "X",
    "bars": "Menu",
    "plus": "Plus",
    "minus": "Minus",
    "trash": "Trash2",
    "edit": "Pencil",
    "upload": "Upload",
    "image": "Image",
    "video": "Video",
    "play": "Play",
    "pause": "Pause",
    "expand": "Maximize2",
    "spinner": "Loader2",
    "map-marker": "MapPin",
    "clock": "Clock",
    "lock": "Lock",
    "star": "Star",
    "tag": "Tag",
    "link": "Link",
    "share-alt": "Share2",
    "calendar-alt": "Calendar",
    "exclamation-circle": "AlertCircle",
    "arrows-h-alt": "ArrowsLeftRight",
};

const Unicon = ({ name, className = "w-5 h-5", size, color, strokeWidth = 2, animate = true, fill = false }) => {
    // 1. Check if it's a custom icon
    const customPath = customIcons[name];

    // 2. Check Lucide mapping
    const lucideName = lucideMapping[name];
    const LucideComponent = LucideIcons[lucideName];

    const commonProps = {
        className: `${className} flicker-fix`,
        style: {
            width: size || undefined,
            height: size || undefined,
            color: color || 'currentColor'
        }
    };

    // Animation settings for premium feel
    const motionProps = animate ? {
        initial: { opacity: 0, scale: 0.8 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 }
    } : {};

    if (LucideComponent) {
        const isFilled = fill || name === 'star';

        return (
            <motion.div
                {...motionProps}
                className={`inline-flex items-center justify-center ${className} flicker-fix`}
                style={{
                    width: size || undefined,
                    height: size || undefined,
                    color: color || 'currentColor'
                }}
            >
                <LucideComponent
                    size={size || 20}
                    strokeWidth={strokeWidth}
                    fill={isFilled ? 'currentColor' : 'none'}
                />
            </motion.div>
        );
    }

    if (customPath) {
        return (
            <motion.div
                {...motionProps}
                className={`inline-flex items-center justify-center ${className} flicker-fix`}
                style={{
                    width: size || undefined,
                    height: size || undefined,
                    color: color || 'currentColor'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ width: '100%', height: '100%' }}
                >
                    <path d={customPath} />
                </svg>
            </motion.div>
        );
    }

    console.warn(`Unicon: Icon "${name}" not found.`);
    return null;
};

export default Unicon;

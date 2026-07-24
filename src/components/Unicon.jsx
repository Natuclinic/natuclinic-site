import React from 'react';
import { motion } from 'motion/react';
import {
    Phone, Mail, User, Search,
    ArrowRight, ArrowLeft, ArrowUpRight, ArrowDown, ChevronRight, ChevronLeft,
    Check, CheckCircle2, X, Menu, Plus, Minus, Trash2, Pencil, Upload, Image,
    Video, Play, Pause, Maximize2, Loader2, MapPin, Clock, Lock, Star, Tag,
    Link, Share2, Calendar, AlertCircle, ArrowLeftRight, Microscope, Leaf,
    ZapOff, Zap, Activity, Heart, Globe, Stethoscope, Send, ShieldCheck
} from 'lucide-react';

const customIcons = {
    whatsapp: "M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.3-.8-1.8-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3-.6.6-.9 1.3-.9 2.1.1.9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2.9.4 1.4.5.5.2 1 .2 1.6.1.7-.1 1.3-.6 1.7-1.2.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2 5.5 0 9.9-4.4 9.9-9.9.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    youtube: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z",
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.213 5.767zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

const iconComponents = {
    "phone": Phone,
    "envelope": Mail,
    "user": User,
    "search": Search,
    "arrow-right": ArrowRight,
    "arrow-left": ArrowLeft,
    "arrow-up-right": ArrowUpRight,
    "arrow-down": ArrowDown,
    "angle-right": ChevronRight,
    "angle-left": ChevronLeft,
    "check": Check,
    "check-circle": CheckCircle2,
    "times": X,
    "bars": Menu,
    "plus": Plus,
    "minus": Minus,
    "trash": Trash2,
    "edit": Pencil,
    "upload": Upload,
    "image": Image,
    "video": Video,
    "play": Play,
    "pause": Pause,
    "expand": Maximize2,
    "spinner": Loader2,
    "map-marker": MapPin,
    "clock": Clock,
    "lock": Lock,
    "star": Star,
    "tag": Tag,
    "link": Link,
    "share-alt": Share2,
    "calendar-alt": Calendar,
    "exclamation-circle": AlertCircle,
    "arrows-h-alt": ArrowLeftRight,
    "microscope": Microscope,
    "leaf": Leaf,
    "zap-off": ZapOff,
    "zap": Zap,
    "activity": Activity,
    "heart": Heart,
    "globe": Globe,
    "stethoscope": Stethoscope,
    "send": Send,
    "shield-check": ShieldCheck,
};

const motionProps = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
};

const Unicon = ({ name, className = "w-5 h-5", size, color, strokeWidth = 2, animate = true, fill = false }) => {
    const LucideComponent = iconComponents[name];
    const customPath = customIcons[name];

    const wrapperProps = {
        className: `inline-flex items-center justify-center ${className} flicker-fix`,
        style: { width: size || undefined, height: size || undefined, color: color || 'currentColor' },
        ...(animate ? motionProps : {}),
    };

    if (LucideComponent) {
        return (
            <motion.div {...wrapperProps}>
                <LucideComponent
                    size={size || 20}
                    strokeWidth={strokeWidth}
                    fill={fill || name === 'star' ? 'currentColor' : 'none'}
                />
            </motion.div>
        );
    }

    if (customPath) {
        return (
            <motion.div {...wrapperProps}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
                    <path d={customPath} />
                </svg>
            </motion.div>
        );
    }

    console.warn(`Unicon: Icon "${name}" not found.`);
    return null;
};

export default Unicon;

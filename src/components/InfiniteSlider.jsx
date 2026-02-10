import React, { useRef, useEffect, useState } from 'react';

// Configuration
const CONFIG = {
    SCROLL_SPEED: 0.75,
    LERP_FACTOR: 0.05,
    BUFFER_SIZE: 5,
    MAX_VELOCITY: 150,
    SNAP_DURATION: 500,
};

// Data
const PROJECT_DATA = [
    {
        title: "Redroom Gesture 14",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
        category: "Concept Series",
        year: "2025",
        description: "Expressive motion study",
    },
    {
        title: "Shadowwear 6AM",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
        category: "Photography",
        year: "2024",
        description: "Urban portrait series",
    },
    {
        title: "Blur Formation 03",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
        category: "Kinetic Study",
        year: "2024",
        description: "Motion blur experiment",
    },
    {
        title: "Sunglass Operator",
        image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop",
        category: "Editorial Motion",
        year: "2023",
        description: "Fashion editorial piece",
    },
    {
        title: "Azure Figure 5",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop",
        category: "Visual Research",
        year: "2024",
        description: "Color theory exploration",
    },
];

// Utility functions
const lerp = (start, end, factor) => start + (end - start) * factor;

const getProjectData = (index) => {
    const i = ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) % PROJECT_DATA.length;
    return PROJECT_DATA[i];
};

const getProjectNumber = (index) => {
    return (((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) % PROJECT_DATA.length + 1)
        .toString()
        .padStart(2, "0");
};

const InfiniteSlider = () => {
    const [visibleRange, setVisibleRange] = useState({
        min: -CONFIG.BUFFER_SIZE,
        max: CONFIG.BUFFER_SIZE,
    });

    const state = useRef({
        currentY: 0,
        targetY: 0,
        isDragging: false,
        isSnapping: false,
        snapStart: { time: 0, y: 0, target: 0 },
        lastScrollTime: Date.now(),
        dragStart: { y: 0, scrollY: 0 },
        projectHeight: 0,
        minimapHeight: 250,
    });

    const projectsRef = useRef(new Map());
    const minimapRef = useRef(new Map());
    const infoRef = useRef(new Map());
    const requestRef = useRef();
    const renderedRange = useRef({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });

    const updateParallax = (img, scroll, index, height) => {
        if (!img) return;
        if (!img.dataset.parallaxCurrent) {
            img.dataset.parallaxCurrent = "0";
        }

        let current = parseFloat(img.dataset.parallaxCurrent);
        const target = (-scroll - index * height) * 0.2;
        current = lerp(current, target, 0.1);

        if (Math.abs(current - target) > 0.01) {
            img.style.transform = `translateY(${current}px) scale(1.5)`;
            img.dataset.parallaxCurrent = current.toString();
        }
    };

    const updateSnap = () => {
        const s = state.current;
        const progress = Math.min((Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
        if (progress >= 1) s.isSnapping = false;
    };

    const snapToProject = () => {
        const s = state.current;
        const current = Math.round(-s.targetY / s.projectHeight);
        const target = -current * s.projectHeight;
        s.isSnapping = true;
        s.snapStart = {
            time: Date.now(),
            y: s.targetY,
            target: target,
        };
    };

    const updatePositions = () => {
        const s = state.current;
        const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

        // Update Projects
        projectsRef.current.forEach((el, index) => {
            const y = index * s.projectHeight + s.currentY;
            el.style.transform = `translateY(${y}px)`;
            const img = el.querySelector("img");
            updateParallax(img, s.currentY, index, s.projectHeight);
        });

        // Update Minimap Images
        minimapRef.current.forEach((el, index) => {
            const y = index * s.minimapHeight + minimapY;
            el.style.transform = `translateY(${y}px)`;
            const img = el.querySelector("img");
            if (img) {
                updateParallax(img, minimapY, index, s.minimapHeight);
            }
        });

        // Update Info
        infoRef.current.forEach((el, index) => {
            const y = index * s.minimapHeight + minimapY;
            el.style.transform = `translateY(${y}px)`;
        });
    };

    const animate = () => {
        const s = state.current;
        const now = Date.now();

        if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
            const snapPoint = -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
            if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
        }

        if (s.isSnapping) updateSnap();
        if (!s.isDragging) {
            s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
        }

        updatePositions();
    };

    const animationLoop = () => {
        animate();

        const s = state.current;
        // Avoid division by zero
        if (s.projectHeight === 0) {
            requestRef.current = requestAnimationFrame(animationLoop);
            return;
        }

        const currentIndex = Math.round(-s.targetY / s.projectHeight);
        const min = currentIndex - CONFIG.BUFFER_SIZE;
        const max = currentIndex + CONFIG.BUFFER_SIZE;

        if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
            renderedRange.current = { min, max };
            setVisibleRange({ min, max });
        }

        requestRef.current = requestAnimationFrame(animationLoop);
    };

    useEffect(() => {
        state.current.projectHeight = window.innerHeight;

        const onResize = () => {
            const container = document.querySelector('.parallax-container');
            if (container) {
                state.current.projectHeight = container.clientHeight;
            }
        }

        const container = document.querySelector('.parallax-container');
        if (container) {
            state.current.projectHeight = container.clientHeight;
            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                const s = state.current;
                s.isSnapping = false;
                s.lastScrollTime = Date.now();
                const delta = Math.max(Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY), -CONFIG.MAX_VELOCITY);
                s.targetY -= delta;
            }, { passive: false });
        }

        window.addEventListener("resize", onResize);

        onResize();
        requestRef.current = requestAnimationFrame(animationLoop);

        return () => {
            window.removeEventListener("resize", onResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const indices = [];
    for (let i = visibleRange.min; i <= visibleRange.max; i++) {
        indices.push(i);
    }

    return (
        <div className="relative w-full h-[600px] md:h-screen overflow-hidden bg-black text-white px-8 parallax-container select-none">
            {/* Project List */}
            <div className="absolute left-0 md:left-[10%] top-0 h-full w-full md:w-[40%] flex flex-col justify-center pointer-events-none">
                {indices.map(i => {
                    const data = getProjectData(i);
                    return (
                        <div
                            key={i}
                            className="absolute w-full aspect-[3/4] overflow-hidden"
                            ref={(el) => {
                                if (el) projectsRef.current.set(i, el);
                                else projectsRef.current.delete(i);
                            }}
                            style={{ top: 0, left: 0 }}
                        >
                            <img src={data.image} alt={data.title} className="w-full h-full object-cover origin-center transform scale-150" />
                        </div>
                    )
                })}
            </div>

            {/* Minimap */}
            <div className="absolute right-[5%] top-[50%] -translate-y-[50%] w-[30%] h-[250px] overflow-hidden hidden md:block border border-white/10 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                {/* Images */}
                <div className="absolute left-0 w-[100px] h-full overflow-hidden">
                    {indices.map(i => {
                        const data = getProjectData(i);
                        return (
                            <div
                                key={i}
                                className="absolute w-full h-full top-0 left-0 overflow-hidden"
                                ref={(el) => {
                                    if (el) minimapRef.current.set(i, el);
                                    else minimapRef.current.delete(i);
                                }}
                            >
                                <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                            </div>
                        )
                    })}
                </div>

                {/* Info */}
                <div className="absolute left-[120px] top-0 w-[calc(100%-120px)] h-full">
                    {indices.map(i => {
                        const data = getProjectData(i);
                        const num = getProjectNumber(i);
                        return (
                            <div
                                key={i}
                                className="absolute top-0 left-0 w-full h-full flex flex-col justify-center text-xs tracking-wider"
                                ref={(el) => {
                                    if (el) infoRef.current.set(i, el);
                                    else infoRef.current.delete(i);
                                }}
                            >
                                <div className="flex justify-between mb-2">
                                    <span>{num}</span>
                                    <span className="font-bold">{data.title}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 mb-2">
                                    <span>{data.category}</span>
                                    <span>{data.year}</span>
                                </div>
                                <div className="text-gray-500 line-clamp-2">
                                    {data.description}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Overlay Gradient Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:hidden z-10"></div>

            {/* Hint Text */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] uppercase tracking-widest z-20">
                Scroll to Explore
            </div>
        </div>
    );
};

export default InfiniteSlider;

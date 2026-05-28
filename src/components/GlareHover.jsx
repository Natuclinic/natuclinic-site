import React, { useRef } from 'react';

const GlareHover = ({
    children,
    glareColor = "#ffffff",
    glareOpacity = 0.3,
    transitionDuration = 500,
    className = "",
    style = {}
}) => {
    const containerRef = useRef(null);
    const innerRef = useRef(null);
    const glareRef = useRef(null);
    const rectRef = useRef(null);

    const handleMouseEnter = () => {
        // Cache rect once on enter — avoids getBoundingClientRect on every mousemove
        rectRef.current = containerRef.current.getBoundingClientRect();

        if (innerRef.current) {
            innerRef.current.style.transition = 'transform 0.1s cubic-bezier(0.2, 0, 0.2, 1)';
        }
        if (glareRef.current) {
            glareRef.current.style.opacity = glareOpacity;
        }
    };

    const handleMouseLeave = () => {
        rectRef.current = null;

        if (innerRef.current) {
            innerRef.current.style.transition = `transform ${transitionDuration}ms ease-out`;
            innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
        if (glareRef.current) {
            glareRef.current.style.opacity = 0;
            glareRef.current.style.transition = `opacity ${transitionDuration}ms`;
        }
    };

    const handleMouseMove = (e) => {
        const rect = rectRef.current;
        if (!rect || !innerRef.current || !glareRef.current) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        const MAX_TILT = 3;
        const xNorm = (x - rect.width / 2) / (rect.width / 2);
        const yNorm = (y - rect.height / 2) / (rect.height / 2);

        // Write directly to DOM — no setState, no re-render
        innerRef.current.style.transform = `rotateX(${-yNorm * MAX_TILT}deg) rotateY(${xNorm * MAX_TILT}deg)`;
        glareRef.current.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, ${glareColor}, transparent 60%)`;
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d', ...style }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={innerRef}
                style={{
                    transform: 'rotateX(0deg) rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                {children}
                <div
                    ref={glareRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        pointerEvents: 'none',
                        mixBlendMode: 'soft-light',
                        transition: `opacity ${transitionDuration}ms`,
                        zIndex: 50,
                        borderRadius: 'inherit',
                    }}
                />
            </div>
        </div>
    );
};

export default GlareHover;

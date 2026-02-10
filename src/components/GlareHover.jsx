import React, { useRef, useState } from 'react';

const GlareHover = ({
    children,
    glareColor = "#ffffff",
    glareOpacity = 0.3,
    transitionDuration = 500,
    className = "",
    style = {}
}) => {
    const ref = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percent for glare
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Calculate rotation
        // Center is (0,0) rotation.
        // Max tilt is small, e.g. 2 degrees, to be subtle like the visual style
        const MAX_TILT = 3;

        const xCenter = rect.width / 2;
        const yCenter = rect.height / 2;

        // Normalize -1 to 1
        const xNorm = (x - xCenter) / xCenter;
        const yNorm = (y - yCenter) / yCenter;

        // Tilt math: mov up (y negative) -> rotateX positive. mov right (x positive) -> rotateY positive
        const rotX = -yNorm * MAX_TILT;
        const rotY = xNorm * MAX_TILT;

        setRotation({ x: rotX, y: rotY });
        setGlarePos({ x: xPercent, y: yPercent });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 });
        // Optional: reset glare to center or leave it
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                ...style
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transition: isHovering ? 'transform 0.1s cubic-bezier(0.2, 0, 0.2, 1)' : `transform ${transitionDuration}ms ease-out`,
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                {children}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 60%)`,
                        opacity: isHovering ? glareOpacity : 0,
                        pointerEvents: 'none',
                        mixBlendMode: 'soft-light', // soft-light or overlay usually looks best for glare
                        transition: isHovering ? 'opacity 0.2s' : `opacity ${transitionDuration}ms`,
                        zIndex: 50,
                        borderRadius: 'inherit' // Inherits from the child usually if it fills, but here it inherits from this abs div. 
                        // We need to ensure the parent of this div has radius. 
                        // In usage, we will put this inside the rounded card or wrap the rounded card.
                    }}
                />
            </div>
        </div>
    );
};

export default GlareHover;

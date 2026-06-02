import * as React from "react";
import { cn } from "../App";

export const ImageComparisonSlider = React.forwardRef(
    (
        {
            className,
            leftImage,
            rightImage,
            altLeft = "Left image",
            altRight = "Right image",
            initialPosition = 50,
            ...props
        },
        ref
    ) => {
        const [sliderPosition, setSliderPosition] = React.useState(0);
        const [isHovered, setIsHovered] = React.useState(false);
        const [isDragging, setIsDragging] = React.useState(false);
        const containerRef = React.useRef(null);

        const getPositionFromClientX = (clientX) => {
            if (!containerRef.current) return 0;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            return Math.max(0, Math.min(100, (x / rect.width) * 100));
        };

        // Desktop: follow mouse without drag
        const handleMouseMove = (e) => {
            setSliderPosition(getPositionFromClientX(e.clientX));
        };

        const handleMouseEnter = (e) => {
            setIsHovered(true);
            setSliderPosition(getPositionFromClientX(e.clientX));
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            setSliderPosition(0);
        };

        // Mobile: drag to reveal
        const handleTouchStart = (e) => {
            setIsDragging(true);
            setSliderPosition(getPositionFromClientX(e.touches[0].clientX));
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            setSliderPosition(getPositionFromClientX(e.touches[0].clientX));
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        const showDivider = isHovered || isDragging;

        return (
            <div
                ref={containerRef}
                className={cn(
                    "relative w-full h-full overflow-hidden select-none",
                    className
                )}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                {...props}
            >
                {/* Right Image — depois (base layer) */}
                <img
                    src={rightImage}
                    alt={altRight}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />

                {/* Left Image — antes (revealed layer) */}
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    style={{
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                        transition: showDivider ? 'none' : 'clip-path 0.6s ease',
                    }}
                >
                    <img
                        src={leftImage}
                        alt={altLeft}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Divider — só aparece ao interagir */}
                {showDivider && (
                    <div
                        className="absolute top-0 h-full w-px bg-white/60 pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                    />
                )}
            </div>
        );
    }
);

ImageComparisonSlider.displayName = "ImageComparisonSlider";

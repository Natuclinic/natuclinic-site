import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

const CircularText = ({
    text,
    spinDuration = 20,
    onHover = "speedUp",
    className = "",
}) => {
    const letters = Array.from(text);
    const angle = 360 / letters.length;
    const controls = useAnimation();
    const [currentDuration, setCurrentDuration] = useState(spinDuration);

    useEffect(() => {
        controls.start({
            rotate: 360,
            transition: {
                duration: currentDuration,
                ease: "linear",
                repeat: Infinity,
            },
        });
    }, [currentDuration, controls]);

    const handleMouseEnter = () => {
        if (onHover === "speedUp") {
            setCurrentDuration(spinDuration / 4);
        } else if (onHover === "slowDown") {
            setCurrentDuration(spinDuration * 4);
        } else if (onHover === "pause") {
            controls.stop();
        }
    };

    const handleMouseLeave = () => {
        if (onHover === "pause") {
            controls.start({
                rotate: 360,
                transition: {
                    duration: currentDuration,
                    ease: "linear",
                    repeat: Infinity,
                },
            });
        } else {
            setCurrentDuration(spinDuration);
        }
    };

    return (
        <div
            className={`relative flex items-center justify-center rounded-full ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                animate={controls}
                className="absolute w-full h-full flex items-center justify-center"
            >
                {letters.map((letter, i) => (
                    <span
                        key={i}
                        className="absolute top-0 left-1/2 -translate-x-1/2 origin-[0_100px]" // Assuming 200px width/height container, radius 100px. Adjust via CSS/className if needed.
                        // Actually, we need to be dynamic or standard.
                        // Better approach: use 50% height as radius.
                        style={{
                            height: "50%", // Radius is half height
                            transformOrigin: "bottom center",
                            transform: `rotate(${i * angle}deg)`,
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default CircularText;

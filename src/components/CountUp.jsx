import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

const CountUp = ({
    from = 0,
    to = 100,
    separator = ',',
    decimals = 0,
    decimal = '.',
    suffix = '',
    prefix = '',
    duration = 2,
    className = '',
    startCounting = null, // Logic to handle manual trigger if needed
}) => {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // If startCounting is explicitly provided, follow it
        if (startCounting !== null) {
            setInView(startCounting);
            return;
        }

        // Otherwise use IntersectionObserver
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [startCounting]);

    const { number } = useSpring({
        from: { number: from },
        to: { number: inView ? to : from },
        delay: 200,
        config: { duration: duration * 1000 },
    });

    return (
        <span ref={ref} className={className}>
            <animated.span>
                {number.to((n) => {
                    const fixed = n.toFixed(decimals);
                    const [int, dec] = fixed.split('.');
                    // Add separator
                    const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                    return `${prefix}${intFormatted}${decimals > 0 ? decimal + dec : ''}${suffix}`;
                })}
            </animated.span>
        </span>
    );
};

export default CountUp;

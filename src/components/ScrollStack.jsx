import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 0, // Changed to 0 for overlapped start
    itemScale = 0.05,
    itemStackDistance = 40,
    stackPosition = '15%',
    scaleEndPosition = '5%',
    baseScale = 0.9,
    scaleDuration = 0.8,
    rotationAmount = 0,
    blurAmount = 2,
    useWindowScroll = false,
    onStackComplete
}) => {
    const scrollerRef = useRef(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef(null);
    const lenisRef = useRef(null);
    const cardsRef = useRef([]);
    const lastTransformsRef = useRef(new Map());
    const isUpdatingRef = useRef(false);
    // Cache dos offsets dos cards — atualizado no mount e no resize, nunca no scroll
    const cardOffsetsRef = useRef([]);
    const endOffsetRef = useRef(0);

    const calculateProgress = useCallback((scrollTop, start, end) => {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }, []);

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }, []);

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
                scrollContainer: document.documentElement
            };
        } else {
            const scroller = scrollerRef.current;
            return {
                scrollTop: scroller.scrollTop,
                containerHeight: scroller.clientHeight,
                scrollContainer: scroller
            };
        }
    }, [useWindowScroll]);

    const measureOffsets = useCallback(() => {
        const cards = cardsRef.current;
        if (!cards.length) return;
        if (useWindowScroll) {
            // Batch all reads before any writes to avoid layout thrashing
            cardOffsetsRef.current = cards.map(c => {
                const rect = c.getBoundingClientRect();
                return rect.top + window.scrollY;
            });
            const endEl = document.querySelector('.scroll-stack-end');
            endOffsetRef.current = endEl
                ? endEl.getBoundingClientRect().top + window.scrollY
                : 0;
        } else {
            cardOffsetsRef.current = cards.map(c => c.offsetTop);
            const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
            endOffsetRef.current = endEl ? endEl.offsetTop : 0;
        }
    }, [useWindowScroll]);

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        const { scrollTop, containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        // Lê do cache — sem getBoundingClientRect no caminho crítico do scroll
        const endElementTop = endOffsetRef.current;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const cardTop = cardOffsetsRef.current[i] ?? 0;
            // Logic for Cards sticking together at start
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            const pinEnd = endElementTop - containerHeight / 2;

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);

            let blur = 0;
            if (blurAmount) {
                let topCardIndex = 0;
                const offsets = cardOffsetsRef.current;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = offsets[j] ?? 0;
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }
                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * blurAmount);
                }
            }

            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                blur: Math.round(blur * 100) / 100
            };

            const lastTransform = lastTransformsRef.current.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.05 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.0005 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.05;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransformsRef.current.set(i, newTransform);
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        blurAmount,
        useWindowScroll,
        calculateProgress,
        parsePercentage,
        getScrollData,
    ]);

    const setupLenis = useCallback(() => {
        const lenisOptions = {
            duration: 1.5, // Increased for more fluidity
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2.5,
            lerp: 0.08, // Slightly lower for smoother follow
            syncTouch: true,
        };

        if (useWindowScroll) {
            const lenis = new Lenis(lenisOptions);
            lenis.on('scroll', updateCardTransforms);

            const raf = time => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);
            lenisRef.current = lenis;
            return lenis;
        } else {
            const scroller = scrollerRef.current;
            if (!scroller) return;
            const lenis = new Lenis({
                ...lenisOptions,
                wrapper: scroller,
                content: scroller.querySelector('.scroll-stack-inner'),
            });
            lenis.on('scroll', updateCardTransforms);
            const raf = time => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);
            lenisRef.current = lenis;
            return lenis;
        }
    }, [updateCardTransforms, useWindowScroll]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const cards = Array.from(
            useWindowScroll
                ? document.querySelectorAll('.scroll-stack-card')
                : scroller.querySelectorAll('.scroll-stack-card')
        );

        cardsRef.current = cards;

        cards.forEach((card, i) => {
            // Overlap cards initially by setting negative margin
            if (i > 0) {
                card.style.marginTop = `-${itemStackDistance * 10}px`; // Extreme overlap
            }
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';
        });

        measureOffsets();
        setupLenis();
        updateCardTransforms();

        // Recalcula offsets quando o layout muda (resize de janela ou imagens carregando)
        const ro = new ResizeObserver(() => measureOffsets());
        ro.observe(useWindowScroll ? document.body : scroller);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (lenisRef.current) lenisRef.current.destroy();
            lastTransformsRef.current.clear();
            ro.disconnect();
        };
    }, [itemDistance, itemStackDistance, useWindowScroll, setupLenis, updateCardTransforms, measureOffsets]);

    return (
        <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
            <div className="scroll-stack-inner">
                {children}
                <div className="scroll-stack-end h-[50vh]" />
            </div>
        </div>
    );
};

export default ScrollStack;

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
    {
        image: hero1,
        title: "ANIME MEETS\nSTREETWEAR",
        subtitle: "New Collection 2026",
        cta: "SHOP NOW",
        link:"/category/new-drops",
    },
    {
        image: hero2,
        title: "PREMIUM\nDROP SEASON",
        subtitle: "Limited Edition Prints",
        cta: "EXPLORE",
        link: "/category/t-shirts",
    },
    {
       image: hero3,
        title: "CRAFTED\nWITH DETAIL",
        subtitle: "Quality You Can Feel",
        cta: "DISCOVER", 
        link: "/category/hoodies",
    },
];

const HeroCarousel = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback(
        (index: number) => {
            setDirection(index > current ? 1 : -1);
            setCurrent(index);
        },
        [current]
    );

    const next = useCallback(() => {
        setDirection(1);
        setCurrent((p) => (p + 1) % slides.length);
    }, []);

    const prev = useCallback(() => {
        setDirection(1);
        setCurrent((p) => (p + 1) % slides.length);
    }, []);

    const [touchStart, setTouchStart] = useState(0);
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    };



    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <section
            className="relative w-full h-[85vh] sm:h-screen overflow-hidden mt-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
                >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    >
                    <p className="text-primary font-medium text-sm sm:text-base tracking-[0.3em] uppercase mb-3">
                        {slide.subtitle}
                    </p>
                    <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl leading-[0.9] tracking-tight text-foreground whitespace-pre-line mb-6">
                        {slide.title}
                    </h1>
                    <button 
                    onClick={() => navigate(slide.link)}
                    className="group relative px-8 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest hover-neon overflow-hidden">
                        
                        <span className="relative z-10">{slide.cta}</span>
                        <div className="absolute inset-0 bg-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    </motion.div>
                </AnimatePresence>
                </div>
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, i) => (
                <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                    i === current
                        ? "w-8 bg-primary neon-border"
                        : "w-4 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;

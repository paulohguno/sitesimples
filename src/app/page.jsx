"use client";

import { useState, useEffect, useRef } from "react";

const courses = [
    {
        id: 1,
        title: "40 Receitas de Maioneses",
        subtitle: "As mais saborosas do mundo",
        bg: "/curso1.jpg",
        href: "https://pay.hotmart.com/K106277932W",
        slideDir: "left",
        overlayColor: "bg-orange-500",
        textColor: "text-white",
        btnStyle: "bg-white/10 text-white border-white/30",
    },
    {
        id: 2,
        title: "Petiscos e Docinhos",
        subtitle: "Receitas Gourmets exclusivas",
        bg: "/curso2.jpg",
        href: "https://pay.hotmart.com/W106347526X",
        slideDir: "right",
        overlayColor: "bg-pink-700",
        textColor: "text-white",
        btnStyle: "bg-white/10 text-white border-white/30",
    },
    
];

function InteractiveGrid({ mouseRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        let points = [];
        const gridSize = 40;
        let rows = 0;
        let cols = 0;

        const initGrid = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            rows = Math.ceil(canvas.height / gridSize) + 2;
            cols = Math.ceil(canvas.width / gridSize) + 2;
            points = [];

            for (let r = 0; r < rows; r++) {
                points[r] = [];
                for (let c = 0; c < cols; c++) {
                    const x = c * gridSize;
                    const y = r * gridSize;
                    points[r][c] = {
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        vx: 0,
                        vy: 0,
                    };
                }
            }
        };

        window.addEventListener("resize", initGrid);
        initGrid();

        let currentMouse = { x: -1000, y: -1000 };

        const draw = () => {
            currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.08;
            currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.08;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p = points[r][c];

                    const dx = p.baseX - currentMouse.x;
                    const dy = p.baseY - currentMouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 250;

                    if (dist < maxDist) {
                        const force = Math.pow((maxDist - dist) / maxDist, 2);
                        const angle = Math.atan2(dy, dx);
                        
                        p.vx += Math.cos(angle) * force * 0.8;
                        p.vy += Math.sin(angle) * force * 0.8;
                    }

                    p.vx += (p.baseX - p.x) * 0.015;
                    p.vy += (p.baseY - p.y) * 0.015;

                    p.vx *= 0.92;
                    p.vy *= 0.92;

                    p.x += p.vx;
                    p.y += p.vy;
                }
            }

            ctx.beginPath();
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p = points[r][c];
                    if (c === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
            }

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const p = points[r][c];
                    if (r === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
            }

            ctx.stroke();
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", initGrid);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mouseRef]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}

function CourseSection({ course, index }) {
    const [hovered, setHovered] = useState(false);

    const isLeft = course.slideDir === "left";

    // Modificado: Sobe o texto no mobile e joga para os lados no PC
    const translateClass = hovered
        ? isLeft
            ? "-translate-y-6 md:translate-y-0 md:-translate-x-[20%]"
            : "-translate-y-6 md:translate-y-0 md:translate-x-[20%]"
        : "translate-y-0 translate-x-0";

    return (
        <section
            className="relative w-full overflow-hidden cursor-pointer min-h-[25vh] flex-1"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={() => setHovered((v) => !v)}
            aria-label={`Curso: ${course.title}`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.bg})` }}
            />

            <div
                className={`absolute inset-0 ${course.overlayColor} transition-opacity duration-500 ${
                    hovered ? "opacity-40" : "opacity-70"
                }`}
            />

            <div
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${translateClass}`}
            >
                <div className="text-center px-8 select-none">
                    <h2
                        className={`text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg ${course.textColor}`}
                    >
                        {course.title}
                    </h2>
                    <p
                        className={`mt-1 text-sm md:text-base font-medium drop-shadow ${course.textColor} opacity-90`}
                    >
                        {course.subtitle}
                    </p>
                </div>
            </div>

            {/* Modificado: Botão alinhado embaixo no mobile e nas laterais no PC (ajustado para centralizar verticalmente no PC) */}
            <div
                className={`absolute z-10 flex transition-all duration-500 ease-in-out
                    w-full justify-center bottom-6
                    md:w-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2
                    ${isLeft ? "md:right-10" : "md:left-10"}
                    ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
                `}
            >
                <a
                    href={course.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base
                        shadow-2xl border-2
                        transition-transform duration-200 hover:scale-105 active:scale-95
                        ${course.btnStyle}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    Acessar curso
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            <div
                className={`absolute top-0 bottom-0 w-1 ${
                    index % 2 === 0 ? "left-0" : "right-0"
                } bg-white/20`}
            />
        </section>
    );
}

export default function LandingPage() {
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const [scrollY, setScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseLeave = () => {
        mouseRef.current = { x: -1000, y: -1000 };
    };

    const textOpacity = mounted ? Math.max(1 - scrollY / 200, 0) : 0;
    const textTranslateY = mounted ? scrollY * 0.4 : 30;

    return (
        <main className="min-h-screen flex flex-col font-sans">
            <section
                className="relative w-full bg-black flex flex-col items-center justify-center py-10 px-6 overflow-hidden min-h-[35vh]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <InteractiveGrid mouseRef={mouseRef} />

                <div
                    className="relative z-10 text-center transition-all duration-700 ease-out pointer-events-none"
                    style={{
                        opacity: textOpacity,
                        transform: `translateY(${textTranslateY}px)`,
                    }}
                >
                    <span className="inline-block text-xs tracking-[0.3em] uppercase text-white/40 mb-3 font-semibold">
                        Centro de Excelência Gastronômica
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase">
                        Seja Bem-vindo
                    </h1>
                    <p className="mt-3 text-white/60 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        Explore nossa curadoria de conteúdos premium e impulsione suas competências profissionais
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-5 pointer-events-auto">
                        {["bg-orange-500", "bg-pink-600", "bg-green-500", "bg-sky-400"].map(
                            (c, i) => (
                                <span
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full ${c} opacity-80`}
                                />
                            )
                        )}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />
            </section>

            <div className="flex-1 flex flex-col z-20">
                {courses.map((course, index) => (
                    <CourseSection key={`${course.id}-${index}`} course={course} index={index} />
                ))}
            </div>

            <footer className="bg-black text-white/30 text-center text-xs py-3 tracking-widest uppercase z-20">
                © {new Date().getFullYear()} — Todos os direitos reservados
            </footer>
        </main>
    );
}

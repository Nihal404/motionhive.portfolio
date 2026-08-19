// ParticleText adapted for the portfolio's vanilla JavaScript runtime.

(() => {
    "use strict";

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const easeOut = (value) => 1 - Math.pow(1 - value, 3);

    const initParticleText = (container) => {
        const canvas = container.querySelector(".particle-text-canvas");
        const fallback = container.querySelector(".particle-text-fallback");
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const text = container.dataset.text || "Featured Projects";
        const particles = [];
        const pointer = { active: false, x: 0, y: 0 };
        let width = 0;
        let height = 0;
        let animationFrame = 0;
        let gathering = false;
        let gatherStart = 0;
        let resizeFrame = 0;

        const sampleText = () => {
            const bounds = container.getBoundingClientRect();
            width = Math.max(1, Math.floor(bounds.width));
            height = Math.max(72, Math.floor(bounds.height));
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);

            const computed = getComputedStyle(container);
            const fontSize = parseFloat(computed.fontSize) || 72;
            const font = `${computed.fontWeight || 700} ${fontSize}px ${computed.fontFamily || "sans-serif"}`;
            const offscreen = document.createElement("canvas");
            const offscreenContext = offscreen.getContext("2d", { willReadFrequently: true });
            if (!offscreenContext) return;

            offscreenContext.font = font;
            offscreenContext.textAlign = "center";
            offscreenContext.textBaseline = "middle";
            const measured = offscreenContext.measureText(text);
            const textWidth = Math.min(width * 0.94, measured.width);
            const scale = measured.width > width * 0.94 ? textWidth / measured.width : 1;
            offscreen.width = Math.ceil(measured.width * scale + 20);
            offscreen.height = Math.ceil(fontSize * 1.25);
            offscreenContext.font = `${computed.fontWeight || 700} ${fontSize * scale}px ${computed.fontFamily || "sans-serif"}`;
            offscreenContext.textAlign = "center";
            offscreenContext.textBaseline = "middle";
            offscreenContext.fillStyle = "#fff";
            offscreenContext.fillText(text, offscreen.width / 2, offscreen.height / 2);

            const image = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height);
            const targets = [];
            const density = 4;
            for (let y = 0; y < offscreen.height; y += density) {
                for (let x = 0; x < offscreen.width; x += density) {
                    const alpha = image.data[(y * offscreen.width + x) * 4 + 3];
                    if (alpha > 60) {
                        targets.push({
                            x: width / 2 - offscreen.width / 2 + x,
                            y: height / 2 - offscreen.height / 2 + y,
                            alpha: alpha / 255
                        });
                    }
                }
            }

            particles.length = 0;
            targets.forEach((target, index) => {
                const seed = ((index * 9301 + 49297) % 233280) / 233280;
                const angle = seed * Math.PI * 2;
                const distance = 150 * (0.35 + seed * 0.75);
                particles.push({
                    x: target.x + Math.cos(angle) * distance,
                    y: target.y + Math.sin(angle) * distance,
                    targetX: target.x,
                    targetY: target.y,
                    startX: target.x,
                    startY: target.y,
                    delay: seed * 420,
                    size: 1.4 + target.alpha * 0.8,
                    seed,
                    color: seed > 0.7 ? "#8b5cf6" : "#ffffff"
                });
            });

            gathering = false;
        };

        const startGather = () => {
            if (!particles.length) return;
            const now = performance.now();
            particles.forEach((particle) => {
                particle.startX = particle.x;
                particle.startY = particle.y;
                particle.delay = particle.seed * 420;
            });
            gatherStart = now;
            gathering = true;
            container.classList.add("is-ready");
        };

        const render = (now) => {
            context.clearRect(0, 0, width, height);
            let complete = true;
            particles.forEach((particle) => {
                let x = particle.targetX;
                let y = particle.targetY;
                let progress = 1;

                if (gathering) {
                    progress = clamp((now - gatherStart - particle.delay) / 1600, 0, 1);
                    const eased = easeOut(progress);
                    x = particle.startX + (particle.targetX - particle.startX) * eased;
                    y = particle.startY + (particle.targetY - particle.startY) * eased;
                    if (progress < 1) complete = false;
                } else {
                    x += Math.sin(now * 0.001 + particle.seed * 10) * 0.7;
                    y += Math.cos(now * 0.0008 + particle.seed * 12) * 0.7;
                }

                if (pointer.active) {
                    const dx = x - pointer.x;
                    const dy = y - pointer.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance > 0 && distance < 120) {
                        const force = Math.pow(1 - distance / 120, 2) * 40;
                        x += dx / distance * force;
                        y += dy / distance * force;
                    }
                }

                context.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
                context.fillStyle = particle.color;
                context.shadowBlur = 6;
                context.shadowColor = "#8b5cf6";
                context.fillRect(x - particle.size / 2, y - particle.size / 2, particle.size, particle.size);
            });
            context.globalAlpha = 1;
            context.shadowBlur = 0;
            if (gathering && complete) gathering = false;
            animationFrame = requestAnimationFrame(render);
        };

        const updatePointer = (event) => {
            const bounds = canvas.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
            pointer.active = true;
        };

        sampleText();
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                startGather();
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(container);
        container.addEventListener("pointerenter", updatePointer);
        container.addEventListener("pointermove", updatePointer);
        container.addEventListener("pointerleave", () => { pointer.active = false; });
        const resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(() => {
                sampleText();
                if (container.classList.contains("is-ready")) startGather();
            });
        });
        resizeObserver.observe(container);
        animationFrame = requestAnimationFrame(render);

        if (fallback) fallback.setAttribute("aria-hidden", "true");
    };

    const init = () => document.querySelectorAll(".particle-text").forEach(initParticleText);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();

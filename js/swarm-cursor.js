// SwarmCursor adapted for the portfolio's vanilla JavaScript runtime.

(() => {
    "use strict";

    const initSwarmCursor = () => {
        const container = document.getElementById("swarm-cursor");
        const canvas = container?.querySelector(".swarm-cursor-canvas");
        const context = canvas?.getContext("2d");
        if (!container || !canvas || !context) return;

        const settings = {
            color: "#ffffff",
            accentColor: "#b983ff",
            count: 10,
            size: 10,
            spread: 100,
            separation: 0.15,
            speed: 2.5,
            wander: 0.25,
            trail: 0.75,
            glow: 0.75,
            opacity: 0.9,
            scatterOnClick: true,
        };
        const maxParticles = 24;
        const historyLength = 18;
        const particles = [];
        const history = Array.from({ length: historyLength }, () => []);
        const cursor = { x: innerWidth / 2, y: innerHeight / 2, has: false };
        let width = 1;
        let height = 1;
        let animationFrame = 0;
        let lastTime = performance.now();
        let burst = 0;

        const resize = () => {
            const ratio = Math.min(devicePixelRatio || 1, 1.75);
            width = innerWidth;
            height = innerHeight;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const spawn = (particle, anchorX, anchorY) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 35 + Math.random() * settings.spread;
            particle.x = anchorX + Math.cos(angle) * distance;
            particle.y = anchorY + Math.sin(angle) * distance;
            particle.vx = Math.cos(angle) * 50;
            particle.vy = Math.sin(angle) * 50;
            particle.phase = Math.random() * 10;
            particle.scale = 0.65 + Math.random() * 0.6;
        };

        const ensureParticles = () => {
            while (particles.length < Math.min(maxParticles, settings.count)) {
                const particle = {};
                spawn(particle, cursor.x, cursor.y);
                particles.push(particle);
            }
            particles.length = Math.min(maxParticles, Math.max(1, Math.round(settings.count)));
        };

        const updatePointer = (event) => {
            cursor.x = event.clientX;
            cursor.y = event.clientY;
            cursor.has = true;
        };

        const scatter = () => {
            if (!settings.scatterOnClick) return;
            particles.forEach((particle) => {
                const dx = particle.x - cursor.x;
                const dy = particle.y - cursor.y;
                const distance = Math.max(1, Math.hypot(dx, dy));
                particle.vx = dx / distance * 650;
                particle.vy = dy / distance * 650;
            });
            burst = 1;
        };

        const drawParticle = (particle, color, radius, alpha) => {
            context.globalAlpha = alpha;
            context.fillStyle = color;
            context.beginPath();
            context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            context.fill();
        };

        const render = (now) => {
            const delta = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            context.clearRect(0, 0, width, height);
            ensureParticles();
            burst = Math.max(0, burst - delta / 0.5);

            const anchorX = cursor.has ? cursor.x : width / 2;
            const anchorY = cursor.has ? cursor.y : height / 2;
            const speed = 110 + settings.speed * 165;

            particles.forEach((particle, index) => {
                const dx = anchorX - particle.x;
                const dy = anchorY - particle.y;
                const distance = Math.max(1, Math.hypot(dx, dy));
                const orbit = settings.spread * (0.35 + (index % 7) / 7);
                const radial = (distance - orbit) / Math.max(20, settings.spread * 0.85);
                const tangentX = -dy / distance;
                const tangentY = dx / distance;
                let wishX = dx / distance * radial + tangentX;
                let wishY = dy / distance * radial + tangentY;
                const wishLength = Math.max(1, Math.hypot(wishX, wishY));
                wishX /= wishLength;
                wishY /= wishLength;
                const drift = Math.sin(now * 0.0012 + particle.phase) * settings.wander * 80;

                particle.vx += (wishX * speed - particle.vx) * 4 * delta;
                particle.vy += (wishY * speed - particle.vy) * 4 * delta;
                particle.vx += tangentX * drift * delta;
                particle.vy += tangentY * drift * delta;
                if (burst > 0) {
                    particle.vx -= dx / distance * speed * burst * 3 * delta;
                    particle.vy -= dy / distance * speed * burst * 3 * delta;
                }

                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;
                history[index] ??= [];
                history[index].unshift({ x: particle.x, y: particle.y });
                history[index].length = Math.min(history[index].length, historyLength);
            });

            particles.forEach((particle, index) => {
                const trail = history[index] || [];
                trail.forEach((point, trailIndex) => {
                    const amount = 1 - trailIndex / Math.max(1, trail.length);
                    const trailAlpha = settings.opacity * settings.trail * amount * 0.3;
                    const trailRadius = settings.size * particle.scale * amount * 0.65;
                    context.globalAlpha = trailAlpha;
                    context.fillStyle = trailIndex % 3 === 0 ? settings.accentColor : settings.color;
                    context.shadowBlur = settings.size * settings.glow * 2;
                    context.shadowColor = settings.accentColor;
                    context.beginPath();
                    context.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
                    context.fill();
                });
                context.shadowBlur = settings.size * settings.glow * 2;
                context.shadowColor = settings.accentColor;
                drawParticle(particle, index % 3 === 0 ? settings.accentColor : settings.color, settings.size * particle.scale, settings.opacity);
            });

            context.globalAlpha = 1;
            context.shadowBlur = 0;
            animationFrame = requestAnimationFrame(render);
        };

        resize();
        ensureParticles();
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", updatePointer, { passive: true });
        window.addEventListener("pointerdown", scatter, { passive: true });
        window.addEventListener("pointerleave", () => { cursor.has = false; });
        animationFrame = requestAnimationFrame(render);
        window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame), { once: true });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSwarmCursor, { once: true });
    } else {
        initSwarmCursor();
    }
})();

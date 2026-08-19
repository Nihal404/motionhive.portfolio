// React Bits Waves adapted for the portfolio's vanilla JavaScript runtime.

(() => {
    "use strict";

    class Noise {
        constructor(seed = Math.random()) {
            this.seed = seed * 1000;
        }

        value(x, y) {
            const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
            return (n - Math.floor(n)) * 2 - 1;
        }

        smooth(x, y) {
            const x0 = Math.floor(x);
            const y0 = Math.floor(y);
            const fx = x - x0;
            const fy = y - y0;
            const sx = fx * fx * (3 - 2 * fx);
            const sy = fy * fy * (3 - 2 * fy);
            const a = this.value(x0, y0);
            const b = this.value(x0 + 1, y0);
            const c = this.value(x0, y0 + 1);
            const d = this.value(x0 + 1, y0 + 1);
            const top = a + (b - a) * sx;
            const bottom = c + (d - c) * sx;
            return top + (bottom - top) * sy;
        }
    }

    const initWaves = () => {
        const container = document.getElementById("waves-background");
        const canvas = container?.querySelector(".waves-canvas");
        const context = canvas?.getContext("2d");
        if (!container || !canvas || !context) return;

        const config = {
            lineColor: "rgba(185, 131, 255, .28)",
            waveSpeedX: 0.02,
            waveSpeedY: 0.01,
            waveAmpX: 40,
            waveAmpY: 20,
            friction: 0.9,
            tension: 0.01,
            maxCursorMove: 120,
            xGap: 12,
            yGap: 36,
        };
        const noise = new Noise();
        const mouse = { x: -1000, y: -1000, sx: -1000, sy: -1000, lx: 0, ly: 0, speed: 0, angle: 0 };
        let width = 0;
        let height = 0;
        let lines = [];
        let frameId = 0;

        const createLines = () => {
            const totalLines = Math.ceil((width + 200) / config.xGap);
            const totalPoints = Math.ceil((height + 30) / config.yGap);
            const xStart = (width - config.xGap * totalLines) / 2;
            const yStart = (height - config.yGap * totalPoints) / 2;
            lines = Array.from({ length: totalLines + 1 }, (_, lineIndex) => {
                return Array.from({ length: totalPoints + 1 }, (_, pointIndex) => ({
                    x: xStart + config.xGap * lineIndex,
                    y: yStart + config.yGap * pointIndex,
                    waveX: 0,
                    waveY: 0,
                    cursorX: 0,
                    cursorY: 0,
                    velocityX: 0,
                    velocityY: 0,
                }));
            });
        };

        const resize = () => {
            const bounds = container.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = bounds.width;
            height = bounds.height;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            createLines();
        };

        const updateMouse = (x, y) => {
            const bounds = container.getBoundingClientRect();
            mouse.x = x - bounds.left;
            mouse.y = y - bounds.top;
            if (mouse.lx === 0 && mouse.ly === 0) {
                mouse.sx = mouse.x;
                mouse.sy = mouse.y;
            }
        };

        const movePoints = (time) => {
            mouse.sx += (mouse.x - mouse.sx) * 0.1;
            mouse.sy += (mouse.y - mouse.sy) * 0.1;
            const dx = mouse.x - mouse.lx;
            const dy = mouse.y - mouse.ly;
            const distanceMoved = Math.hypot(dx, dy);
            mouse.speed += (distanceMoved - mouse.speed) * 0.1;
            mouse.angle = Math.atan2(dy, dx);
            mouse.lx = mouse.x;
            mouse.ly = mouse.y;

            lines.forEach((points) => points.forEach((point) => {
                const movement = noise.smooth(
                    (point.x + time * config.waveSpeedX) * 0.002,
                    (point.y + time * config.waveSpeedY) * 0.0015
                ) * 12;
                point.waveX = Math.cos(movement) * config.waveAmpX;
                point.waveY = Math.sin(movement) * config.waveAmpY;

                const distance = Math.hypot(point.x - mouse.sx, point.y - mouse.sy);
                const radius = Math.max(175, mouse.speed);
                if (distance < radius) {
                    const force = 1 - distance / radius;
                    point.velocityX += Math.cos(mouse.angle) * force * radius * mouse.speed * 0.00065;
                    point.velocityY += Math.sin(mouse.angle) * force * radius * mouse.speed * 0.00065;
                }

                point.velocityX += -point.cursorX * config.tension;
                point.velocityY += -point.cursorY * config.tension;
                point.velocityX *= config.friction;
                point.velocityY *= config.friction;
                point.cursorX = Math.max(-config.maxCursorMove, Math.min(config.maxCursorMove, point.cursorX + point.velocityX * 2));
                point.cursorY = Math.max(-config.maxCursorMove, Math.min(config.maxCursorMove, point.cursorY + point.velocityY * 2));
            }));
        };

        const draw = () => {
            context.clearRect(0, 0, width, height);
            context.beginPath();
            context.strokeStyle = config.lineColor;
            context.lineWidth = 1;
            lines.forEach((points) => {
                points.forEach((point, index) => {
                    const last = index === points.length - 1;
                    const x = point.x + point.waveX + (last ? 0 : point.cursorX);
                    const y = point.y + point.waveY + (last ? 0 : point.cursorY);
                    if (index === 0) context.moveTo(x, y);
                    else context.lineTo(x, y);
                });
            });
            context.stroke();
        };

        const tick = (time) => {
            movePoints(time);
            draw();
            frameId = requestAnimationFrame(tick);
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (event) => updateMouse(event.clientX, event.clientY));
        window.addEventListener("touchmove", (event) => {
            const touch = event.touches[0];
            if (touch) updateMouse(touch.clientX, touch.clientY);
        }, { passive: true });
        frameId = requestAnimationFrame(tick);
        window.addEventListener("beforeunload", () => cancelAnimationFrame(frameId), { once: true });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWaves, { once: true });
    } else {
        initWaves();
    }
})();

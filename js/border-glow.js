// BorderGlow adapted for the existing project cards.

(() => {
    "use strict";

    const initBorderGlow = () => {
        document.querySelectorAll(".projects-grid .card").forEach((card) => {
            const updateGlow = (event) => {
                const bounds = card.getBoundingClientRect();
                const x = event.clientX - bounds.left;
                const y = event.clientY - bounds.top;
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                const distanceX = Math.abs(x - centerX);
                const distanceY = Math.abs(y - centerY);
                const edgeX = centerX ? distanceX / centerX : 0;
                const edgeY = centerY ? distanceY / centerY : 0;
                const edge = Math.min(Math.max(Math.max(edgeX, edgeY) * 100, 0), 100);
                let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;

                card.style.setProperty("--edge-proximity", edge.toFixed(2));
                card.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
            };

            const resetGlow = () => card.style.setProperty("--edge-proximity", "0");
            card.addEventListener("pointermove", updateGlow, { passive: true });
            card.addEventListener("pointerleave", resetGlow);
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBorderGlow, { once: true });
    } else {
        initBorderGlow();
    }
})();
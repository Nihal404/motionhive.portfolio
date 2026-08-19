// ======================================
// MotionHive Loader
// ======================================

function initLoader() {

    let hasStarted = false;
    let hasAnimationStarted = false;
    let hasFinished = false;

    const finishLoader = () => {
        if (hasFinished) return;
        hasFinished = true;

        try {
            document.body.classList.add("loaded");
            document.documentElement.classList.add("loaded");
        } catch (error) {
            console.warn("Loader class update failed", error);
        }

        const loader = document.getElementById("loader");

        if (loader) {
            loader.remove();
        }

        try {
            if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        } catch (error) {
            console.warn("ScrollTrigger refresh failed", error);
        }

        window.dispatchEvent(new Event("loaderFinished"));
        console.log("✅ Loader Finished");
    };

    const beginAnimation = () => {
        if (hasAnimationStarted) return;
        hasAnimationStarted = true;

        window.setTimeout(() => {
            try {
                if (typeof gsap !== "undefined") {
                    const tl = gsap.timeline();

                    tl.from(".loader-text", {
                        y: 40,
                        opacity: 0,
                        duration: 0.25,
                        ease: "power2.out"
                    })
                    .to(".loader-text", {
                        scale: 1.04,
                        duration: 0.16
                    })
                    .to(".loader-text", {
                        scale: window.innerWidth < 768 ? 8 : 12,
                        opacity: 0,
                        duration: 0.25,
                        ease: "power2.inOut"
                    })
                    .to("#loader", {
                        opacity: 0,
                        duration: 0.18
                    })
                    .add(finishLoader);
                } else {
                    finishLoader();
                }
            } catch (error) {
                console.warn("Loader animation failed", error);
                finishLoader();
            }
        }, 140);
    };

    const startLoader = () => {
        if (hasStarted) return;
        hasStarted = true;

        if (document.readyState === "complete") {
            beginAnimation();
            return;
        }

        window.addEventListener("load", beginAnimation, { once: true });
        window.addEventListener("motionhive-ready", beginAnimation, { once: true });
    };

    startLoader();
}

initLoader();
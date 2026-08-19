// ======================================
// MotionHive Hero
// ======================================

function initHero() {

    console.log("🚀 Hero Started");

    if (typeof gsap === "undefined") {
        return;
    }

    gsap.from(".hero-image", {
        scale: 0.98,
        rotate: 2,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
    });

    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
        gsap.from(".hero-title span", {
            y: 12,
            opacity: 0,
            stagger: 0.015,
            duration: 0.16,
            ease: "power2.out"
        });
    }

    const heroParagraph = document.querySelector(".hero-content p");
    if (heroParagraph) {
        gsap.from(heroParagraph, {
            y: 8,
            opacity: 0,
            duration: 0.16
        });
    }

    const heroButtons = document.querySelector(".hero-buttons");
    if (heroButtons) {
        gsap.from(heroButtons, {
            y: 8,
            opacity: 0,
            duration: 0.16
        });
    }

    if (window.innerWidth > 768) {

        gsap.to(".hero-image", {
            y: -8,
            repeat: -1,
            yoyo: true,
            duration: 1.1,
            ease: "sine.inOut"
        });

        const heroImage = document.querySelector(".hero-image");

        if (heroImage) {

            document.addEventListener("mousemove", (e) => {

                gsap.to(heroImage, {

                    rotateY:
                        (e.clientX - window.innerWidth / 2) / 40,

                    rotateX:
                        -(e.clientY - window.innerHeight / 2) / 40,

                    duration: 0.25,
                    overwrite: "auto"

                });

            });

        }

    }

    gsap.to(".hero-title", {
        scale: 1.01,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut"
    });

}

window.addEventListener("loaderFinished", initHero);
// ======================================
// MotionHive Hero
// ======================================

function initHero() {

    console.log("🚀 Hero Started");

    gsap.from(".hero-image", {
        scale: 0.98,
        rotate: 2,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
    });

    gsap.from(".hero-title span", {
        y: 12,
        opacity: 0,
        stagger: 0.015,
        duration: 0.16,
        ease: "power2.out"
    });

    gsap.from(".hero-content p", {
        y: 8,
        opacity: 0,
        duration: 0.16
    });

    gsap.from(".hero-buttons", {
        y: 8,
        opacity: 0,
        duration: 0.16
    });

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
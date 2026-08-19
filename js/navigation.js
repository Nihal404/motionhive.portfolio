// =======================================
// MotionHive Navigation
// =======================================

function initNavigation() {

    const navLinks = document.querySelectorAll(".bottom-nav a");
    const sections = document.querySelectorAll("section[id]");

    function setActiveLink(id) {

        navLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
            );

        });

    }

    // ===============================
    // Intersection Observer
    // ===============================

    if ("IntersectionObserver" in window) {

        const ratios = {};

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                const id = entry.target.id;

                ratios[id] = entry.isIntersecting
                    ? entry.intersectionRatio
                    : 0;

            });

            let bestId = null;
            let bestRatio = 0;

            for (const id in ratios) {

                if (ratios[id] > bestRatio) {

                    bestRatio = ratios[id];
                    bestId = id;

                }

            }

            if (bestId) {

                setActiveLink(bestId);

            }

        }, {

            threshold: [0, .2, .4, .6, .8, 1]

        });

        sections.forEach(section => {

            ratios[section.id] = 0;
            observer.observe(section);

        });

    }

    // ===============================
    // Smooth Scroll
    // ===============================

    navLinks.forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (!target) return;

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

}
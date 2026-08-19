// SplitText-style character reveal for the About intro.

(() => {
    "use strict";

    const splitCharacters = (element) => {
        const text = element.textContent;
        const characters = [];
        element.textContent = "";

        [...text].forEach((character) => {
            if (/\s/.test(character)) {
                element.appendChild(document.createTextNode(character));
                return;
            }

            const span = document.createElement("span");
            span.className = "split-char";
            span.textContent = character;
            element.appendChild(span);
            characters.push(span);
        });

        return characters;
    };

    const initSplitText = () => {
        const intro = document.querySelector(".intro-text");
        const paragraph = intro?.querySelector("p");
        const title = intro?.querySelector("h2");

        if (!paragraph || !title) return;

        const targets = [splitCharacters(paragraph), splitCharacters(title)];

        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        targets.forEach((characters, index) => {
            if (typeof gsap === "undefined") return;

            const animation = {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.07,
                delay: index * 0.12,
                clearProps: "willChange"
            };

            if (typeof ScrollTrigger !== "undefined") {
                animation.scrollTrigger = {
                    trigger: intro,
                    start: "top 85%",
                    once: true
                };
            }

            gsap.fromTo(characters, {
                y: 40,
                opacity: 0
            }, animation);
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSplitText, { once: true });
    } else {
        initSplitText();
    }
})();
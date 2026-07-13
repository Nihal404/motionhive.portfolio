// Register ScrollTrigger early so refresh can be called from timelines
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load",()=>{

const tl = gsap.timeline();

tl.from(".loader-text",{
    y:300,
    opacity:0,
    duration:1.2,
    ease:"power4.out"
})

.to(".loader-text",{
    scale:1.15,
    duration:.4
})

.to(".loader-text",{
    scale:window.innerWidth < 768 ? 8 : 12,
    opacity:0,
    duration:1,
    ease:"power4.inOut"
})

.to("#loader",{
    opacity:0,
    duration:.5
})

.add(()=>{
    const loaderEl = document.getElementById("loader");
    if(loaderEl) loaderEl.remove();
    try{ ScrollTrigger.refresh(); }catch(e){/* ignore if not ready */}

})

.from("#hero",{
    y:200,
    opacity:0,
    duration:1.2,
    ease:"power4.out"
})

.from("#about",{
    y:200,
    opacity:0,
    duration:1,
    ease:"power4.out"
},"-=0.7")

.from("#projects",{
    y:200,
    opacity:0,
    duration:1,
    ease:"power4.out"
},"-=0.7")

.from("#contact",{
    y:200,
    opacity:0,
    duration:1,
    ease:"power4.out"
},"-=0.7");

});

const light = document.getElementById("cursor-light");

document.addEventListener("mousemove",(e)=>{

    gsap.to("#cursor-light",{

        x:e.clientX,
        y:e.clientY,

        duration:.4,

        ease:"power3.out"

    });

});


gsap.from(".hero-image",{
scale:1,
opacity:1,
});

gsap.from(".hero-image",{

    scale:.6,
    rotate:15,

    opacity:0,

    duration:1.2,

    delay:1.5

});

gsap.from(".hero-title span",{

    y:200,

    opacity:0,

    duration:1.2,

    stagger:0.08,

    delay:2.2,

    ease:"power4.out"

});

gsap.utils.toArray("section").forEach(sec=>{

    gsap.from(sec,{

        y:120,
        opacity:0,
        scale:0.95,

        duration:1.4,

        ease:"power4.out",

        scrollTrigger:{
            trigger:sec,
            start:"top 80%",
            end:"bottom 20%",
            toggleActions:"play reverse play reverse"
        }

    });

});
gsap.from(".card", {
   scrollTrigger: {
      trigger: "#projects",
      start: "top 70%"
   },
   opacity: 0,
   y: 100,
   stagger: 0.2
});

gsap.to(".fill",{

width:(i,target)=>target.style.width,

duration:2,

scrollTrigger:{
trigger:"#about",
start:"top 70%"
}

});

// Active navigation indicator (IntersectionObserver-based)
const navLinks = document.querySelectorAll('.bottom-nav a');
const sections = document.querySelectorAll('section[id]');

function setActiveLink(id) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
}

if ('IntersectionObserver' in window) {
    const obsOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.15, 0.25, 0.5, 0.75, 1]
    };

    const ratios = {};
    const observer = new IntersectionObserver((entries) => {
        // Update stored intersection ratios for all observed sections
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            ratios[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        // Pick the section with the highest current intersection ratio
        let bestId = null;
        let bestRatio = 0;
        for (const id in ratios) {
            if (ratios[id] > bestRatio) {
                bestRatio = ratios[id];
                bestId = id;
            }
        }

        // If nothing is intersecting, fallback to bottom-check or closest-to-center
        if (!bestId || bestRatio === 0) {
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 75;
            if (isAtBottom) {
                setActiveLink('contact');
                return;
            }

            // Choose section whose center is closest to viewport center
            let closestId = null;
            let closestDist = Infinity;
            sections.forEach(s => {
                const rect = s.getBoundingClientRect();
                const center = rect.top + (rect.height / 2);
                const dist = Math.abs(center - (window.innerHeight / 2));
                if (dist < closestDist) {
                    closestDist = dist;
                    closestId = s.getAttribute('id');
                }
            });
            if (closestId) setActiveLink(closestId);
        } else {
            setActiveLink(bestId);
        }
    }, obsOptions);

    sections.forEach(s => {
        ratios[s.getAttribute('id')] = 0;
        observer.observe(s);
    });

    // Ensure correct initial state after layout/GSAP settles
    window.addEventListener('load', () => setTimeout(() => { window.dispatchEvent(new Event('scroll')); }, 120));
} else {
    // Fallback: simple scroll-based updater
    function updateActiveNavFallback() {
        let current = 'hero';
        const midpoint = window.innerHeight / 2;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= midpoint && rect.bottom >= midpoint) {
                current = section.getAttribute('id');
            }
        });
        setActiveLink(current);
    }
    window.addEventListener('scroll', updateActiveNavFallback);
    document.addEventListener('DOMContentLoaded', updateActiveNavFallback);
    updateActiveNavFallback();
}
// Scroll-spy fallback: add 'active-link' class to bottom-nav links based on scroll position
function scrollSpy() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.bottom-nav a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - section.clientHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        const href = link.getAttribute('href') || '';
        if (href === `#${current}`) link.classList.add('active-link');
    });
}

window.addEventListener('scroll', scrollSpy);
// run once to initialize
window.addEventListener('load', () => setTimeout(scrollSpy, 200));
// Fixed Widescreen Cinema Mode Implementation
const projectCards = document.querySelectorAll('.projects-grid .card');
const cinemaModal = document.getElementById('cinema-modal');
const cinemaImg = document.getElementById('cinema-img');
const cinemaText = document.getElementById('cinema-text');
let cinemaIframe = null;

projectCards.forEach(card => {
    let cinemaTimer;

    card.addEventListener('mouseenter', () => {
        // Only activate hover-based cinema on desktop-like pointer devices
        if (!window.matchMedia('(pointer: fine) and (min-width: 900px)').matches) return;
        // Find the image inside the hovered card
        const cardImg = card.querySelector('img');
        const cardSrc = cardImg ? cardImg.getAttribute('src') : '';
        
        // Find if there is text (like VENOM) inside the card
        const cardSpan = card.querySelector('span');
        const textValue = cardSpan ? cardSpan.textContent : 'PROJECT PREVIEW';

        // Wait 1.0 seconds before opening cinema mode (hover-in delay)
        cinemaTimer = setTimeout(() => {
            if (cardSrc) {
                cinemaImg.setAttribute('src', cardSrc);
                cinemaText.textContent = textValue;
                
                // Show modal display first, then trigger transitions
                cinemaModal.classList.remove('hidden');
                setTimeout(() => {
                    cinemaModal.classList.add('active');
                }, 10);
            }
        }, 1000);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(cinemaTimer);
    });
    
    // Open cinema modal on click (prevent default navigation)
    card.addEventListener('click', (e) => {
        // prevent anchor navigation
        e.preventDefault();
        // avoid document-level click handler from immediately closing the modal
        e.stopPropagation();

        const cardImg = card.querySelector('img');
        const cardSrc = cardImg ? cardImg.getAttribute('src') : '';
        const cardSpan = card.querySelector('span');
        const textValue = cardSpan ? cardSpan.textContent : 'PROJECT PREVIEW';

        const dataVideo = card.getAttribute('data-video');
        if (dataVideo) {
            // show iframe preview for Google Drive
            if (!cinemaIframe) {
                cinemaIframe = document.createElement('iframe');
                cinemaIframe.id = 'cinema-iframe';
                cinemaIframe.setAttribute('allow', 'autoplay; fullscreen');
                cinemaIframe.style.border = '0';
                cinemaIframe.style.width = '100%';
                cinemaIframe.style.height = '100%';
            }
            cinemaIframe.setAttribute('src', dataVideo);
            // hide image and append iframe
            cinemaImg.style.display = 'none';
            const content = document.querySelector('.cinema-content');
            if (!content.querySelector('#cinema-iframe')) content.appendChild(cinemaIframe);
        } else {
            // remove iframe if present
            if (cinemaIframe && cinemaIframe.parentNode) cinemaIframe.parentNode.removeChild(cinemaIframe);
            cinemaImg.style.display = '';
            if (cardSrc) cinemaImg.setAttribute('src', cardSrc);
            else cinemaImg.removeAttribute('src');
        }

        cinemaText.textContent = textValue;
        cinemaModal.classList.remove('hidden');
        // small delay to allow CSS transitions
        setTimeout(() => cinemaModal.classList.add('active'), 10);
        // lock background scroll while modal open
        document.body.style.overflow = 'hidden';
    });
});


// Close modal when clicking anywhere (including the modal) — returns cards to original size
document.addEventListener('click', (e) => {
    if (!cinemaModal.classList.contains('active')) return;
    // If click target is inside a project card while modal is active, still close
    cinemaModal.classList.remove('active');
    setTimeout(() => {
        cinemaModal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 320);
});

// Close the cinematic view instantly when the mouse leaves the large overlay
cinemaModal.addEventListener('mouseleave', () => {
    cinemaModal.classList.remove('active');
    setTimeout(() => {
        cinemaModal.classList.add('hidden');
    }, 400); // Matches the CSS transition time
});
document.querySelectorAll("a,.card,.skill-box").forEach(el=>{

    el.addEventListener("mouseenter",()=>{

        gsap.to("#cursor-light",{

            scale:2.5,

            duration:.3

        });

    });

    el.addEventListener("mouseleave",()=>{

        gsap.to("#cursor-light",{

            scale:1,

            duration:.3

        });

    });

});
document.querySelectorAll(".bottom-nav a").forEach(link=>{

    link.addEventListener("mousemove",(e)=>{

        const rect = link.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;

        gsap.to(link,{

            x:x*.35,
            y:y*.35,

            duration:.3

        });

    });

    link.addEventListener("mouseleave",()=>{

        gsap.to(link,{

            x:0,
            y:0,

            duration:.3

        });

    });

});
if(window.innerWidth > 768){

gsap.to(".hero-image",{

    y:-20,

    duration:2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});

}
if(window.innerWidth > 768){

const heroImage = document.querySelector(".hero-image");

document.addEventListener("mousemove",(e)=>{

    const x = (e.clientX - window.innerWidth/2) / 40;
    const y = (e.clientY - window.innerHeight/2) / 40;

    gsap.to(heroImage,{

        rotateY:x,

        rotateX:-y,

        duration:1,

        ease:"power2.out"

    });

});

}

gsap.to(".blob1",{
    y:-300,
    scrollTrigger:{
        scrub:1
    }
});

gsap.to(".blob2",{
    y:250,
    scrollTrigger:{
        scrub:1
    }
});

gsap.to(".blob3",{
    x:250,
    scrollTrigger:{
        scrub:1
    }
});
gsap.from(".thank-right h1",{

    scale:4,

    opacity:0,

    duration:2,

    ease:"power4.out",

    scrollTrigger:{
        trigger:".thank-right",
        start:"top 70%"
    }

});
gsap.to(".film-box",{

    y:-20,

    duration:1,

    repeat:-1,

    yoyo:true,

    stagger:.2,

    ease:"sine.inOut"

});
gsap.to(".hero-title",{

    scale:1.03,

    duration:2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});
/* Removed duplicate load-based reveal animations — timeline and ScrollTrigger handle reveals now */
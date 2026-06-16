window.addEventListener("load",()=>{

const tl = gsap.timeline();

tl.from(".loader-text",{

    y:300,
    opacity:0,

    duration:1.3,

    ease:"power4.out"

})

.to(".loader-text",{

    scale:1.2,

    duration:.4

})

.to(".loader-text",{

    scale:6,

    opacity:0,

    duration:1,

    ease:"power4.in"

})

.to("#loader",{

    opacity:0,

    duration:.4,

    onComplete:()=>{

        document.getElementById("loader").remove();

    }

});

});

gsap.registerPlugin(ScrollTrigger);

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

    scale:.3,
    rotate:30,

    opacity:0,

    duration:1.5,

    delay:2

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

// Active navigation indicator
const navLinks = document.querySelectorAll('.bottom-nav a');
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    let currentSection = 'hero';
    
    // 1. Check if the user has reached the near-bottom of the page first
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 75;

    if (isAtBottom) {
        currentSection = 'contact';
    } else {
        // 2. Track based on when the top boundary enters the view window
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            // If the top of the section is higher than 10% of the screen height
            if (sectionTop <= window.innerHeight * 0.025) {
                currentSection = section.getAttribute('id');
            }
        });
    }
    
    // 3. Update the UI nav dot classes safely
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').slice(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}


window.addEventListener('scroll', updateActiveNav);
document.addEventListener('DOMContentLoaded', updateActiveNav);
updateActiveNav();
// Fixed Widescreen Cinema Mode Implementation
const projectCards = document.querySelectorAll('.projects-grid .card');
const cinemaModal = document.getElementById('cinema-modal');
const cinemaImg = document.getElementById('cinema-img');
const cinemaText = document.getElementById('cinema-text');

projectCards.forEach(card => {
    let cinemaTimer;

    card.addEventListener('mouseenter', () => {
        // Find the image inside the hovered card
        const cardImg = card.querySelector('img');
        const cardSrc = cardImg ? cardImg.getAttribute('src') : '';
        
        // Find if there is text (like VENOM) inside the card
        const cardSpan = card.querySelector('span');
        const textValue = cardSpan ? cardSpan.textContent : 'PROJECT PREVIEW';

        // Wait 0.5 seconds before opening cinema mode
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
        }, 500); 
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(cinemaTimer);
    });
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
gsap.to(".hero-image",{

    y:-20,

    duration:2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});
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
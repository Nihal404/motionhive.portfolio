gsap.registerPlugin(ScrollTrigger);

const light = document.getElementById("cursor-light");

document.addEventListener("mousemove", e => {

light.style.left = e.clientX + "px";
light.style.top = e.clientY + "px";

});

gsap.from(".hero-image",{
scale:1,
opacity:1,
});

gsap.from(".hero-title",{
y:150,
opacity:0,
duration:1.5,
delay:.3,
ease:"power4.out"
});

gsap.utils.toArray([".about-section", ".projects-section", ".thankyou-section"]).forEach(section => {
   gsap.from(section, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
         trigger: section,
         start: "top 80%",
         toggleActions: "play none none reverse"
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
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

gsap.utils.toArray(".section").forEach(section=>{

gsap.from(section,{

y:100,
opacity:0,

scrollTrigger:{
trigger:section,
start:"top 80%",
toggleActions:"play none none reverse"
}

});

});

gsap.from(".project-card",{

scrollTrigger:{
trigger:"#projects",
start:"top 70%"
},

opacity:0,
y:100,
stagger:.2

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
    let closestSection = null;
    let closestDistance = Infinity;
    
    const viewportMiddle = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionMiddle = sectionTop + sectionHeight / 2;
        const distance = Math.abs(viewportMiddle - sectionMiddle);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section.getAttribute('id');
        }
    });
    
    if (closestSection) {
        currentSection = closestSection;
    }
    
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
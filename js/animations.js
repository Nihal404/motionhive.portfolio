// ======================================
// MotionHive Animation Module
// GSAP + ScrollTrigger
// ======================================


document.addEventListener("DOMContentLoaded",()=>{


    if(typeof gsap === "undefined"){
        console.warn("GSAP not loaded");
        return;
    }


    if(typeof ScrollTrigger !== "undefined"){
        gsap.registerPlugin(ScrollTrigger);
    }



    // ==============================
    // HERO ANIMATION
    // ==============================


    gsap.from(".hero-image",{

        y:8,
        opacity:0,
        duration:0.2,
        ease:"power2.out"

    });



    gsap.from(".hero-title span",{

        y:10,
        opacity:0,
        stagger:0.015,
        duration:0.16,
        ease:"power2.out"

    });





    // ==============================
    // ABOUT SECTION
    // ==============================


    gsap.utils.toArray(".about-block").forEach(block=>{


        gsap.from(block,{

            scrollTrigger:{

                trigger:block,
                start:"top 80%",
                toggleActions:"play none none reverse"

            },


            y:24,
            opacity:0,
            duration:0.4,
            ease:"power3.out"


        });


    });







    // ==============================
    // PROFILE CARD
    // ==============================


    gsap.from(".profile-card",{


        scrollTrigger:{

            trigger:".profile-card",
            start:"top 80%"

        },


        scale:.95,
        opacity:0,
        duration:0.35,
        ease:"power3.out"


    });







    // ==============================
    // SKILLS ICONS
    // ==============================


    gsap.from(".skill-box",{


        scrollTrigger:{

            trigger:".skills-icons",
            start:"top 85%"

        },


        y:16,
        stagger:.04,
        duration:0.25,
        ease:"power3.out"


    });








    // ==============================
    // PROJECT CARDS
    // ==============================


    gsap.from(".projects-grid .card",{


        scrollTrigger:{


            trigger:".projects-grid",
            start:"top 75%",
            toggleActions:"play none none reverse"


        },


        y:36,
        scale:.98,
        stagger:.04,
        duration:0.35,
        ease:"power3.out"



    });







    // ==============================
    // PROJECT HEADER
    // ==============================


    gsap.from(".projects-header",{


        scrollTrigger:{


            trigger:".projects-section",
            start:"top 80%"


        },


        y:18,
        opacity:0,
        duration:0.3,
        ease:"power3.out"



    });








    // ==============================
    // CONTACT SECTION
    // ==============================


    gsap.from(".thank-left",{


        scrollTrigger:{


            trigger:".thankyou-section",
            start:"top 75%"


        },


        x:-30,
        opacity:0,
        duration:0.35,
        ease:"power3.out"



    });




    gsap.from(".thank-right h1",{


        scrollTrigger:{


            trigger:".thankyou-section",
            start:"top 75%"


        },


        x:30,
        opacity:0,
        duration:0.35,
        ease:"power3.out"



    });







    // ==============================
    // REFRESH AFTER LOAD
    // ==============================


    window.addEventListener("load",()=>{


        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }


    });



    console.log("✅ MotionHive Animations Loaded");


});
// ======================================
// MotionHive Projects Module
// Handles:
// - Video Hover Preview
// - Play Button
// - Cinema Mode
// - Modal
// - ESC Close
// - Mobile Support
// ======================================


document.addEventListener("DOMContentLoaded", () => {


    const cards = document.querySelectorAll(".projects-grid .card");

    const modal = document.getElementById("cinema-modal");
    const cinemaContent = document.querySelector(".cinema-content");
    const cinemaText = document.getElementById("cinema-text");


    if (!cards.length) return;



    // ==============================
    // VIDEO HOVER PREVIEW
    // ==============================


    cards.forEach(card => {


        const video = card.querySelector("video");


        if(video){


            card.addEventListener("mouseenter",()=>{

                video.play().catch(()=>{});


            });



            card.addEventListener("mouseleave",()=>{


                video.pause();

                video.currentTime = 0;


            });


        }


    });





    // ==============================
    // CINEMA MODE OPEN
    // ==============================


    cards.forEach(card=>{


        const playButton = card.querySelector(".play-button");


        if(!playButton) return;



        playButton.addEventListener("click",(e)=>{


            e.stopPropagation();


            openCinema(card);


        });



        card.addEventListener("click",()=>{


            openCinema(card);


        });



    });






    function openCinema(card){


        if(!modal) return;



        const video = card.querySelector("video");


        if(!video) return;




        // remove old media

        cinemaContent.querySelectorAll("video").forEach(v=>v.remove());

        const oldImg = cinemaContent.querySelector("img");

        if(oldImg){
            oldImg.style.display="none";
        }



        // create cinema video


        const cinemaVideo = document.createElement("video");


        cinemaVideo.src = video.src;

        cinemaVideo.onerror = () => {
            cinemaText.innerHTML = "Preview unavailable";
        };

        cinemaVideo.controls = true;

        cinemaVideo.autoplay = true;

        cinemaVideo.loop = false;

        cinemaVideo.playsInline = true;



        cinemaVideo.style.width="100%";

        cinemaVideo.style.height="100%";

        cinemaVideo.style.objectFit="cover";



        cinemaContent.insertBefore(
            cinemaVideo,
            cinemaText
        );



        // title


        const title =
        card.querySelector(".card-content h3");



        if(title){

            cinemaText.innerHTML =
            title.innerHTML;

        }



        modal.classList.remove("hidden");


        setTimeout(()=>{

            modal.classList.add("active");


        },50);



        document.body.style.overflow="hidden";



    }







    // ==============================
    // CLOSE CINEMA
    // ==============================


    function closeCinema(){


        if(!modal) return;



        modal.classList.remove("active");



        setTimeout(()=>{


            modal.classList.add("hidden");



            const video =
            cinemaContent.querySelector("video");



            if(video){

                video.pause();

                video.remove();

            }



        },300);



        document.body.style.overflow="";



    }






    // click outside


    modal?.addEventListener("click",(e)=>{


        if(e.target === modal){

            closeCinema();

        }


    });







    // ESC button


    document.addEventListener("keydown",(e)=>{


        if(e.key==="Escape"){


            closeCinema();


        }


    });






    // ==============================
    // MOBILE TOUCH SUPPORT
    // ==============================


    cards.forEach(card=>{


        card.addEventListener("touchstart",()=>{


            const video =
            card.querySelector("video");


            if(video){

                video.play().catch(()=>{});

            }


        },{passive:true});



        card.addEventListener("touchend",()=>{


            const video =
            card.querySelector("video");



            if(video){

                video.pause();

                video.currentTime=0;

            }



        },{passive:true});



    });






    console.log(
        "✅ MotionHive Projects Module Loaded"
    );


});

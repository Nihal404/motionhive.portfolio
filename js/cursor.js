// ======================================
// MotionHive Custom Cursor
// ======================================


function initCursor(){


const cursor =
document.getElementById("cursor-light");


const trail =
document.getElementById("cursor-trail");



if(!cursor || !trail){

console.warn("Cursor elements missing");
return;

}



let mouseX=0;
let mouseY=0;

let trailX=0;
let trailY=0;



window.addEventListener(
"mousemove",
(e)=>{


mouseX=e.clientX;
mouseY=e.clientY;



cursor.style.left =
mouseX+"px";


cursor.style.top =
mouseY+"px";



});




function animate(){


trailX +=
(mouseX-trailX)*0.15;


trailY +=
(mouseY-trailY)*0.15;



trail.style.left =
trailX+"px";


trail.style.top =
trailY+"px";



requestAnimationFrame(animate);


}


animate();



console.log("✅ Cursor Ready");


}



document.addEventListener(
"DOMContentLoaded",
initCursor
);
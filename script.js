let menuIcon = document.querySelector(".fa-bars");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () =>{
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
}
let navbar = document.querySelector(".navbar");
let lightMode = document.querySelector(".fa-gear");
let menuIcon = document.querySelector(".fa-bars");

menuIcon.onclick = () =>{
  //menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
}
lightMode.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

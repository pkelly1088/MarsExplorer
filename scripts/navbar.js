'use strict';

//getting items from dom for use
const hamburger = document.querySelector(".hamburger");
const links = document.querySelectorAll(".nav-link");
const codeBtn = document.querySelector(".get-code");

//if hamburger is clicked then toggle responsive class to display links
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle("responsive");
    links.forEach(el => el.classList.toggle("responsive"));
});

//if link is clicked, then remove responsive class from hamburger and links to hide link list
links.forEach(element => element.addEventListener('click', () => {
    hamburger.classList.remove('responsive');
    links.forEach(el => el.classList.remove('responsive'));
    })
)
'use strict';

const hamburger = document.querySelector(".hamburger");
const links = document.querySelectorAll(".nav-link");
const codeBtn = document.querySelector(".get-code");

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle("responsive");
    links.forEach(el => el.classList.toggle("responsive"));
});

links.forEach(element => element.addEventListener('click', () => {
    hamburger.classList.remove('responsive');
    links.forEach(el => el.classList.remove('responsive'));
    })
)
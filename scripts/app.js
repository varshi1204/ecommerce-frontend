console.log("E-commerce Website Loaded");

/*
//Seclect elements
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

//Toggle mobile view

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("E-commerce Website Loaded");

    // Select elements
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
});

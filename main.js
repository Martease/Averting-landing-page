// --- MOBILE MENU TOGGLE ---
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuBtn && navLinks) {
    const menuBtnIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        if (menuBtnIcon) {
            menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
        }
    });

    navLinks.addEventListener("click", (event) => {
        if (event.target.tagName !== "A") {
            return;
        }
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        if (menuBtnIcon) {
            menuBtnIcon.setAttribute("class", "ri-menu-line");
        }
    });
}

// --- FORM TOGGLE & SUBMISSION (Only runs if elements exist) ---
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");

if (signUpBtn && signInBtn && signUpForm && signInForm) {
    signUpBtn.addEventListener("click", () => {
        signUpForm.classList.remove("hidden");
        signInForm.classList.add("hidden");
    });

    signInBtn.addEventListener("click", () => {
        signInForm.classList.remove("hidden");
        signUpForm.classList.add("hidden");
    });
}

const submitSignUp = document.getElementById("submitSignUp");
if (submitSignUp) {
    submitSignUp.addEventListener("click", () => {
        const username = document.getElementById("signUpUsername").value;
        alert(`User ${username} registered successfully!`);
    });
}

const submitSignIn = document.getElementById("submitSignIn");
if (submitSignIn) {
    submitSignIn.addEventListener("click", () => {
        const username = document.getElementById("signInUsername").value;
        alert(`Welcome back, ${username}!`);
    });
}
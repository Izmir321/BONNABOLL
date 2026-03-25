const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navWrapper = document.querySelector(".nav-wrapper");

mobileMenuToggle.addEventListener("click", () => {
  navWrapper.classList.toggle("active");
});

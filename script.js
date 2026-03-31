const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navWrapper = document.querySelector(".nav-wrapper");

if (mobileMenuToggle && navWrapper) {
  mobileMenuToggle.addEventListener("click", () => {
    navWrapper.classList.toggle("active");
  });
}

const carouselTrack = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".carousel-btn-prev");
const nextButton = document.querySelector(".carousel-btn-next");

if (carouselTrack && prevButton && nextButton) {
  const getSlideWidth = () => {
    const firstSlide = carouselTrack.querySelector(".carousel-slide");
    if (!firstSlide) {
      return 0;
    }

    const slideStyles = window.getComputedStyle(firstSlide);
    const marginLeft = parseFloat(slideStyles.marginLeft) || 0;
    const marginRight = parseFloat(slideStyles.marginRight) || 0;
    return (
      firstSlide.getBoundingClientRect().width + marginLeft + marginRight + 16
    );
  };

  const updateButtonState = () => {
    const maxScrollLeft = carouselTrack.scrollWidth - carouselTrack.clientWidth;
    prevButton.disabled = carouselTrack.scrollLeft <= 2;
    nextButton.disabled = carouselTrack.scrollLeft >= maxScrollLeft - 2;
  };

  prevButton.addEventListener("click", () => {
    carouselTrack.scrollBy({ left: -getSlideWidth(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    carouselTrack.scrollBy({ left: getSlideWidth(), behavior: "smooth" });
  });

  carouselTrack.addEventListener("scroll", updateButtonState);
  window.addEventListener("resize", updateButtonState);
  updateButtonState();
}

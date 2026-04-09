const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navWrapper = document.querySelector(".nav-wrapper");

if (mobileMenuToggle && navWrapper) {
  mobileMenuToggle.addEventListener("click", () => {
    navWrapper.classList.toggle("active");
  });
}

const carouselContainers = document.querySelectorAll(
  ".partners-carousel, .gallery-carousel",
);

carouselContainers.forEach((carousel) => {
  const carouselTrack = carousel.querySelector(".carousel-track");

  if (!carouselTrack) {
    return;
  }

  const prevButton = carousel.querySelector(".carousel-btn-prev");
  const nextButton = carousel.querySelector(".carousel-btn-next");
  const autoScrollEnabled = carousel.dataset.autoScroll === "true";
  const autoScrollDelay = Number(carousel.dataset.autoScrollDelay || 3500);
  const originalSlides = Array.from(
    carouselTrack.querySelectorAll(".carousel-slide"),
  );

  if (originalSlides.length <= 1) {
    return;
  }

  const createCloneSet = (slides) =>
    slides.map((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.clone = "true";
      return clone;
    });

  carouselTrack.prepend(...createCloneSet(originalSlides));
  carouselTrack.append(...createCloneSet(originalSlides));

  let autoScrollTimer = null;
  let isAdjusting = false;

  const getSlideWidth = () => {
    const firstRealSlide = carouselTrack.querySelector(
      ".carousel-slide:not([data-clone='true'])",
    );

    if (!firstRealSlide) {
      return 0;
    }

    const trackStyles = window.getComputedStyle(carouselTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return firstRealSlide.getBoundingClientRect().width + gap;
  };

  const setInstantScroll = (position) => {
    isAdjusting = true;
    carouselTrack.style.scrollBehavior = "auto";
    carouselTrack.scrollLeft = position;

    requestAnimationFrame(() => {
      carouselTrack.style.scrollBehavior = "smooth";
      isAdjusting = false;
    });
  };

  const resetCarouselPosition = () => {
    const slideWidth = getSlideWidth();

    if (slideWidth > 0) {
      setInstantScroll(slideWidth * originalSlides.length);
    }
  };

  const handleInfiniteLoop = () => {
    if (isAdjusting) {
      return;
    }

    const slideWidth = getSlideWidth();
    const totalOriginalWidth = slideWidth * originalSlides.length;

    if (totalOriginalWidth === 0) {
      return;
    }

    if (carouselTrack.scrollLeft <= 1) {
      setInstantScroll(carouselTrack.scrollLeft + totalOriginalWidth);
    } else if (carouselTrack.scrollLeft >= totalOriginalWidth * 2 - 1) {
      setInstantScroll(carouselTrack.scrollLeft - totalOriginalWidth);
    }
  };

  const moveCarousel = (direction = 1) => {
    const slideWidth = getSlideWidth();

    if (slideWidth === 0) {
      return;
    }

    carouselTrack.scrollBy({
      left: slideWidth * direction,
      behavior: "smooth",
    });
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) {
      window.clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  };

  const startAutoScroll = () => {
    if (!autoScrollEnabled) {
      return;
    }

    stopAutoScroll();
    autoScrollTimer = window.setInterval(() => {
      moveCarousel(1);
    }, autoScrollDelay);
  };

  prevButton?.addEventListener("click", () => {
    moveCarousel(-1);
    startAutoScroll();
  });

  nextButton?.addEventListener("click", () => {
    moveCarousel(1);
    startAutoScroll();
  });

  carouselTrack.addEventListener("scroll", handleInfiniteLoop);
  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);
  carousel.addEventListener("focusin", stopAutoScroll);
  carousel.addEventListener("focusout", startAutoScroll);
  carousel.addEventListener("touchstart", stopAutoScroll, { passive: true });
  carousel.addEventListener("touchend", startAutoScroll);
  window.addEventListener("resize", resetCarouselPosition);

  resetCarouselPosition();
  startAutoScroll();
});

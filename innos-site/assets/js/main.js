"use strict";

(function initHeroSlider() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }

  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  const prevButton = hero.querySelector("[data-hero-prev]");
  const nextButton = hero.querySelector("[data-hero-next]");
  const counter = hero.querySelector("[data-hero-counter]");
  const delay = 7000;
  const transitionDuration = 1200;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let timerId = null;
  let isPointerInside = false;
  let isFocusInside = false;
  let isPageVisible = !document.hidden;

  if (slides.length === 0) {
    return;
  }

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  hero.style.setProperty("--hero-autoplay", `${delay}ms`);
  hero.style.setProperty("--hero-transition-duration", `${transitionDuration}ms`);

  const clampIndex = (index) => {
    const total = slides.length;
    return ((index % total) + total) % total;
  };

  const toCounter = (index) => {
    const current = String(index + 1).padStart(2, "0");
    const total = String(slides.length).padStart(2, "0");
    return `${current} / ${total}`;
  };

  const setSlide = (nextIndex, options = {}) => {
    const { force = false } = options;
    const normalizedIndex = clampIndex(nextIndex);

    if (!force && normalizedIndex === activeIndex) {
      return;
    }

    activeIndex = normalizedIndex;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });

    if (counter) {
      counter.textContent = toCounter(activeIndex);
    }
  };

  const isPaused = () => !isPageVisible || isPointerInside || isFocusInside;

  const syncPausedState = () => {
    hero.classList.toggle("is-paused", isPaused());
  };

  const stopAutoplay = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
    syncPausedState();
  };

  const startAutoplay = () => {
    if (slides.length < 2 || isPaused()) {
      return;
    }
    stopAutoplay();
    timerId = window.setInterval(() => {
      setSlide(activeIndex + 1);
    }, delay);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      setSlide(activeIndex - 1);
      restartAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      setSlide(activeIndex + 1);
      restartAutoplay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setSlide(index);
      restartAutoplay();
    });
  });

  hero.addEventListener("pointerenter", () => {
    isPointerInside = true;
    stopAutoplay();
  });

  hero.addEventListener("pointerleave", () => {
    isPointerInside = false;
    startAutoplay();
  });

  hero.addEventListener("focusin", () => {
    isFocusInside = true;
    stopAutoplay();
  });

  hero.addEventListener("focusout", () => {
    window.setTimeout(() => {
      isFocusInside = hero.contains(document.activeElement);
      if (isFocusInside) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }, 0);
  });

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (!isPageVisible) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  setSlide(activeIndex, { force: true });
  startAutoplay();
})();

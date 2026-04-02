"use strict";

(function initMobileNavigation() {
  const headers = Array.from(document.querySelectorAll(".site-header"));
  if (headers.length === 0) {
    return;
  }

  const desktopBreakpoint = 768;

  headers.forEach((header) => {
    const nav = header.querySelector("nav");
    const headerRow = header.querySelector("div");
    const actions = headerRow ? headerRow.lastElementChild : null;

    if (!nav || !actions || actions.querySelector("[data-mobile-nav-toggle]")) {
      return;
    }

    const navLinks = Array.from(nav.querySelectorAll("a[href]"));
    if (navLinks.length === 0) {
      return;
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "site-mobile-nav-toggle";
    toggle.setAttribute("aria-label", "Открыть меню");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("data-mobile-nav-toggle", "true");
    toggle.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';

    const panel = document.createElement("div");
    panel.className = "site-mobile-nav-panel";
    panel.setAttribute("data-mobile-nav-panel", "true");

    const linksWrap = document.createElement("div");
    linksWrap.className = "site-mobile-nav-links";

    navLinks.forEach((link) => {
      const mobileLink = link.cloneNode(true);
      mobileLink.removeAttribute("class");
      linksWrap.appendChild(mobileLink);
    });

    panel.appendChild(linksWrap);
    header.appendChild(panel);
    actions.appendChild(toggle);

    const setBodyMenuOffset = () => {
      if (!header.classList.contains("is-mobile-nav-open")) {
        return;
      }
      const panelHeight = Math.ceil(panel.getBoundingClientRect().height);
      const linksHeight = Math.ceil(linksWrap.getBoundingClientRect().height);
      const offset = Math.max(panelHeight, linksHeight, 0);
      document.body.style.setProperty("--mobile-nav-offset", `${offset}px`);
    };

    const setOpen = (open) => {
      header.classList.toggle("is-mobile-nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      const icon = toggle.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = open ? "close" : "menu";
      }
    };

    const closeMenu = () => {
      setOpen(false);
      document.body.classList.remove("mobile-nav-open");
      document.body.style.removeProperty("--mobile-nav-offset");
    };

    const openMenu = () => {
      setOpen(true);
      document.body.classList.add("mobile-nav-open");
      setBodyMenuOffset();
      window.requestAnimationFrame(setBodyMenuOffset);
    };

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("is-mobile-nav-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!header.contains(target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= desktopBreakpoint) {
        closeMenu();
        return;
      }
      if (header.classList.contains("is-mobile-nav-open")) {
        setBodyMenuOffset();
      }
    });

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        if (header.classList.contains("is-mobile-nav-open")) {
          setBodyMenuOffset();
        }
      });
      observer.observe(linksWrap);
    }
  });
})();

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

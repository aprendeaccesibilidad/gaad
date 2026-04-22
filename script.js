const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && siteNav) {
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  const syncMenu = () => {
    if (mobileQuery.matches) {
      siteNav.hidden = menuButton.getAttribute("aria-expanded") !== "true";
    } else {
      siteNav.hidden = false;
      menuButton.setAttribute("aria-expanded", "false");
    }
  };

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    syncMenu();
  });

  siteNav.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (mobileQuery.matches && target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      syncMenu();
    }
  });

  mobileQuery.addEventListener("change", syncMenu);
  syncMenu();
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

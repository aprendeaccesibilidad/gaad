const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && siteNav) {
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const getMenuLinks = () => Array.from(siteNav.querySelectorAll("a"));

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

    if (!expanded && mobileQuery.matches) {
      const [firstLink] = getMenuLinks();
      firstLink?.focus();
    }
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

  siteNav.addEventListener("keydown", (event) => {
    if (!mobileQuery.matches) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }

    const links = getMenuLinks();
    const currentIndex = links.indexOf(target);

    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % links.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + links.length) % links.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = links.length - 1;
    } else if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      syncMenu();
      menuButton.focus();
      return;
    } else {
      return;
    }

    event.preventDefault();
    links[nextIndex]?.focus();
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

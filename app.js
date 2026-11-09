const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      mobileNav.hidden = true;
    });
  });
}

const demoForm = document.querySelector("#demo-form");
const tradeSelect = document.querySelector("#trade");
const demoStatus = document.querySelector("#demo-status");
const validTrades = new Set([
  "plomero",
  "electricista",
  "pintor",
  "gasista",
  "techista",
  "albanil",
  "fumigador",
  "vidriero",
  "zinguero",
]);
const demoUrls = {
  electricista: "https://tuwebentresdias.github.io/demo-electricista/",
  plomero: "https://tuwebentresdias.github.io/demo-plomero/",
  pintor: "https://tuwebentresdias.github.io/demo-pintor/",
  gasista: "https://tuweben3dias.com/gasista/",
  techista: "https://tuwebentresdias.github.io/demo-techista/",
  fumigador: "https://tuwebentresdias.github.io/demo-fumigador/",
  vidriero: "https://tuwebentresdias.github.io/demo-vidriero/",
  zinguero: "https://tuwebentresdias.github.io/demo-zinguero/",
};

if (demoForm && tradeSelect) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const trade = tradeSelect.value;

    if (!validTrades.has(trade)) {
      tradeSelect.focus();
      tradeSelect.setAttribute("aria-invalid", "true");
      if (demoStatus) demoStatus.textContent = "Elegí un rubro de la lista para abrir su demo.";
      return;
    }

    tradeSelect.removeAttribute("aria-invalid");
    const demoUrl = demoUrls[trade] || new URL(trade, "https://tuweben3dias.com/").href;
    window.open(demoUrl, "_blank", "noopener,noreferrer");
    if (demoStatus) demoStatus.textContent = "Abrimos la demo en otra pestaña. No enviamos datos personales.";
  });

  tradeSelect.addEventListener("change", () => {
    tradeSelect.removeAttribute("aria-invalid");
    if (demoStatus) demoStatus.textContent = "La demo se abre en tuweben3dias.com; no enviamos datos personales.";
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sceneFrame = document.querySelector("[data-scene-frame]");

if (sceneFrame && !prefersReducedMotion.matches) {
  sceneFrame.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = sceneFrame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    sceneFrame.style.setProperty("--tilt-x", (x * 3.2).toFixed(2) + "deg");
    sceneFrame.style.setProperty("--tilt-y", (y * -2.4).toFixed(2) + "deg");
  });

  sceneFrame.addEventListener("pointerleave", () => {
    sceneFrame.style.setProperty("--tilt-x", "0deg");
    sceneFrame.style.setProperty("--tilt-y", "0deg");
  });
}

const revealElements = document.querySelectorAll(".reveal");
if (!prefersReducedMotion.matches && "IntersectionObserver" in window && revealElements.length) {
  document.documentElement.classList.add("has-motion");
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
  );
  revealElements.forEach((element) => observer.observe(element));
}

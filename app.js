const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

const heroTradeSelect = document.querySelector("#trade");
const mobileDemoTrigger = document.querySelector("#mobile-demo-trigger");
const mobileDemoDialog = document.querySelector("#mobile-demo-dialog");
const mobileDemoGrid = document.querySelector("#mobile-demo-grid");
const mobileDemoClose = document.querySelector("#mobile-demo-close");

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

const resolveDemoUrl = (trade) =>
  demoUrls[trade] || new URL(trade, "https://tuweben3dias.com/").href;

if (
  heroTradeSelect &&
  mobileDemoTrigger &&
  mobileDemoDialog &&
  mobileDemoGrid &&
  mobileDemoClose &&
  typeof mobileDemoDialog.showModal === "function"
) {
  const tradeIcons = {
    plomero: "🔧",
    electricista: "⚡",
    pintor: "🎨",
    gasista: "🔥",
    techista: "🏠",
    albanil: "🧱",
    fumigador: "🛡️",
    vidriero: "🪟",
    zinguero: "🪚",
  };

  const tradeOptions = [...heroTradeSelect.options].filter((option) => option.value);
  const priorityTrades = ["vidriero", "electricista", "techista"];
  const orderedTradeOptions = [
    ...priorityTrades.map((trade) => tradeOptions.find((option) => option.value === trade)).filter(Boolean),
    ...tradeOptions.filter((option) => !priorityTrades.includes(option.value)),
  ];

  orderedTradeOptions.forEach((option) => {
      const button = document.createElement("button");
      button.className = "demo-trade-option";
      button.type = "button";
      button.dataset.trade = option.value;

      const icon = document.createElement("span");
      icon.className = "demo-trade-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = tradeIcons[option.value] || "✦";

      const name = document.createElement("span");
      name.className = "demo-trade-name";
      name.textContent = option.textContent.trim();

      const arrow = document.createElement("span");
      arrow.className = "demo-trade-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      button.append(icon, name, arrow);
      button.addEventListener("click", () => {
        window.open(resolveDemoUrl(option.value), "_blank", "noopener,noreferrer");
        mobileDemoDialog.close();
      });
      mobileDemoGrid.append(button);
    });

  mobileDemoTrigger.addEventListener("click", () => mobileDemoDialog.showModal());
  mobileDemoClose.addEventListener("click", () => mobileDemoDialog.close());
  mobileDemoDialog.addEventListener("click", (event) => {
    if (event.target === mobileDemoDialog) mobileDemoDialog.close();
  });

  document.documentElement.classList.add("has-js");
}

document.querySelectorAll("#demo-form, #closing-demo-form").forEach((demoForm) => {
  const tradeSelect = demoForm.querySelector("select");
  const demoStatus = demoForm.querySelector(".demo-status");
  if (!tradeSelect) return;

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
    const demoUrl = resolveDemoUrl(trade);
    window.open(demoUrl, "_blank", "noopener,noreferrer");
    if (demoStatus) demoStatus.textContent = "Abrimos la demo en otra pestaña. No enviamos datos personales.";
  });

  tradeSelect.addEventListener("change", () => {
    tradeSelect.removeAttribute("aria-invalid");
    if (demoStatus) demoStatus.textContent = "La demo se abre en tuweben3dias.com; no enviamos datos personales.";
  });
});
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroVisual = document.querySelector(".hero-visual");
const heroSection = heroVisual?.closest(".hero");
if (heroVisual && !prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const heroVisibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroVisual.classList.toggle("is-in-view", entry.isIntersecting);
        heroSection?.classList.toggle("is-in-view", entry.isIntersecting);
      });
    },
    { threshold: 0.08 },
  );
  heroVisibilityObserver.observe(heroVisual);
}

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

const revealElements = document.querySelectorAll(".reveal:not(.trust-card)");
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

const trustCards = [...document.querySelectorAll(".trust-card")];
if (!prefersReducedMotion.matches && trustCards.length) {
  document.documentElement.classList.add("trust-focus-motion");
  let scheduled = false;
  const updateTrustFocus = () => {
    scheduled = false;
    const focusLine = window.innerHeight * 0.5;
    let nearest = null, distance = Infinity;
    trustCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const d = Math.abs(rect.top + rect.height / 2 - focusLine);
      if (d < distance) { distance = d; nearest = card; }
    });
    trustCards.forEach(card => card.classList.toggle("is-focused", card === nearest));
  };
  const scheduleTrustFocus = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateTrustFocus); }
  };
  window.addEventListener("scroll", scheduleTrustFocus, { passive: true });
  window.addEventListener("resize", scheduleTrustFocus);
  updateTrustFocus();
}

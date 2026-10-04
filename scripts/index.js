function updateThemeControl() {
  const themeLink = document.querySelector(".nav-btn a");
  if (!themeLink) return;

  const isDark = document.body.classList.contains("dark-mode");
  themeLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="theme-icon moon-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="theme-icon sun-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
    <span class="theme-label">${isDark ? "Light" : "Dark"}</span>`;
  themeLink.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

window.agentPortraits = [
  "/public/assets/images/agents/agent-dara.png",
  "/public/assets/images/agents/agent-sreypov.png",
  "/public/assets/images/agents/agent-vibol.png",
  "/public/assets/images/agents/agent-socheata.png"
];

window.agentPortraitMap = {
  301: window.agentPortraits[0], 302: window.agentPortraits[2], 303: window.agentPortraits[1],
  304: window.agentPortraits[2], 305: window.agentPortraits[0], 306: window.agentPortraits[3],
  307: window.agentPortraits[1], 308: window.agentPortraits[2], 309: window.agentPortraits[3],
  310: window.agentPortraits[0], 311: window.agentPortraits[2], 312: window.agentPortraits[1]
};

window.getAgentPortrait = (agentId) => window.agentPortraitMap[Number(agentId)] || window.agentPortraits[Math.abs(Number(agentId) - 301) % window.agentPortraits.length];

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("mode", isDark ? "dark-mode" : "light-mode");
  localStorage.setItem("apple-kh-theme", isDark ? "dark" : "light");
  updateThemeControl();
}

function updateNavbar() {
  const navbar = document.querySelector(".navbar-content");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 24);
}

function initializeNavbar() {
  const navbar = document.querySelector(".navbar-content");
  const sidebar = document.querySelector(".sidebar");
  const navActions = document.querySelector(".navbar .nav-actions");
  const menuButton = document.querySelector(".menu-btn");
  if (!navbar || !sidebar || !navActions) return;

  const savedTheme = localStorage.getItem("apple-kh-theme");
  if (savedTheme === "dark" || localStorage.getItem("mode") === "dark-mode") {
    document.body.classList.add("dark-mode");
  }

  if (!navActions.querySelector(".nav-browse-cta")) {
    const browseLink = document.createElement("a");
    browseLink.className = "nav-browse-cta";
    browseLink.href = "/pages/listing/index.html";
    browseLink.textContent = "Browse homes";
    navActions.appendChild(browseLink);
  }

  const navDestinations = {
    Home: "/index.html",
    Rent: "/pages/rent/index.html?filter=rent",
    Buy: "/pages/buy/index.html?filter=sale",
    Agents: "/pages/agents/index.html",
    About: "/pages/about/index.html",
    Contact: "/pages/contact/index.html"
  };

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const destination = navDestinations[link.textContent.trim()];
    if (destination) link.href = destination;
  });

  const currentPage = window.location.pathname.replace(/\/$/, "");
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPage = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
    const linkSection = linkPage.replace(/\/index\.html$/, "");
    const isHome = linkPage === "/index.html" && currentPage === "/index.html";
    const isCurrent = linkPage !== "/index.html" && currentPage.startsWith(linkSection);
    link.classList.toggle("active", isHome || isCurrent);
  });

  window.showSidemenu = () => {
    sidebar.style.removeProperty("display");
    sidebar.classList.add("open");
    menuButton?.setAttribute("aria-expanded", "true");
  };

  window.hideSidebar = () => {
    sidebar.style.removeProperty("display");
    sidebar.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.setAttribute("aria-label", "Open navigation");
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuButton) menuButton.innerHTML = "<span></span><span></span><span></span>";
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", window.hideSidebar));
  updateThemeControl();
  updateNavbar();
}

window.addEventListener("scroll", updateNavbar, { passive: true });
window.addEventListener("DOMContentLoaded", initializeNavbar);

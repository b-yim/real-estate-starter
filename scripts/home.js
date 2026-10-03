const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle.querySelector(".theme-label");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const savedTheme = localStorage.getItem("apple-kh-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";

function updateThemeLabel() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeLabel.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  if (isDark) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = "dark";
  localStorage.setItem("apple-kh-theme", isDark ? "light" : "dark");
  updateThemeLabel();
});
updateThemeLabel();

document.getElementById("propertySearch").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("propertyQuery").value.trim();
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  window.location.href = `/pages/listing/index.html?${params.toString()}`;
});

function propertyCard(property) {
  const image = Array.isArray(property.images) ? property.images[0] : property.images;
  const price = new Intl.NumberFormat("en-US").format(property.price);
  const priceSuffix = property.purpose === "rent" ? "/mo" : "";
  const title = property.title?.en || "Property in Phnom Penh";
  const district = property.location?.district || property.location?.city || "Phnom Penh";

  return `
    <a class="property-card" href="/pages/detail-card/index.html?id=${property.id}">
      <div class="property-image">
        <img src="${image}" alt="${title}">
        <span class="property-label">For ${property.purpose}</span>
      </div>
      <div class="property-body">
        <div class="property-top">
          <h3 class="property-title">${title}</h3>
          <span class="property-price">$${price}${priceSuffix}</span>
        </div>
        <p class="property-location">${district}, Phnom Penh</p>
        <div class="property-meta">
          <span>▱ ${property.bedrooms} beds</span>
          <span>◫ ${property.bathrooms} baths</span>
          <span>□ ${property.area} ${property.unit}</span>
        </div>
      </div>
    </a>`;
}

function agentCard(agent) {
  return `
    <a class="agent-card" href="/pages/agent-detail/index.html?id=${agent.id}">
      <div class="agent-photo"><img src="${agent.profile_photo}" alt="${agent.full_name}" onerror="this.onerror=null;this.src='/public/assets/images/agent.jpg'"></div>
      <h3>${agent.full_name}</h3>
      <span>${agent.district}</span>
      <p>${agent.description}</p>
    </a>`;
}

async function loadHomepageData() {
  const featured = document.getElementById("featuredProperties");
  const latest = document.getElementById("latestProperties");
  const agents = document.getElementById("agentGrid");
  featured.innerHTML = latest.innerHTML = agents.innerHTML = '<p class="loading-state">Loading our latest collection…</p>';

  try {
    const [propertyResponse, agentResponse] = await Promise.all([
      fetch("/public/data/properties.json"),
      fetch("/public/data/agents.json")
    ]);
    if (!propertyResponse.ok || !agentResponse.ok) throw new Error("Unable to load property data");

    const [properties, agentList] = await Promise.all([propertyResponse.json(), agentResponse.json()]);
    featured.innerHTML = properties.slice(0, 3).map(propertyCard).join("");
    latest.innerHTML = properties.slice(3, 9).map(propertyCard).join("");
    agents.innerHTML = agentList.slice(0, 4).map(agentCard).join("");
  } catch (error) {
    console.error(error);
    const message = '<p class="loading-state">We could not load the listings. Please refresh the page.</p>';
    featured.innerHTML = latest.innerHTML = agents.innerHTML = message;
  }
}

loadHomepageData();

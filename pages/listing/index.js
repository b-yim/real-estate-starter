const sectionSaleElement = document.getElementById("saleColsCard");
const filterButtons = document.querySelectorAll(".filter-btn");
const paginationContainer = document.getElementById("pagination");
const resultsSummary = document.getElementById("resultsSummary");
const searchQuery = new URLSearchParams(window.location.search).get("q")?.trim() || "";

let properties = [];
let filteredProperties = [];
let currentPage = 1;
let activeFilter = "all";
const itemsPerPage = 12; // 12 cards per page

function matchesSearch(item) {
  if (!searchQuery) return true;

  const searchableText = [
    item.title?.en,
    item.title?.km,
    item.type,
    item.purpose,
    item.location?.city,
    item.location?.district,
    item.location?.address,
    ...Object.values(item.features || {})
  ].filter(Boolean).join(" ").toLocaleLowerCase();

  return searchableText.includes(searchQuery.toLocaleLowerCase());
}

function applyFilters() {
  filteredProperties = properties.filter((item) => {
    const matchesFilter = activeFilter === "all"
      || item.purpose === activeFilter
      || item.type === activeFilter;

    return matchesFilter && matchesSearch(item);
  });

  currentPage = 1;
  renderPage(currentPage);
}

// Fetch data
fetch("../../public/data/properties.json")
  .then((response) => response.json())
  .then((data) => {
    properties = data;
    applyFilters();
  })
  .catch((error) => {
    console.error(error);
    sectionSaleElement.innerHTML = '<div class="empty-results"><h2>Unable to load properties</h2><p>Please refresh the page and try again.</p></div>';
    resultsSummary.textContent = "";
  });

// Render cards for the current page
function renderPage(page) {
  sectionSaleElement.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsToShow = filteredProperties.slice(start, end);

  const countLabel = `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"}`;
  resultsSummary.innerHTML = searchQuery
    ? `<strong>${countLabel}</strong> found for “${escapeHtml(searchQuery)}”`
    : `<strong>${countLabel}</strong> available`;

  if (!itemsToShow.length) {
    sectionSaleElement.innerHTML = searchQuery
      ? `<div class="empty-results"><h2>No properties found</h2><p>Try a different city, district, or property type.</p></div>`
      : `<div class="empty-results"><h2>No properties found</h2><p>Try another property filter.</p></div>`;
    paginationContainer.innerHTML = "";
    return;
  }

  itemsToShow.forEach((item) => {
    const image = Array.isArray(item.images) ? item.images[0] : item.images;
    const price = new Intl.NumberFormat("en-US").format(item.price);
    const priceSuffix = item.purpose === "rent" ? "/mo" : "";
    const title = escapeHtml(item.title?.en || "Property in Phnom Penh");
    const district = escapeHtml(item.location?.district || item.location?.city || "Phnom Penh");
    sectionSaleElement.innerHTML += `
      <a class="property-card" href="/pages/detail-card/index.html?id=${item.id}">
        <div class="property-image">
          <img src="${image}" alt="${title}">
          <span class="property-label">For ${escapeHtml(item.purpose)}</span>
        </div>
        <div class="property-body">
          <div class="property-top">
            <h2 class="property-title">${title}</h2>
            <span class="property-price">$${price}${priceSuffix}</span>
          </div>
          <p class="property-location">${district}, ${escapeHtml(item.location?.city || "Phnom Penh")}</p>
          <div class="property-meta">
            <span>▱ ${item.bedrooms} beds</span>
            <span>◫ ${item.bathrooms} baths</span>
            <span>□ ${item.area} ${escapeHtml(item.unit)}</span>
          </div>
        </div>
      </a>
    `;
  });

  renderPagination();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

// Render pagination buttons
function renderPagination() {
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  let html = "";

  if (currentPage > 1) html += `<button class="page-btn" data-page="${currentPage - 1}">Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (currentPage < totalPages) html += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;

  paginationContainer.innerHTML = html;

  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = Number(btn.dataset.page);
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
    });
  });
}

// Filter buttons functionality
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

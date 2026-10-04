const propertyGrid = document.getElementById("saleColsCard") || document.getElementById("rentColsCard");
const filterButtons = document.querySelectorAll(".filter-btn");
const paginationContainer = document.getElementById("pagination");
let properties = [];
let filteredProperties = [];
let currentPage = 1;
const itemsPerPage = 12;
const pagePurpose = propertyGrid?.id === "rentColsCard" ? "rent" : "sale";
const defaultFilter = new URLSearchParams(window.location.search).get("filter") || pagePurpose;

function propertyCard(item) {
  const image = Array.isArray(item.images) ? item.images[0] : item.images;
  const price = new Intl.NumberFormat("en-US").format(item.price);
  const suffix = item.purpose === "rent" ? "/mo" : "";
  return `
    <a class="property-card" href="/pages/detail-card/index.html?id=${item.id}">
      <div class="property-image"><img src="${image}" alt="${item.title.en}"><span class="property-label">For ${item.purpose}</span></div>
      <div class="property-body">
        <div class="property-top"><h2 class="property-title">${item.title.en}</h2><span class="property-price">$${price}${suffix}</span></div>
        <p class="property-location">${item.location.district}, ${item.location.city}</p>
        <div class="property-meta"><span>▱ ${item.bedrooms} beds</span><span>◫ ${item.bathrooms} baths</span><span>□ ${item.area} ${item.unit}</span></div>
      </div>
    </a>`;
}

fetch("../../public/data/properties.json")
  .then((response) => response.json())
  .then((data) => { properties = data; applyFilter(defaultFilter); });

function renderPage(page) {
  const start = (page - 1) * itemsPerPage;
  propertyGrid.innerHTML = filteredProperties.slice(start, start + itemsPerPage).map(propertyCard).join("");
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  let html = currentPage > 1 ? `<button class="page-btn" data-page="${currentPage - 1}">Prev</button>` : "";
  for (let page = 1; page <= totalPages; page++) html += `<button class="page-btn ${page === currentPage ? "active" : ""}" data-page="${page}">${page}</button>`;
  if (currentPage < totalPages) html += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
  paginationContainer.innerHTML = html;
  paginationContainer.querySelectorAll(".page-btn").forEach((button) => button.addEventListener("click", () => {
    currentPage = Number(button.dataset.page);
    renderPage(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
}

function applyFilter(filter) {
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
  filteredProperties = properties.filter((item) => filter === "all" || item.purpose === filter || item.type === filter);
  currentPage = 1;
  renderPage(currentPage);
}

filterButtons.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));

const detailContainer = document.getElementById("detailCols");
const relatedContainer = document.getElementById("saleColsCard");
const propertyId = Number(new URLSearchParams(window.location.search).get("id")) || 1;

function propertyCard(item) {
  const image = Array.isArray(item.images) ? item.images[0] : item.images;
  const price = new Intl.NumberFormat("en-US").format(item.price);
  const suffix = item.purpose === "rent" ? "/mo" : "";
  return `
    <a class="property-card" href="/pages/detail-card/index.html?id=${item.id}">
      <div class="property-image"><img src="${image}" alt="${item.title.en}"><span class="property-label">For ${item.purpose}</span></div>
      <div class="property-body">
        <div class="property-top"><h3 class="property-title">${item.title.en}</h3><span class="property-price">$${price}${suffix}</span></div>
        <p class="property-location">${item.location.district}, ${item.location.city}</p>
        <div class="property-meta"><span>▱ ${item.bedrooms} beds</span><span>◫ ${item.bathrooms} baths</span><span>□ ${item.area} ${item.unit}</span></div>
      </div>
    </a>`;
}

function detailMarkup(property, agent) {
  const image = Array.isArray(property.images) ? property.images[0] : property.images;
  const price = new Intl.NumberFormat("en-US").format(property.price);
  const suffix = property.purpose === "rent" ? " / month" : "";
  const features = Object.values(property.features || {});
  const postedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(property.posted_date));
  const agentName = agent?.full_name || "Apple KH advisor";
  const agentDistrict = agent?.district || property.location.district;
  const agentPhoto = getAgentPortrait(agent?.id || 301);
  const address = [property.location.address, property.location.district, property.location.city].filter(Boolean).join(", ");
  const description = `This ${property.type} in ${property.location.district} offers ${property.area} ${property.unit} of well-planned space with ${property.bedrooms} ${property.bedrooms === 1 ? "bedroom" : "bedrooms"} and ${property.bathrooms} ${property.bathrooms === 1 ? "bathroom" : "bathrooms"}. It is a practical option for anyone looking for a well-connected property in ${property.location.city}, with clear details and local guidance available from our team.`;

  return `
    <nav class="detail-breadcrumb" aria-label="Breadcrumb"><a href="/index.html">Home</a><span>/</span><a href="/pages/listing/index.html">Properties</a><span>/</span><span>${property.title.en}</span></nav>
    <header class="detail-header">
      <div><p class="detail-eyebrow">${property.type} · For ${property.purpose}</p><h1>${property.title.en}</h1><p class="detail-location">${address}</p></div>
      <div class="detail-price">$${price}<small>${suffix}</small></div>
    </header>
    <div class="detail-media"><img src="${image}" alt="${property.title.en} in ${property.location.district}"><span class="detail-badge">For ${property.purpose}</span></div>
    <div class="detail-facts">
      <div><strong>${property.bedrooms}</strong><span>Bedrooms</span></div><div><strong>${property.bathrooms}</strong><span>Bathrooms</span></div><div><strong>${property.area} ${property.unit}</strong><span>Floor area</span></div><div><strong>${property.is_available === "yes" ? "Available" : "Unavailable"}</strong><span>Current status</span></div>
    </div>
    <div class="detail-content-grid">
      <div class="detail-main-content">
        <section class="detail-section"><p class="detail-eyebrow">About this property</p><h2>Comfort, convenience, and a clear sense of place.</h2><p>${description}</p></section>
        <section class="detail-section"><p class="detail-eyebrow">Property features</p><h2>Included with the property</h2><ul class="feature-list">${features.map((feature) => `<li>✓ ${feature}</li>`).join("")}</ul></section>
        <section class="detail-section"><p class="detail-eyebrow">Location</p><h2>Explore the neighbourhood</h2><div class="location-card"><span>⌖</span><div><strong>${address}</strong><small>Listed ${postedDate}</small></div></div></section>
      </div>
      <aside class="detail-sidebar">
        <div class="agent-summary"><img src="${agentPhoto}" alt="${agentName}"><div><small>Your property advisor</small><strong>${agentName}</strong><span>${agentDistrict} specialist</span></div><a href="/pages/agent-detail/index.html?id=${agent?.id || 301}">View agent profile →</a></div>
        <div class="inquiry-card"><p class="detail-eyebrow">Arrange a viewing</p><h2>Interested in this property?</h2><p>Share your details and an advisor will help with availability, questions, and viewing times.</p><form class="inquiry-form" action="/pages/Success/index.html"><label>Full name<input type="text" name="name" placeholder="Your full name" required></label><label>Email<input type="email" name="email" placeholder="you@example.com" required></label><label>Message<textarea name="message" placeholder="I would like to arrange a viewing…"></textarea></label><button type="submit">Request a viewing</button></form></div>
      </aside>
    </div>`;
}

Promise.all([
  fetch("../../public/data/properties.json").then((response) => response.json()),
  fetch("../../public/data/agents.json").then((response) => response.json())
]).then(([properties, agents]) => {
  const property = properties.find((item) => Number(item.id) === propertyId);
  if (!property) throw new Error("Property not found");
  const agent = agents.find((item) => Number(item.id) === Number(property.agent_id));
  document.title = `${property.title.en} | Apple KH Real Estate`;
  detailContainer.innerHTML = detailMarkup(property, agent);

  const similar = properties
    .filter((item) => item.id !== property.id && (item.type === property.type || item.location.city === property.location.city))
    .slice(0, 3);
  relatedContainer.innerHTML = similar.map(propertyCard).join("");
}).catch((error) => {
  console.error(error);
  detailContainer.innerHTML = '<div class="detail-loading"><h1>Property not found</h1><p>Please return to the listings and choose another property.</p></div>';
  relatedContainer.innerHTML = "";
});

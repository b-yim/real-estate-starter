const agentId = Number(new URLSearchParams(window.location.search).get("id")) || 301;
const relatedGrid = document.getElementById("relatedToAgent");

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

Promise.all([
  fetch("../../public/data/agents.json").then((response) => response.json()),
  fetch("../../public/data/properties.json").then((response) => response.json())
]).then(([agents, properties]) => {
  const agent = agents.find((item) => Number(item.id) === agentId) || agents[0];
  const languages = agent.languages.map((language) => ({ km: "Khmer", en: "English", zh: "Mandarin" })[language] || language);

  document.title = `${agent.full_name} | Apple KH Real Estate`;
  const photo = document.getElementById("agentPhoto");
  photo.src = getAgentPortrait(agent.id);
  photo.alt = `${agent.full_name}, property advisor`;
  document.getElementById("agentName").textContent = agent.full_name;
  document.getElementById("agentSpecialty").textContent = `${agent.district} specialist · ${languages.join(" & ")}`;
  document.getElementById("agentDescription").textContent = agent.description;
  document.getElementById("agentBio").textContent = `${agent.full_name} combines detailed knowledge of ${agent.district} with a calm, straightforward process for renters, buyers, and property owners.`;
  document.getElementById("languageCount").textContent = languages.length;

  const phoneLink = document.getElementById("agentPhone");
  phoneLink.href = `tel:${agent.contact.phone.replace(/[^+\d]/g, "")}`;
  phoneLink.textContent = `Call ${agent.contact.phone}`;
  const emailLink = document.getElementById("agentEmail");
  emailLink.href = `mailto:${agent.contact.email}`;
  emailLink.textContent = "Send email";

  const assigned = properties.filter((property) => Number(property.agent_id) === Number(agent.id));
  const recommendations = (assigned.length ? assigned : properties).slice(0, 3);
  relatedGrid.innerHTML = recommendations.map(propertyCard).join("");
}).catch((error) => {
  console.error(error);
  relatedGrid.innerHTML = '<p class="loading-state">Unable to load this agent profile.</p>';
});

// feature card
const sectionFeatureElement = document.getElementById("featureCard")

fetch("/public/data/properties.json")
 .then((response) => response.json())
 .then((data) => {
    if (data.length > 0) {
        for (let i = 0; i < 20; i++) {
            const item = data[i];
            const image = Array.isArray(item.images) ? item.images[0] : item.images;
            const price = new Intl.NumberFormat("en-US").format(item.price);
            const suffix = item.purpose === "rent" ? "/mo" : "";
            sectionFeatureElement.innerHTML += `
              <a class="property-card" href="/pages/detail-card/index.html?id=${item.id}">
                <div class="property-image"><img src="${image}" alt="${item.title.en}"><span class="property-label">For ${item.purpose}</span></div>
                <div class="property-body">
                  <div class="property-top"><h3 class="property-title">${item.title.en}</h3><span class="property-price">$${price}${suffix}</span></div>
                  <p class="property-location">${item.location.district}, ${item.location.city}</p>
                  <div class="property-meta"><span>▱ ${item.bedrooms} beds</span><span>◫ ${item.bathrooms} baths</span><span>□ ${item.area} ${item.unit}</span></div>
                </div>
              </a>`;
        }

        initializeFeatureScroller();
    }
 })

function initializeFeatureScroller() {
  const scroller = sectionFeatureElement.closest(".scroller");
  if (!scroller) return;

  const track = scroller.querySelector(".scroller__track");
  const firstGroup = track?.querySelector(".scroller__group:not([aria-hidden='true'])");
  if (!track || !firstGroup) return;

  track.querySelectorAll(".scroller__group[aria-hidden='true']").forEach((clone) => clone.remove());

  const clone = firstGroup.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);

  const pxPerSecond = 45;
  const duration = (firstGroup.scrollWidth * 2) / pxPerSecond;
  track.style.setProperty("--marquee-duration", `${duration}s`);
}

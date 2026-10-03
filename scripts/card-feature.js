// feature card
const sectionFeatureElement = document.getElementById("featureCard")

fetch("/public/data/properties.json")
 .then((response) => response.json())
 .then((data) => {
    if (data.length > 0) {
        for (let i = 0; i < 20; i++) {
            console.log(data);
            
            sectionFeatureElement.innerHTML += `
            <a class="card" href="/pages/detail-card/index.html?id=${data[i].id}">
                <img class="card__media" src="${data[i].images}"
                    alt="" />
                <div class="card__body">
                    <small>
                        <i class="fa-solid fa-bed"></i> ${data[i].bedrooms} Bedroom
                        <i class="fa-solid fa-bath"></i> ${data[i].bathrooms}  Bathroom
                    </small>
                    <h3 class="card__title">${data[i].title.en}</h3>
                    <span class="badge">${data[i].location.district}</span>
                    <div class="card__meta">USD ${data[i].price}</div>
                </div>
            </a>
        `;
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

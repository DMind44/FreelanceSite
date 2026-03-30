function parseServicesFile(text) {
  return text
    .split(/\n\s*\n/)
    .map((block, index) => {
      const service = { id: index + 1 };

      block
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
          const colonIndex = line.indexOf(":");
          if (colonIndex === -1) return;

          const key = line.slice(0, colonIndex).trim().toLowerCase();
          const value = line.slice(colonIndex + 1).trim();

          if (key) service[key] = value;
        });

      return service;
    })
    .filter((service) => service.title && service.description);
}

async function loadServices() {
  const grid = document.getElementById("services-grid");
  const error = document.getElementById("services-error");
  const empty = document.getElementById("services-empty");

  if (!grid) return;

  try {
    const response = await fetch("services.txt");

    if (!response.ok) {
      throw new Error("Could not load services.txt");
    }

    const text = await response.text();
    const services = parseServicesFile(text);

    if (!services.length) {
      empty.classList.remove("hidden");
      return;
    }

    grid.innerHTML = services
      .map(
        (service) => `
          <article class="service-card">
            <img
              src="${service.image || "https://via.placeholder.com/400x300"}"
              alt="${service.title}"
              class="service-image"
            />
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-meta">
              <span class="price">${service.price || "Contact for pricing"}</span>
              <a class="btn btn-primary" href="${service.link || "/contact"}">Commission</a>
            </div>
          </article>
        `
      )
      .join("");
  } catch (err) {
    error.textContent = "No services file found or it could not be loaded.";
    error.classList.remove("hidden");
  }
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

loadServices();

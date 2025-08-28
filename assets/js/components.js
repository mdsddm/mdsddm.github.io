/* UI components rendered across pages to ensure modularity and DRY. */

/* Header + Nav */
function renderHeader(activePath = window.location.pathname) {
  const header = document.getElementById("site-header");
  if (!header) return;

  const links = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "skills.html", label: "Skills" },
    { href: "projects.html", label: "Projects" },
    { href: "certifications.html", label: "Certs" },
    { href: "contact.html", label: "Contact" }
  ];

  header.classList.add("site");
  header.innerHTML = `
    <nav class="nav container" aria-label="Main Navigation">
      <a class="brand" href="index.html" aria-label="Go to Home">
        <span class="brand__dot"></span> <span>Mohd Saddam</span>
      </a>
      <button class="nav__toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-panel">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <div class="nav__links" id="nav-panel" role="menubar">
        ${links
      .map((l) => {
        const active =
          activePath.endsWith(l.href) || (l.href === "index.html" && activePath.endsWith("/"));
        return `<a role="menuitem" class="${active ? "active" : ""}" href="${l.href}">${l.label}</a>`;
      })
      .join("")}
      </div>
  <button class="theme-toggle" id="theme-toggle" aria-pressed="false" aria-label="Toggle theme">
    <span class="icon" data-theme-icon>
      <svg viewBox="0 0 24 24" aria-hidden="true" class="icon-sun"><circle cx="12" cy="12" r="5" /><g stroke-width="1.5"><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" /></g></svg>
    </span>
  </button>
    </nav>
  `;
}

/* Footer */
function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  const year = new Date().getFullYear();
  footer.classList.add("site");
  footer.innerHTML = `
    <div class="container">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
        <span>&copy; ${year} Mohd Saddam</span>
        <span>
          <a href="${PROFILE.links.github}" target="_blank" rel="noopener">GitHub</a> ·
          <a href="${PROFILE.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        </span>
      </div>
    </div>
  `;
}

/* Project Card */
function projectCard(p) {
  return `
    <article class="card card--project" data-category="${p.category}">
      <img class="thumb" src="${p.thumb}" alt="${p.title} thumbnail"/>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${p.tech.map(t => `<span class="badge">${t}</span>`).join("")}</div>
      <div style="margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${p.links.live !== "#" ? `<a class="btn btn--primary" href="${p.links.live}" target="_blank" rel="noopener">Live</a>` : ""}
        ${p.links.repo !== "#" ? `<a class="btn" href="${p.links.repo}" target="_blank" rel="noopener">Repo</a>` : ""}
        <button class="btn js-details" data-slug="${p.slug}">Details</button>
      </div>
    </article>
  `;
}

/* Render featured projects on homepage */
function renderFeatured() {
  const mount = document.getElementById("featured-projects");
  if (!mount) return;
  mount.innerHTML = PROFILE.projects.slice(0, 3).map(projectCard).join("");
  // Attach details modal handler for homepage featured cards
  mount.addEventListener("click", (e) => {
    const btn = e.target.closest('.js-details');
    if (!btn) return;
    const slug = btn.dataset.slug;
    const project = PROFILE.projects.find(p => p.slug === slug);
    if (!project) return;
    const features = project.features ? `<ul style="margin:0.75rem 0 0.5rem 1.1rem; line-height:1.4;">${project.features.map(f => `<li>${f}</li>`).join("")}</ul>` : "";
    const links = `<p style=\"margin-top:0.75rem; display:flex; gap:.75rem; flex-wrap:wrap;\">${project.links.repo !== '#' ? `<a class='btn' href='${project.links.repo}' target='_blank' rel='noopener'>Repo</a>` : ''}${project.links.live !== '#' ? `<a class='btn btn--primary' href='${project.links.live}' target='_blank' rel='noopener'>Live</a>` : ''}</p>`;
    openModal(`
      <h2 style=\"margin-bottom:.4rem;\">${project.title}</h2>
      <p style=\"margin:0 0 .6rem;\">${project.details}</p>
      ${features}
      <p style=\"margin:.6rem 0 0;\"><strong>Tech:</strong> ${project.tech.join(", ")}</p>
      ${links}
    `);
  });
}

/* Render all projects with filtering */
function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  grid.innerHTML = PROFILE.projects.map(projectCard).join("");

  // Filter logic
  const filterButtons = document.querySelectorAll(".filters .chip");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      grid.querySelectorAll(".card--project").forEach(card => {
        card.style.display = (f === "all" || card.dataset.category === f) ? "block" : "none";
      });
    });
  });

  // Modal details
  grid.addEventListener("click", (e) => {
    const button = e.target.closest(".js-details");
    if (!button) return;
    const slug = button.dataset.slug;
    const project = PROFILE.projects.find(p => p.slug === slug);
    const features = project.features ? `<ul style="margin:0.75rem 0 0.5rem 1.1rem; line-height:1.4;">${project.features.map(f => `<li>${f}</li>`).join("")}</ul>` : "";
    const links = `<p style="margin-top:0.75rem; display:flex; gap:.75rem; flex-wrap:wrap;">${project.links.repo !== '#' ? `<a class='btn' href='${project.links.repo}' target='_blank' rel='noopener'>Repo</a>` : ''}${project.links.live !== '#' ? `<a class='btn btn--primary' href='${project.links.live}' target='_blank' rel='noopener'>Live</a>` : ''}</p>`;
    openModal(`
      <h2 style="margin-bottom:.4rem;">${project.title}</h2>
      <p style="margin:0 0 .6rem;">${project.details}</p>
      ${features}
      <p style="margin:.6rem 0 0;"><strong>Tech:</strong> ${project.tech.join(", ")}</p>
      ${links}
    `);
  });
}

/* Modal helpers */
function openModal(html) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");
  content.innerHTML = html;
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  const modal = document.getElementById("modal");
  modal.setAttribute("aria-hidden", "true");
}

/* Skill lists */
function renderSkills() {
  const map = [
    ["skills-languages", PROFILE.skills.languages],
    ["skills-web", PROFILE.skills.web],
    ["skills-tools", PROFILE.skills.tools],
    ["skills-dbs", PROFILE.skills.databases],
  ];
  map.forEach(([id, arr]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = arr.map(s => `<li class="chips">${s}</li>`).join("");
  });
}

/* Certifications */
function renderCerts() {
  const ul = document.getElementById("cert-list");
  if (!ul) return;
  ul.innerHTML = PROFILE.certifications.map(c => `<li>${c.title}</li>`).join("");
}

/* Bootstrapping per page */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderFeatured();
  renderProjects();
  renderSkills();
  renderCerts();

  // Modal wiring
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.matches(".modal__close") || e.target.matches(".modal__backdrop")) {
        closeModal();
      }
    });
  }
});

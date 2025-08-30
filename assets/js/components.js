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
      <div class="media">
        <img class="thumb" src="${p.thumb}" alt="${p.title} thumbnail" loading="lazy" decoding="async"/>
      </div>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="tags">${p.tech.map(t => `<span class="badge">${t}</span>`).join("")}</div>
        <div class="project-actions">
     ${p.slug === 'tkinter-calculator'
      ? `<button class="btn btn--details js-details" data-slug="${p.slug}" aria-label="Open ${p.title} details">Details</button>
      ${p.links.repo !== "#" ? `<a class="btn btn--repo" href="${p.links.repo}" target="_blank" rel="noopener">Repo</a>` : ""}
      ${p.links.live !== "#" ? `<a class="btn btn--primary" href="${p.links.live}" target="_blank" rel="noopener">Live</a>` : ""}`
      : `${p.links.live !== "#" ? `<a class="btn btn--primary" href="${p.links.live}" target="_blank" rel="noopener">Live</a>` : ""}
      ${p.links.repo !== "#" ? `<a class="btn btn--repo" href="${p.links.repo}" target="_blank" rel="noopener">Repo</a>` : ""}
      <button class="btn btn--details js-details" data-slug="${p.slug}" aria-label="Open ${p.title} details">Details</button>`}
        </div>
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
    openModal(buildProjectDetail(project));
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
    openModal(buildProjectDetail(project));
  });
}

/* Build modern project detail modal markup */
function buildProjectDetail(p) {
  // Escape helper to avoid accidental HTML injection
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
  const featureList = p.features ? p.features.map(f => `<li class="ps-feature"><span class="ps-feature__icon"></span><span>${esc(f)}</span></li>`).join("") : "";
  const repoLink = p.links.repo !== '#' ? `<a class='btn btn--ghost' href='${p.links.repo}' target='_blank' rel='noopener'>Repo</a>` : '';
  const liveLink = p.links.live !== '#' ? `<a class='btn btn--primary' href='${p.links.live}' target='_blank' rel='noopener'>Live</a>` : '';
  const techBadges = p.tech.map(t => `<span class="ps-chip">${esc(t)}</span>`).join("");
  const detailText = esc(p.details && p.details.trim() ? p.details : p.description);
  return `
  <article class="project-sheet" aria-labelledby="ps-title" role="dialog">
    <div class="project-sheet__head">
      <div class="project-sheet__media">
        <img src="${p.thumb}" alt="${esc(p.title)} cover" loading="lazy" decoding="async" />
      </div>
      <div class="project-sheet__title">
        <h2 id="ps-title" class="project-sheet__heading">${esc(p.title)}</h2>
        <p class="project-sheet__tagline">${esc(p.description)}</p>
      </div>
    </div>
    <div class="project-sheet__body">
      <p class="project-sheet__overview">${detailText}</p>
      ${featureList ? `<div class="project-sheet__block" aria-label="Key Features"><ul class="project-sheet__features">${featureList}</ul></div>` : ''}
      <div class="project-sheet__block" aria-label="Tech Stack">
        <h3 class="project-sheet__subheading">Tech Stack</h3>
        <div class="project-sheet__chips">${techBadges}</div>
      </div>
      <div class="project-sheet__actions" aria-label="Project Links">${repoLink}${liveLink}</div>
    </div>
  </article>`;
}

/* Modal helpers */
function openModal(html) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;
  content.innerHTML = html;
  document.body.classList.add('sheet-open');
  modal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => content.focus());
}
function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove('sheet-open');
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

  // (Removed lens JS; shimmer handled via CSS only)

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

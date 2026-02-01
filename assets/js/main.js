document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Utils
    setupTouchDetect();

    // 2. Render Content
    renderProjects();
    renderSkills();
    renderEducation();

    // 3. Setup Interactions
    setupScrollSpy();
    setupSmoothScroll();
    setupScrollReveal(); 
    setupHeroParallax();
});

/* --- 1. Utils --- */
function setupTouchDetect() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.documentElement.classList.add('touch');
    }
}

/* --- Animation & Parallax --- */

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Target elements to animate
    const targets = document.querySelectorAll('.v3-section, .bento-item, .section-title, .v3-hero__text');
    targets.forEach((el, i) => {
        el.classList.add('reveal-on-scroll');
        // Optional: Add staggering if they are siblings (like bento items)
        if (el.classList.contains('bento-item')) {
            el.style.transitionDelay = `${(i % 3) * 100}ms`;
        }
        observer.observe(el);
    });
}

function setupHeroParallax() {
    const hero = document.getElementById('hero');
    const blobs = document.querySelectorAll('.blob');
    if (!hero || blobs.length === 0) return;

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) - 0.5;
        const y = (clientY / window.innerHeight) - 0.5;

        blobs.forEach((blob, index) => {
            const speed = index === 0 ? 20 : -30; // Different speeds/directions
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

/* --- 2. Rendering --- */

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid || !PROFILE.projects) return;

    grid.innerHTML = PROFILE.projects
        .filter(p => p.slug !== 'portfolio')
        .map((proj, index) => {
        return `
            <article class="bento-item card--project">
                <div class="media">
                     <img src="${proj.thumb}" alt="${proj.title}" loading="lazy" class="thumb">
                </div>
                <div class="project-body">
                    <div class="tags">
                        ${proj.tech.slice(0, 3).map(t => `<span class="badge">${t}</span>`).join('')}
                    </div>
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.description}</p>
                    <div class="project-actions">
                        <a href="${proj.links.repo}" target="_blank" class="btn btn--sm btn--outline">
                            <svg viewBox="0 0 24 24" fill="none" class="icon-sm" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                            Code
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function renderSkills() {
    const marquee = document.getElementById('skills-marquee');
    if (!marquee || !PROFILE.skills) return;

    // Flatten all skills into one list for the marquee
    // PROFILE.skills is an object { languages: [], web: [], ... }
    const allSkills = Object.values(PROFILE.skills).flat();
    
    // Duplicate for infinite scroll smoothness
    const skillsHTML = allSkills.map(skill => `
        <div class="mq-item">
            <span class="v3-skill-text">${skill}</span>
        </div>
    `).join('');

    marquee.innerHTML = skillsHTML + skillsHTML; // Duplicate
}

function renderEducation() {
    const grid = document.getElementById('education-grid');
    if (!grid || !PROFILE.education) return;

    grid.innerHTML = PROFILE.education.map(edu => {
        // Parse "program" to separate Degree from Institute if possible, or just display as is
        // Format: "MCA – Jamia Millia Islamia"
        const parts = edu.program.split('–');
        const degree = parts[0] ? parts[0].trim() : edu.program;
        const place = parts[1] ? parts[1].trim() : '';
        const scoreLabel = edu.cgpa ? 'CGPA' : 'Percentage';
        const scoreValue = edu.cgpa || edu.perc;

        return `
            <div class="edu-card v3-glass">
                <div class="edu-header">
                    <span class="edu-year">${edu.year}</span>
                    <span class="edu-score">${scoreLabel}: ${scoreValue}</span>
                </div>
                <h3 class="edu-degree">${degree}</h3>
                <p class="edu-place">${place}</p>
            </div>
        `;
    }).join('');
}


/* --- 3. Interactions --- */

/* Active Nav Link on Scroll */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.v3-nav__link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.v3-nav__link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.3 }); // 30% visible

    sections.forEach(sec => observer.observe(sec));
}

/* Smooth Scroll for Anchors */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
}

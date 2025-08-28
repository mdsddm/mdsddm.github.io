/* App-wide behaviors: theme toggle, mobile nav, intersection animations */

(function themeInit() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("light");
})();

function setupThemeButton() {
    const SUN_SVG = `<svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='5'/><g stroke-width='1.5'><line x1='12' y1='2' x2='12' y2='5'/><line x1='12' y1='19' x2='12' y2='22'/><line x1='4.22' y1='4.22' x2='6.34' y2='6.34'/><line x1='17.66' y1='17.66' x2='19.78' y2='19.78'/><line x1='2' y1='12' x2='5' y2='12'/><line x1='19' y1='12' x2='22' y2='12'/><line x1='4.22' y1='19.78' x2='6.34' y2='17.66'/><line x1='17.66' y1='6.34' x2='19.78' y2='4.22'/></g></svg>`;
    const MOON_SVG = `<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M21 12.79A9 9 0 0 1 11.21 3 7.5 7.5 0 1 0 21 12.79z'/></svg>`;
    const setIconMarkup = (btn, isLight) => {
        const span = btn.querySelector('[data-theme-icon]');
        if (!span) return;
        span.classList.remove('swap');
        span.innerHTML = isLight ? MOON_SVG : SUN_SVG; // show NEXT theme icon
        // force reflow then add swap class for animation
        void span.offsetWidth;
        span.classList.add('swap');
    };
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#theme-toggle');
        if (!btn) return;
        const root = document.documentElement;
        const isLight = root.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight ? 'Activate dark theme' : 'Activate light theme');
        setIconMarkup(btn, isLight);
    });
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        const isLight = document.documentElement.classList.contains('light');
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight ? 'Activate dark theme' : 'Activate light theme');
        setIconMarkup(btn, isLight);
    });
}

/* Mobile nav: toggle open/closed, set aria-expanded, and basic focus mgmt */
function setupMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const panel = document.getElementById("nav-panel");
    if (!navToggle || !panel) return;

    const links = panel.querySelectorAll("a");

    function openMenu() {
        panel.classList.add("open");
        // Prepare for transition from 0 -> content height
        panel.style.height = 'auto';
        const target = panel.scrollHeight; // full height including padding
        panel.style.height = '0px'; // reset to start state
        requestAnimationFrame(() => {
            panel.style.height = target + 'px';
        });
        navToggle.setAttribute("aria-expanded", "true");
        if (links.length) links[0].focus();
    }
    function closeMenu() {
        // Animate back to 0
        const current = panel.scrollHeight;
        panel.style.height = current + 'px';
        requestAnimationFrame(() => {
            panel.style.height = '0px';
        });
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
    }
    function toggleMenu() {
        const open = navToggle.getAttribute("aria-expanded") === "true";
        open ? closeMenu() : openMenu();
    }

    navToggle.addEventListener("click", toggleMenu);

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
            closeMenu();
        }
    });

    // Close when clicking a link (mobile)
    panel.addEventListener("transitionend", (e) => {
        if (e.propertyName !== 'height') return;
        if (navToggle.getAttribute('aria-expanded') === 'true') {
            // keep natural layout after opening
            panel.style.height = 'auto';
        } else if (panel.style.height === '0px') {
            panel.classList.remove('open');
        }
    });

    panel.addEventListener("click", (e) => {
        if (e.target.tagName === "A") closeMenu();
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (navToggle.getAttribute("aria-expanded") === "true" && !panel.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Handle viewport resize: if leaving mobile breakpoint ensure menu is fully reset
    let lastIsMobile = window.matchMedia('(max-width:780px)').matches;
    window.addEventListener('resize', () => {
        const isMobile = window.matchMedia('(max-width:780px)').matches;
        if (!isMobile && lastIsMobile) {
            // entering desktop: clear inline styles & classes
            panel.classList.remove('open');
            panel.style.height = '';
            navToggle.setAttribute('aria-expanded', 'false');
        } else if (isMobile && !lastIsMobile) {
            // entering mobile: ensure collapsed initial state
            panel.classList.remove('open');
            panel.style.height = '0px';
            navToggle.setAttribute('aria-expanded', 'false');
        }
        lastIsMobile = isMobile;
    });
}

// Simple intersection observer to animate cards
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = "1";
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.addEventListener("DOMContentLoaded", () => {
    setupThemeButton();
    // Run after header injected
    setTimeout(setupMobileNav, 0);

    document.querySelectorAll(".card").forEach((el) => {
        el.style.transform = "translateY(8px)";
        el.style.opacity = "0";
        el.style.transition = "transform 240ms ease, opacity 240ms ease";
        io.observe(el);
    });
});

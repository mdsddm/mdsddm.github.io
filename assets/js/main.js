/* App-wide behaviors: theme toggle, mobile nav, intersection animations */

(function themeInit() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("light");
})();

/* Lightweight performance mode auto-toggle */
(function perfInit(){
    try {
        const root = document.documentElement;
        // Manual override: localStorage.perf = 'fast' | 'full'
        const stored = localStorage.getItem('perf');
        if(stored === 'fast') { root.classList.add('perf-fast'); return; }
        if(stored === 'full') { root.classList.remove('perf-fast'); return; }
        // Heuristics: low # of logical cores or capped memory -> fast mode
        const cores = navigator.hardwareConcurrency || 4;
        const mem = navigator.deviceMemory || 4; // GB (not supported everywhere)
        if(cores <= 4 || mem <= 4) root.classList.add('perf-fast');
    } catch(_) { /* ignore */ }
})();

/* Touch detection (for mobile-specific hover simplifications) */
(function touchDetect(){
    if('ontouchstart' in window || navigator.maxTouchPoints > 0){
        document.documentElement.classList.add('touch');
    }
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
        // Begin fast theme transition: capture prior theme background via clone overlay
        try {
            const existing = document.getElementById('theme-transition-overlay');
            if(existing) existing.remove();
            const ov = document.createElement('div');
            ov.id = 'theme-transition-overlay';
            // Snapshot current body background (simpler than computed gradient clone) – browsers will paint with old vars until class flips
            const cs = getComputedStyle(document.body);
            ov.style.background = cs.backgroundImage ? cs.backgroundImage + ',' + cs.backgroundColor : cs.background || 'var(--bg)';
            document.body.appendChild(ov);
        } catch(_) { /* ignore */ }
        root.classList.add('theme-switching');
        const isLight = root.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight ? 'Activate dark theme' : 'Activate light theme');
        setIconMarkup(btn, isLight);
        // Remove helper class shortly after transitions settle
        setTimeout(() => { root.classList.remove('theme-switching'); }, 420);
        // Clean overlay after fade
        setTimeout(() => { const ov = document.getElementById('theme-transition-overlay'); ov && ov.remove(); }, 380);
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
    // Create overlay once (for modern mobile drawer feel)
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    const links = panel.querySelectorAll("a");

    function openMenu() {
        panel.classList.add("open");
    document.body.classList.add('nav-open');
        overlay.classList.add('show'); // purely visual now (no pointer events)
        // Prepare for transition from 0 -> content height
        panel.style.height = 'auto';
        const target = panel.scrollHeight; // full height including padding
        panel.style.height = '0px'; // reset to start state
        requestAnimationFrame(() => {
            panel.style.height = target + 'px';
            panel.style.visibility = 'visible';
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
    overlay.classList.remove('show');
    document.body.classList.remove('nav-open');
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

    // Removed: link click, overlay click, and swipe-down close per request (only toggle closes menu)
    // (Handlers intentionally omitted to restrict closing to nav toggle button.)

    // Outside click close disabled as requested.

    // Handle viewport resize: if leaving mobile breakpoint ensure menu is fully reset
    let lastIsMobile = window.matchMedia('(max-width:780px)').matches;
    window.addEventListener('resize', () => {
        const isMobile = window.matchMedia('(max-width:780px)').matches;
        if (!isMobile && lastIsMobile) {
            // entering desktop: clear inline styles & classes
            panel.classList.remove('open');
            panel.style.height = '';
            navToggle.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('show');
            document.body.classList.remove('nav-open');
        } else if (isMobile && !lastIsMobile) {
            // entering mobile: ensure collapsed initial state
            panel.classList.remove('open');
            panel.style.height = '0px';
            navToggle.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('show');
            document.body.classList.remove('nav-open');
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


/* === Anti-copy protections (requested) ==================================== */
(function preventCopy() {
    const root = document.documentElement;
    root.classList.add('nocopy');
    const block = (e) => e.preventDefault();
    ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach(ev => document.addEventListener(ev, block));
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'p', 'u', 'a'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });
    // Mark media as non-draggable/non-savable (basic deterrent, not foolproof)
    const disableMedia = () => {
        document.querySelectorAll('img, svg, picture, canvas, video').forEach(el => {
            el.setAttribute('draggable','false');
            el.setAttribute('aria-hidden', el.tagName !== 'IMG' ? 'true' : el.getAttribute('aria-hidden') || 'false');
        });
    };
    document.addEventListener('DOMContentLoaded', disableMedia);
    // For dynamically added (e.g., modal content)
    const mo = new MutationObserver(disableMedia);
    mo.observe(document.documentElement, { childList:true, subtree:true });
})();

/* === Ultra Fast Page Switching (SPA-lite) ============================= */
(function fastNav(){
    const support = 'pushState' in history && window.fetch;
    if(!support) return; // fallback to normal nav
    const origin = location.origin;
    const isInternal = (url) => url.origin === origin;
    async function load(url, add=true){
        try {
            const res = await fetch(url, { credentials:'same-origin' });
            if(!res.ok) throw 0;
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html,'text/html');
            const newMain = doc.querySelector('main');
            const curMain = document.querySelector('main');
            if(newMain && curMain){
                // Smooth cross-fade: stage new main atop old one
                const parent = curMain.parentNode;
                // Clone current main temporarily to allow animation out
                const outgoing = curMain;
                outgoing.classList.add('fastnav-outgoing');
                newMain.classList.add('fastnav-incoming');
                parent.appendChild(newMain); // position absolute over outgoing
                document.documentElement.classList.add('fast-nav-switching');
                // Update active nav link
                document.querySelectorAll('#nav-panel a').forEach(a=>{
                    a.classList.toggle('active', a.getAttribute('href') && (new URL(a.href).pathname === new URL(url).pathname));
                });
                // Re-run per-page renderers (data already loaded)
                renderFeatured();
                renderProjects();
                renderSkills();
                renderCerts();
                initContactForm && initContactForm();
                // Scroll to top
                window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
                // Trigger incoming reveal next frame
                requestAnimationFrame(()=>{
                    newMain.classList.add('fastnav-show');
                    // After transition end, cleanup
                    const done = () => {
                        newMain.removeEventListener('transitionend', done);
                        // Remove outgoing
                        outgoing.remove();
                        newMain.classList.remove('fastnav-incoming','fastnav-show');
                        document.documentElement.classList.remove('fast-nav-switching');
                    };
                    newMain.addEventListener('transitionend', done);
                });
                if(add) history.pushState({ spa: true }, '', url);
            } else {
                location.href = url; // fallback
            }
        } catch { location.href = url; }
    }
    document.addEventListener('click', (e)=>{
        const a = e.target.closest('a');
        if(!a) return;
        const href = a.getAttribute('href');
        if(!href || href.startsWith('#') || a.target==='_blank' || href.startsWith('mailto:') || href.startsWith('tel:') ) return;
        const url = new URL(href, location.href);
        if(!isInternal(url)) return;
        e.preventDefault();
        load(url.href, true);
    });
    window.addEventListener('popstate', (e)=>{ if(e.state && e.state.spa) load(location.href, false); });
})();

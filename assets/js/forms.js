/* Contact form validation + UX (no backend; ready to plug APIs like Formspree) */

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form || form.dataset.bound) return; // guard re-init
    form.dataset.bound = 'true';
    const endpoint = form.dataset.endpoint; // Formspree endpoint
    const sendBtn = document.getElementById('send-btn');
    const statusEl = document.getElementById("form-success");
    if (statusEl) statusEl.setAttribute('tabindex', '-1');

    function setError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
    function clearErrors() { ['name', 'email', 'message'].forEach(f => setError(f + "-error", "")); }
    function disable(state) { if (sendBtn) { sendBtn.disabled = state; sendBtn.textContent = state ? 'Sending...' : 'Send'; } }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors(); statusEl.textContent = '';
        const { name, email, message, _gotcha } = form;
        const nameVal = name.value.trim();
        const emailVal = email.value.trim();
        const msgVal = message.value.trim();
        let ok = true;
        if (!nameVal) { setError('name-error', 'Please enter a name.'); ok = false; }
        if (!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)) { setError('email-error', 'Enter a valid email.'); ok = false; }
        if (!msgVal || msgVal.length < 10) { setError('message-error', 'Message should be at least 10 characters.'); ok = false; }
        if (_gotcha && _gotcha.value) return; // honeypot filled => bot
        if (!ok) return;
        if (!endpoint || !/^https:\/\//.test(endpoint)) { statusEl.textContent = 'Form not configured.'; return; }
        disable(true);
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name: nameVal, email: emailVal, message: msgVal })
            });
            if (!res.ok) throw new Error('Network');
            const data = await res.json().catch(() => ({}));
            statusEl.textContent = data.ok === false ? 'Send failed.' : 'Thanks! Message sent.';
            statusEl && statusEl.focus();
            form.reset();
        } catch (err) {
            statusEl.textContent = 'Send failed. Please retry later.';
            statusEl && statusEl.focus();
        } finally { disable(false); }
    });
}

document.addEventListener("DOMContentLoaded", initContactForm);

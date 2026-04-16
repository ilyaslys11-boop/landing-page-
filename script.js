/* ============================================================
   Landing Page — interactions
   - Countdown timer (persists end time in localStorage)
   - FAQ (native <details>, no JS needed, but enhances UX)
   - Order form validation
   - Reveal-on-scroll
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Countdown ---------- */
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');

  const COUNTDOWN_KEY = 'beardOfferEndsAt';
  const COUNTDOWN_HOURS = 24;

  function getOrSetEndTime() {
    const saved = Number(localStorage.getItem(COUNTDOWN_KEY));
    const now = Date.now();
    if (!saved || saved < now) {
      const end = now + COUNTDOWN_HOURS * 60 * 60 * 1000;
      localStorage.setItem(COUNTDOWN_KEY, String(end));
      return end;
    }
    return saved;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick(endAt) {
    const diff = Math.max(0, endAt - Date.now());
    const totalSec = Math.floor(diff / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }

  if (hEl && mEl && sEl) {
    const endAt = getOrSetEndTime();
    tick(endAt);
    setInterval(() => tick(endAt), 1000);
  }

  /* ---------- FAQ: close others when one opens ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });

  /* ---------- Order form validation ---------- */
  const form = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMsg');

  function setError(name, message) {
    const el = form.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = message || '';
  }

  function validatePhone(v) {
    return /^05\d{8}$/.test(v.trim());
  }

  if (form) {
    const fields = ['name', 'phone', 'city', 'address'];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name    = form.name.value.trim();
      const phone   = form.phone.value.trim();
      const city    = form.city.value.trim();
      const address = form.address.value.trim();

      fields.forEach(f => setError(f, ''));

      if (name.length < 3) {
        setError('name', 'الرجاء إدخال اسم صحيح');
        valid = false;
      }
      if (!validatePhone(phone)) {
        setError('phone', 'رقم جوال غير صحيح (يبدأ بـ 05 ويتكوّن من 10 أرقام)');
        valid = false;
      }
      if (!city) {
        setError('city', 'الرجاء اختيار المدينة');
        valid = false;
      }
      if (address.length < 10) {
        setError('address', 'الرجاء إدخال عنوان تفصيلي');
        valid = false;
      }

      if (!valid) {
        // Scroll first invalid into view
        const firstError = form.querySelector('.error:not(:empty)');
        if (firstError) {
          const field = firstError.previousElementSibling;
          if (field && field.focus) field.focus();
        }
        return;
      }

      // Fake submit — in production replace with real API call.
      // Hide the form and show the success message.
      Array.from(form.elements).forEach(el => { if (el.type !== 'hidden') el.style.display = 'none'; });
      form.querySelectorAll('label, .field, .order-form__note').forEach(el => el.style.display = 'none');
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Mark select as touched so invalid styles kick in after first change
    const citySel = form.querySelector('#city');
    if (citySel) {
      citySel.addEventListener('change', () => citySel.setAttribute('data-touched', 'true'));
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.feature, .step, .review, .pain, .ba, .mini-review, .offer__card');
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hide sticky CTA when form is in view ---------- */
  const orderSection = document.getElementById('order');
  const sticky = document.querySelector('.sticky-cta');
  if (orderSection && sticky && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sticky.style.display = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.2 });
    obs.observe(orderSection);
  }
})();

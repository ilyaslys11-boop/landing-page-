/* ============================================================
   Landing Page — interactions
   - Countdown timer (persists end time in localStorage)
   - FAQ accordion (close others when one opens)
   - Add-to-Cart button feedback
   - Reveal-on-scroll
   - Hide sticky CTA when ATC section is visible
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

  /* ---------- Add-to-Cart button ---------- */
  const atcBtn = document.getElementById('atcBtn');
  if (atcBtn) {
    atcBtn.addEventListener('click', () => {
      const original = atcBtn.innerHTML;
      atcBtn.disabled = true;
      atcBtn.innerHTML = '<span>✔</span> تم الإضافة إلى السلة!';
      atcBtn.style.background = 'linear-gradient(135deg,#2ecc71,#1e9e55)';
      setTimeout(() => {
        atcBtn.disabled = false;
        atcBtn.innerHTML = original;
        atcBtn.style.background = '';
      }, 2800);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.feature, .step, .review, .pain, .ba, .mini-review, .offer__card, .atc-card'
  );
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

  /* ---------- Hide sticky CTA when ATC section is visible ---------- */
  const orderSection = document.getElementById('order');
  const sticky = document.getElementById('stickyCta');
  if (orderSection && sticky && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sticky.style.display = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.2 });
    obs.observe(orderSection);
  }
})();

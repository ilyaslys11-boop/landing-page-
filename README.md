# طقم نمو اللحية — Landing Page

صفحة هبوط احترافية (Arabic RTL) لمنتج **طقم نمو اللحية** (5 قطع) — مصمّمة للتحويل العالي والدفع عند الاستلام.

Professional Arabic RTL landing page for a beard-growth kit, optimized for conversion and cash-on-delivery orders.

## ✨ Features

- **RTL Arabic** layout (Tajawal font)
- **Luxury dark + gold** theme
- **10 conversion-focused sections**: Hero · Social Proof · Problem · Solution · How It Works · Before/After · Reviews · Offer · FAQ · Order Form
- **Live countdown timer** (24h, persists in `localStorage`)
- **Sticky mobile CTA** that hides when the order form is visible
- **Form validation** (Saudi mobile format `05XXXXXXXX`)
- **Responsive** — mobile, tablet, desktop
- **Zero build step** — pure HTML/CSS/JS, just open `index.html`

## 🚀 Run locally

Open `index.html` directly in a browser, or serve it:

```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000
```

## 📁 Structure

```
.
├── index.html       # Markup + all sections
├── styles.css       # Theme, layout, responsive
├── script.js        # Countdown, FAQ, form, reveals
└── images/          # Product photos (see images/README.md)
```

## 🖼️ Images

Drop your product photos into `images/` using the filenames listed in `images/README.md`. The page includes styled placeholders in case images are missing.

## 🔧 Customize

| What | Where |
|------|-------|
| Price / discount | `index.html` — section `.offer__prices` |
| Countdown duration | `script.js` — `COUNTDOWN_HOURS` |
| Colors | `styles.css` — `:root` variables |
| Form destination | `script.js` — replace the fake submit with your API/webhook |
| Reviews | `index.html` — sections `.proof` and `.reviews` |

## 📦 Wiring the form

`script.js` currently shows a success message without sending data. To send orders to your backend, replace the fake submit block with:

```js
const payload = { name, phone, city, address };
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

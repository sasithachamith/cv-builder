# CraftCV — Free CV Builder

Create a professional CV in minutes and download it as a print-ready **A4 PDF**.
No sign-up, no fees — everything runs in your browser, and your data never leaves your device.

## Features

- **7 CV templates**, including the *School Leaver* design (dark sidebar, A/L & O/L result tables, references) plus Modern Slate, Ocean Breeze, Rosé Elegance, Minimal Mono, Bold & Blue and Executive Grey.
- **Live A4 preview** — the preview is the exact node exported to PDF.
- **Download as PDF** (html2pdf/html2canvas + jsPDF, lazy-loaded only when you download) and **browser Print** (A4 print stylesheet included).
- **Desktop**: 3-pane editor — sections · form · live preview.
- **Mobile**: app-style UI — bottom navigation (Edit / Download / Preview), swipeable section chips and a bottom-sheet template picker.
- **First-time guided tour** with Android-style tap targets (pulsing ring + coach cards), shown once per device.
- **Auto-save** to `localStorage`; sample data pre-filled so the app makes sense immediately.
- Empty sections are hidden automatically on the CV — partial data never shows blank blocks.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Smoke test (optional)

Renders the real app in jsdom and checks the landing page, editor, mobile layout,
all 7 templates, coach marks and persistence:

```bash
npm i --no-save jsdom vite-node
npx vite-node smoke.test.js
```

## Tech

- Vite + React 18
- `html2pdf.js` (bundled; loaded on demand for PDF export)
- Google Fonts (Poppins, Inter, Lora)
- Inline SVG icons — no icon font dependency

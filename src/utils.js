// PDF generation via html2pdf.js (html2canvas + jsPDF under the hood).
// Kept in one place so the import loads lazily — only when the user
// actually downloads — keeping the first paint fast.

export function isMobile() {
  return window.matchMedia('(max-width: 900px)').matches;
}

export function fileNameFrom(cv) {
  const name = (cv?.personal?.fullName || 'my-cv')
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${name || 'my-cv'}-CV.pdf`;
}

export async function downloadPdf({ el, cv, onProgress }) {
  const mod = await import('html2pdf.js');
  const html2pdf = mod.default || mod;

  // Make sure web fonts are ready before rasterising
  try { await document.fonts?.ready; } catch (e) { /* ignore */ }

  const original = {
    parent: el.parentNode,
    next: el.nextSibling,
    scrollPos: { x: window.scrollX, y: window.scrollY },
    class: el.className,
    style: el.getAttribute('style') || '',
  };

  const holder = document.createElement('div');
  holder.id = 'cc-pdf-holder';
  el.parentNode.insertBefore(holder, el.nextSibling);

  const widthPx = el.offsetWidth || 794;
  const ratio = (el.offsetHeight || 1123) / widthPx;
  const pageCount = Math.max(1, Math.round(ratio / 1.414));
  const header = document.createElement('div');
  header.style.cssText = `height:${26 * pageCount}px;width:${widthPx}px;overflow:hidden;background:transparent;`;

  holder.appendChild(el);
  el.classList.add('is-pdf-exporting');

  try {
    // Capture exactly the page node's region of the document.
    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || 0;
    const scrollY = window.scrollY || 0;
    const worker = html2pdf(el).set({
      margin: 0,
      filename: fileNameFrom(cv),
      image: { type: 'jpeg', quality: 0.97 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        x: Math.floor(rect.left + scrollX),
        y: Math.floor(rect.top + scrollY),
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
        windowWidth: Math.max(Math.ceil(rect.width), Math.ceil(rect.right + scrollX)),
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'], avoid: 'tr, .cc-no-break, .tl-pill' },
    });
    if (onProgress) worker.toPdf().get('pdf').then((pdf) => pdf && pdf.internal && onProgress('Composing PDF…'));
    await worker.save();
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  } finally {
    holder.insertBefore(el, header.nextSibling);
    el.parentNode.insertBefore(el, holder);
    holder.remove();
    el.classList.remove('is-pdf-exporting');
    el.className = original.class;
    if (original.style) el.setAttribute('style', original.style); else el.removeAttribute('style');
    window.scrollTo(original.scrollPos.x, original.scrollPos.y);
  }
}

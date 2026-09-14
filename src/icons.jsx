import React from 'react';

/* App UI icons — inline stroke SVGs (lucide-style) */
const PATHS = {
  pencil: 'M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  layout: 'M3 3h18v18H3z M3 9h18 M9 21V9',
  home: 'M3 10.5 12 3l9 7.5 M5 9.5V21h14V9.5',
  check: 'M20 6 9 17l-5-5',
  chevL: 'm15 18-6-6 6-6',
  chevR: 'm9 18 6-6-6-6',
  plus: 'M12 5v14 M5 12h14',
  x: 'M18 6 6 18 M6 6l12 12',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  rotate: 'M3 12a9 9 0 1 0 2.6-6.4L3 8 M3 3v5h5',
  trash: 'M3 6h18 M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4',
  smartphone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z M12 18h.01',
  zap: 'M13 2 3 14h7l-1 8 11-14h-7l1-6Z',
  sparkles: 'M12 3l1.9 5.8L20 12l-6.1 3.2L12 21l-1.9-5.8L4 12l6.1-3.2L12 3Z',
  menu: 'M12 5h.01 M12 12h.01 M12 19h.01',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  image: 'M3 5h18v14H3z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M21 15l-5-5L5 21',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9z',
  bolt: 'M13 2 3 14h7l-1 8 11-14h-7l1-6Z',
  grad: 'M22 10 12 5 2 10l10 5 10-5Z M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5',
  briefcase: 'M3 7h18v14H3z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 13h18',
  chart: 'M4 20V10 M10 20V4 M16 20v-6 M22 20H2',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
};

export const AppIcon = ({ name, size = 20, strokeWidth = 2, className = '', style }) => (
  <svg
    className={`app-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <path d={PATHS[name] || PATHS.info} />
  </svg>
);

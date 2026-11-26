import React from 'react';

const PATHS = {
  activity: <><path d="M2 12h4l3-8 5 16 3-8h5" /></>,
  alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v5" /><path d="M12 17.5h.01" /></>,
  ambulance: <><path d="M3 16V7a2 2 0 0 1 2-2h9v11" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7.5" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M6 10h6M9 7v6" /></>,
  arrowLeft: <><path d="M20 12H4M10 6l-6 6 6 6" /></>,
  arrowRight: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  chevronDown: <><path d="m6 9 6 6 6-6" /></>,
  chevronRight: <><path d="m9 6 6 6-6 6" /></>,
  chevronUp: <><path d="m6 15 6-6 6 6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4" /></>,
  crosshair: <><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="2" /></>,
  droplet: <><path d="M12 3s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 20h16" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" /></>,
  eye: <><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  filter: <><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></>,
  gauge: <><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M13.5 10.5 17 7" /><path d="M4.2 18a9 9 0 1 1 15.6 0" /></>,
  flame: <><path d="M12 22c4 0 7-2.8 7-6.5 0-3.7-2.6-5.8-3.1-8.5-1.9 1-2.9 2.8-2.9 4.5-1.7-1-2.7-2.7-2.7-4.5C8.2 9.5 5 12.3 5 15.5 5 19.2 8 22 12 22Z" /></>,
  heart: <><path d="M20.8 8.6c0 4.4-8.8 10-8.8 10s-8.8-5.6-8.8-10a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-7h6v7" /></>,
  logout: <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" /><path d="M15 16l4-4-4-4" /><path d="M9 12h10" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  mapPin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  medical: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M9 7V4h6v3M12 11v6M9 14h6" /></>,
  mountain: <><path d="m2 20 7-12 4 6 2-3 7 9H2Z" /><path d="m7.5 11 1.5 2 2-1" /></>,
  phone: <><path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v5h-5" /></>,
  route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h5a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4h-.2a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 9.2 8 11 4.6-1.8 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  siren: <><path d="M7 17V9a5 5 0 0 1 10 0v8" /><path d="M4 17h16v3H4zM12 2v2M3 6l2 1M21 6l-2 1" /></>,
  storm: <><path d="M6.5 16a4 4 0 0 1 .4-8A5.4 5.4 0 0 1 17 9a3.5 3.5 0 0 1 0 7h-3" /><path d="m12 12-2 4h3l-1 4 4-5h-3l1-3Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.5a3.5 3.5 0 0 1 0 7M17.5 14a6 6 0 0 1 4 6" /></>,
  wind: <><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h8" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>,
  x: <><path d="M6 6 18 18M18 6 6 18" /></>,
  zap: <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></>,
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name] || PATHS.shield}
  </svg>
);

export default Icon;

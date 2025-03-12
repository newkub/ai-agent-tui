# 🧪 EXPERIMENT

<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121212" />
      <stop offset="100%" stop-color="#232323" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <radialGradient id="circle-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#8a42f5" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#6a54c0" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg-gradient)" rx="15" ry="15" />
  <text x="400" y="200" font-family="monospace" font-size="70" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">EXPERIMENT</text>
  <g stroke="#8a42f5" stroke-width="2.5" opacity="0.8">
    <path d="M100,100 L700,300" stroke-dasharray="10,5" />
    <path d="M100,300 L700,100" stroke-dasharray="10,5" />
    <circle cx="400" cy="200" r="150" fill="url(#circle-gradient)" stroke="#a56ef9" />
    <circle cx="400" cy="200" r="100" fill="none" stroke="#6a54c0" stroke-dasharray="5,3" />
    <circle cx="400" cy="200" r="50" fill="none" stroke="#c39aff" />
  </g>
  <g fill="#ffffff" opacity="0.7">
    <circle cx="150" cy="150" r="3" />
    <circle cx="650" cy="250" r="3" />
    <circle cx="250" cy="300" r="3" />
    <circle cx="550" cy="100" r="3" />
  </g>
</svg>

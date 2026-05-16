export default function FloralBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Top-left botanical corner */}
      <svg
        className="absolute -top-2 -left-2 w-56 h-56 opacity-[0.13]"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
        <path d="M50 175 C65 148 92 128 108 105" stroke="#C9A84C" fill="none" strokeWidth="1" />
        <path d="M90 130 C102 108 124 92 140 72" stroke="#C9A84C" fill="none" strokeWidth="0.8" />
        <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
        <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
        <ellipse cx="92" cy="118" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-28 92 118)" />
        <ellipse cx="122" cy="80" rx="13" ry="5" fill="#C9A84C" transform="rotate(-20 122 80)" />
        <ellipse cx="155" cy="45" rx="12" ry="4.5" fill="#C9A84C" transform="rotate(-12 155 45)" />
        <ellipse cx="55" cy="168" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(32 55 168)" opacity="0.7" />
        <ellipse cx="90" cy="140" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(38 90 140)" opacity="0.7" />
        <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
        <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="202" cy="-3" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="202" cy="13" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="108" cy="105" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="101" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
        <circle cx="115" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
        <circle cx="108" cy="112" r="2.5" fill="#D4A88A" opacity="0.4" />
        <circle cx="130" cy="150" r="2" fill="#C9A84C" opacity="0.3" />
        <circle cx="160" cy="110" r="1.5" fill="#C9A84C" opacity="0.25" />
        <circle cx="70" cy="185" r="1.5" fill="#C9A84C" opacity="0.25" />
      </svg>

      {/* Top-right botanical corner (mirrored) */}
      <svg
        className="absolute -top-2 -right-2 w-56 h-56 opacity-[0.13]"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
        <path d="M50 175 C65 148 92 128 108 105" stroke="#C9A84C" fill="none" strokeWidth="1" />
        <path d="M90 130 C102 108 124 92 140 72" stroke="#C9A84C" fill="none" strokeWidth="0.8" />
        <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
        <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
        <ellipse cx="92" cy="118" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-28 92 118)" />
        <ellipse cx="122" cy="80" rx="13" ry="5" fill="#C9A84C" transform="rotate(-20 122 80)" />
        <ellipse cx="155" cy="45" rx="12" ry="4.5" fill="#C9A84C" transform="rotate(-12 155 45)" />
        <ellipse cx="55" cy="168" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(32 55 168)" opacity="0.7" />
        <ellipse cx="90" cy="140" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(38 90 140)" opacity="0.7" />
        <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
        <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="202" cy="-3" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="202" cy="13" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="108" cy="105" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="101" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
        <circle cx="115" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
        <circle cx="108" cy="112" r="2.5" fill="#D4A88A" opacity="0.4" />
      </svg>

      {/* Bottom-left corner (rotated) */}
      <svg
        className="absolute -bottom-2 -left-2 w-48 h-48 opacity-[0.10]"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(180deg) scaleX(-1)' }}
      >
        <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
        <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
        <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
        <ellipse cx="92" cy="118" rx="13" ry="5" fill="#C9A84C" transform="rotate(-28 92 118)" />
        <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
        <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
      </svg>

      {/* Bottom-right corner */}
      <svg
        className="absolute -bottom-2 -right-2 w-48 h-48 opacity-[0.10]"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(180deg)' }}
      >
        <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
        <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
        <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
        <ellipse cx="92" cy="118" rx="13" ry="5" fill="#C9A84C" transform="rotate(-28 92 118)" />
        <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
        <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
      </svg>

      {/* Subtle center gradient bloom */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)' }}
      />
    </div>
  )
}

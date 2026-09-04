import React from "react"

interface LogoProps {
  className?: string
  size?: number
  withWordmark?: boolean
}

/**
 * Agentic Shield — unique brand mark.
 * A faceted shield fused with a thunderbolt (the real-time interceptor),
 * with a keyhole at its heart (the payment lock). Gradient red→crimson
 * to stay in the Razorpay track palette.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  size = 40,
  withWordmark = true,
}) => {
  const gid = "logo-gradient"

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      {/* Unique mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Agentic Shield logo"
      >
        <defs>
          <linearGradient id={gid} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="55%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>

        {/* Shield body */}
        <path
          d="M24 2.5 41 8.5v11.6c0 10.9-6.4 19.5-17 25.4C13.4 39.6 7 31 7 20.1V8.5L24 2.5Z"
          fill={`url(#${gid})`}
        />

        {/* Inner ring / crown detail */}
        <path
          d="M24 7 36.5 11.4v9.7c0 8.6-5 15.6-12.5 20.3C16.5 36.7 11.5 29.7 11.5 21.1v-9.7L24 7Z"
          fill="#00000024"
        />

        {/* Thunderbolt (interceptor) */}
        <path
          d="M26.6 12.8 17.5 27.5h5.9l-2.2 8.7 9.4-14.9h-6l2-8.5Z"
          fill="#ffffff"
          fillOpacity="0.95"
        />

        {/* Keyhole dot — payment lock */}
        <circle cx="24" cy="30.8" r="3.1" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="24" cy="30.1" r="2.1" fill={`url(#${gid})`} />

        {/* Specular highlight */}
        <path
          d="M14 9.5c3.6-1.4 6.8-2 10-2.4v9.2l-6.4-2.4-3.6-4.4Z"
          fill="#ffffff"
          fillOpacity="0.18"
        />
      </svg>

      {/* Wordmark */}
      {withWordmark && (
        <div className="leading-none">
          <span className="font-bold text-white text-sm tracking-tight">
            Agentic Shield
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo

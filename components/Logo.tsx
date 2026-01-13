import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
    const id = React.useId();
    const gradientId = `logo_gradient_${id.replace(/:/g, "")}`;

    return (
        <div className={`relative select-none ${className}`} style={{ width: size, height: size }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                        <stop offset="50%" stopColor="#EA580C" /> {/* Orange-600 */}
                        <stop offset="100%" stopColor="#DB2777" /> {/* Pink-600 */}
                    </linearGradient>
                </defs>

                {/* Outer Frame: Rounded Rectangle */}
                <rect
                    x="10"
                    y="15"
                    width="80"
                    height="70"
                    rx="12"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    fill="none"
                />

                {/* Film Sprochets (Top) */}
                <path d="M25 22h5v8h-5zM47.5 22h5v8h-5zM70 22h5v8h-5z" fill={`url(#${gradientId})`} />

                {/* Film Sprochets (Bottom) */}
                <path d="M25 70h5v8h-5zM47.5 70h5v8h-5zM70 70h5v8h-5z" fill={`url(#${gradientId})`} />

                {/* Center Icon Group */}
                <g transform="translate(50, 50)">
                    {/* Side "Ears" / Reels */}
                    <circle cx="-18" cy="0" r="10" fill={`url(#${gradientId})`} />
                    <circle cx="18" cy="0" r="10" fill={`url(#${gradientId})`} />

                    {/* Main Central Circle */}
                    <circle cx="0" cy="0" r="16" fill={`url(#${gradientId})`} stroke="white" strokeWidth="2" />
                    <circle cx="0" cy="0" r="14" fill={`url(#${gradientId})`} />

                    {/* Play Button Triangle */}
                    <path d="M-3 -7 L 8 0 L -3 7 Z" fill="white" strokeLinejoin="round" />
                </g>
            </svg>
        </div>
    );
};

export default Logo;

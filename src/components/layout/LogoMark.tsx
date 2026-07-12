interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="50,7 93,50 50,93 7,50"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <polygon points="50,28 72,50 50,72 28,50" fill="currentColor" />
    </svg>
  );
}
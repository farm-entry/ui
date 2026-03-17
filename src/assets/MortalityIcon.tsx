import { SvgIcon, SvgIconProps } from "@mui/material";

export default function MortalityIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      {/* Left ear */}
      <ellipse cx="5" cy="10.5" rx="2.5" ry="3.5" transform="rotate(-20 5 10.5)" />
      {/* Right ear */}
      <ellipse cx="14" cy="10.5" rx="2.5" ry="3.5" transform="rotate(20 14 10.5)" />
      {/* Head */}
      <circle cx="9.5" cy="15.5" r="6.5" />
      {/* Snout */}
      <ellipse cx="9.5" cy="19.5" rx="3" ry="2" />
      {/* Nostrils — evenOdd cutouts from snout */}
      <path
        fillRule="evenOdd"
        d="M9.5 17.5a3 2 0 0 1 3 2 3 2 0 0 1-3 2 3 2 0 0 1-3-2 3 2 0 0 1 3-2z
           M8 19.5a.8.8 0 1 0 1.6 0 .8.8 0 0 0-1.6 0z
           M10.4 19.5a.8.8 0 1 0 1.6 0 .8.8 0 0 0-1.6 0z"
      />
      {/* X mark — upper right */}
      <path
        d="M16.5 2.5L22.5 8.5M22.5 2.5L16.5 8.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </SvgIcon>
  );
}

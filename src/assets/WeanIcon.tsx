import { SvgIcon, SvgIconProps } from "@mui/material";

export default function WeanIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      {/* Nipple */}
      <path d="M10 1h4v2.5h-4z" />
      {/* Collar ring */}
      <path d="M7 3.5h10v2H7z" />
      {/* Bottle body — tapered shoulders then wide body with rounded bottom */}
      <path d="M7 5.5L5 9v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9l-2-3.5H7z" />
      {/* Measurement ticks */}
      <path
        d="M9 11h3.5v1H9zm0 3.5h3.5v1H9zm0 3.5h3.5v1H9z"
        fill="currentColor"
        opacity="0.35"
      />
    </SvgIcon>
  );
}

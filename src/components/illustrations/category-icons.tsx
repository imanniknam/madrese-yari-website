import type { SVGProps } from "react";

/**
 * ست آیکون‌های اختصاصی دسته‌بندی‌های مدرسه‌یاری.
 * سبک: خط ضخیم گرد + یک لکهٔ رنگی طلایی به‌عنوان لهجهٔ نور، هم‌راستا با پالت برند.
 */

const base = {
  width: 34,
  height: 34,
  viewBox: "0 0 40 40",
  fill: "none",
} satisfies SVGProps<SVGSVGElement>;

export function BackpackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M13 16c0-4.5 3-7 7-7s7 2.5 7 7" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="9" y="15" width="22" height="19" rx="6" fill="#5586C6" />
      <rect x="9" y="15" width="22" height="19" rx="6" stroke="#112F5C" strokeWidth="2.2" />
      <rect x="15" y="20" width="10" height="6" rx="2" fill="#081729" fillOpacity="0.15" />
      <circle cx="20" cy="10.5" r="2.4" fill="#E2A63A" stroke="#112F5C" strokeWidth="1.6" />
      <path d="M14 34v3M26 34v3" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function BookStackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="24" width="26" height="6" rx="1.5" fill="#E2A63A" stroke="#112F5C" strokeWidth="2" />
      <rect x="9" y="17" width="22" height="6" rx="1.5" fill="#88ABDB" stroke="#112F5C" strokeWidth="2" />
      <rect x="11" y="10" width="18" height="6" rx="1.5" fill="#5586C6" stroke="#112F5C" strokeWidth="2" />
    </svg>
  );
}

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="12" fill="#5586C6" stroke="#112F5C" strokeWidth="2.2" />
      <path
        d="M8 20h24M20 8c3.5 3.3 5.3 7.4 5.3 12S23.5 28.7 20 32c-3.5-3.3-5.3-7.4-5.3-12S16.5 11.3 20 8Z"
        stroke="#081729"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
      <circle cx="27" cy="13" r="2.3" fill="#E2A63A" stroke="#112F5C" strokeWidth="1.4" />
    </svg>
  );
}

export function WhiteboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="9" width="28" height="18" rx="2.5" fill="#F3F6FB" stroke="#112F5C" strokeWidth="2.2" />
      <path d="M12 15h11M12 20h16" stroke="#5586C6" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 27v6M23 27v6M13 33h14" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function FlaskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M17 8h6" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 8v9l-8 13.5A3 3 0 0 0 12.6 35h14.8a3 3 0 0 0 2.6-4.5L22 17V8" fill="#88ABDB" stroke="#112F5C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M13.5 26h13" stroke="#081729" strokeOpacity="0.4" strokeWidth="2" />
      <circle cx="24" cy="22" r="1.6" fill="#E2A63A" />
    </svg>
  );
}

export function SportsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="12" fill="#E2A63A" stroke="#112F5C" strokeWidth="2.2" />
      <path d="M20 10v20M11 15l18 10M29 15 11 25" stroke="#112F5C" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function StationeryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M13 30 27 9.5a2.6 2.6 0 0 1 4.3 2.9L17.5 33H12l1-3Z" fill="#5586C6" stroke="#112F5C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M23.5 13.5 27 16" stroke="#081729" strokeOpacity="0.4" strokeWidth="1.8" />
      <path d="M11 34h18" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ClassroomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="12" width="24" height="14" rx="2" fill="#88ABDB" stroke="#112F5C" strokeWidth="2.2" />
      <path d="M13 26v6M27 26v6M10 34h20" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 17h9" stroke="#081729" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6 33 12.5 20 19 7 12.5 20 6Z" fill="#E2A63A" stroke="#112F5C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M7 12.5V27L20 33.5V19" fill="#88ABDB" stroke="#112F5C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M33 12.5V27L20 33.5V19" fill="#5586C6" stroke="#112F5C" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

export function ChairIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 8v13M28 8v22" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 20h16" stroke="#5586C6" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 20v-2a4 4 0 0 1 4-4h6" stroke="#112F5C" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 27h5" stroke="#112F5C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function SchoolMarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3 21 7.5 12 12 3 7.5 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function CoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="12" fill="#E2A63A" stroke="#112F5C" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="7.5" stroke="#112F5C" strokeOpacity="0.5" strokeWidth="1.6" />
      <path d="M20 15.5v9M17 17.5h5.5a2 2 0 1 1 0 4H17" stroke="#112F5C" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

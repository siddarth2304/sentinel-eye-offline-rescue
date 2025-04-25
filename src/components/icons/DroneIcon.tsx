
import React from "react";

export const DroneIcon = ({ size = 24, color = "currentColor", ...props }: {
  size?: number | string;
  color?: string;
  [key: string]: any;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M14 8h2a2 2 0 0 0 2 -2v-2" />
      <path d="M10 8h-2a2 2 0 0 1 -2 -2v-2" />
      <path d="M14 16h2a2 2 0 0 1 2 2v2" />
      <path d="M10 16h-2a2 2 0 0 0 -2 2v2" />
      <path d="M4 12h4" />
      <path d="M16 12h4" />
    </svg>
  );
};

export default DroneIcon;

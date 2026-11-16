type JibiIconProps = {
  size?: number;
};

export default function JibiIcon({
  size = 48,
}: JibiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 34 Q22 27 30 27 H73 Q80 27 80 35 V75 Q80 82 73 82 H29 Q22 82 22 75Z"
        fill="white"
      />
      <path
        d="M22 39 H75 Q82 39 82 47 V64 H65 Q53 64 53 52 Q53 40 65 40 H22Z"
        fill="#DCEFF0"
      />
      <circle cx="66" cy="52" r="5" fill="#20AFA0" />
      <path
        d="M31 27 V21 Q31 16 37 16 H68 Q74 16 74 22 V27"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
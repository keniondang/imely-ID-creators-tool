type LogoProps = {
  /** pixel size of the icon square; default 28 (h-7/w-7) */
  size?: number;
  /** show the "Imely Creator" wordmark next to the icon */
  withText?: boolean;
  /** wordmark color variant for dark vs light backgrounds */
  variant?: "dark" | "light";
};

export default function Logo({ size = 28, withText = true, variant = "dark" }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/download.png"
        alt="Imely"
        width={size}
        height={size}
        className="rounded-lg object-contain"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="font-extrabold tracking-tight">
          Imely{" "}
          <span className={variant === "light" ? "text-mint" : "text-teal"}>
            Program Kreator
          </span>
        </span>
      )}
    </span>
  );
}
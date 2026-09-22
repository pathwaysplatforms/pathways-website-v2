type RuleProps = {
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
  className?: string;
};

const BASE: Record<string, string> = {
  "horizontal-light": "nx-line w-full",
  "horizontal-dark": "nx-line-dark w-full",
  "vertical-light": "nx-line-v",
  "vertical-dark": "nx-line-v-dark",
};

/**
 * A hairline that fades out at both ends, so a divider inside a rounded
 * surface never collides with the corner radius. The fade has to run along
 * the divider's own axis, which is why vertical is a separate rule rather
 * than the horizontal one rotated.
 */
export function Rule({
  orientation = "horizontal",
  tone = "light",
  className = "",
}: RuleProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`${BASE[`${orientation}-${tone}`]} ${className}`}
    />
  );
}

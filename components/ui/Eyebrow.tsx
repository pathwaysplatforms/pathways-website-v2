type EyebrowProps = {
  children: string;
  /** Rendered as <p> by default; pass an id when it labels a section. */
  id?: string;
  className?: string;
};

/**
 * 12px / 600 / uppercase / 0.12em tracking / dim.
 * Every section on this site opens with one. This is what makes a
 * single-font Swiss layout read as deliberate rather than unstyled.
 */
export function Eyebrow({ children, id, className = "" }: EyebrowProps) {
  return (
    <p id={id} className={`pw-eyebrow ${className}`}>
      {children}
    </p>
  );
}

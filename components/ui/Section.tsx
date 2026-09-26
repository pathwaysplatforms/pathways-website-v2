import type { SectionId } from "@/lib/sections";

/**
 * A landmark section. The id is the nav's scroll target, and the accessible
 * name answers "where am I?" for assistive tech (skill §16, wayfinding).
 */
export function Section({
  id,
  title,
  children,
  className = "",
  bleed = false,
}: {
  id: SectionId;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Skip the standard vertical rhythm — for full-bleed sections. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label={title}
      className={`${bleed ? "" : "py-section"} ${className}`}
    >
      {children}
    </section>
  );
}

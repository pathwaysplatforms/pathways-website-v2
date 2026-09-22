/**
 * The grid, made visible.
 *
 * A fixed, non-interactive layer of column divs with 1px hairline LEFT
 * borders — built from real divs, not a repeating gradient. It shares
 * .pw-shell and .pw-grid with every Section, so the rules it draws land
 * exactly on the columns content is snapped to.
 *
 * Stacking: this sits at z-1 and app/layout.tsx wraps page content at z-2.
 * The lines therefore paint OVER opaque section backgrounds and UNDER all
 * content. A full-bleed accent block covers them, which is intended.
 */
const COLUMNS = Array.from({ length: 12 }, (_, index) => index);

export function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
    >
      <div className="pw-shell pw-grid h-full">
        {COLUMNS.map((index) => (
          <div
            key={index}
            // Below 768px the grid is 4 columns wide; the surplus 8 divs
            // would wrap onto new rows, so they are not rendered there.
            className={`h-full border-l border-pw-hairline ${
              index >= 4 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

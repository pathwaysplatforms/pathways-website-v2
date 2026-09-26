/**
 * Scaffolding marker. Every one of these is a slot to be filled in when we
 * build that section for real — they should all be gone by launch.
 */
export function Placeholder({
  label,
  note,
  className = "",
  minHeight = "10rem",
  children,
}: {
  label: string;
  note?: string;
  className?: string;
  minHeight?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`placeholder flex flex-col items-center justify-center gap-2 p-6 text-center ${className}`}
      style={{ minHeight }}
      data-placeholder={label}
    >
      <span className="t-label">{label}</span>
      {note ? <span className="t-small max-w-[34ch]">{note}</span> : null}
      {children}
    </div>
  );
}

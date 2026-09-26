/** Page gutter + max measure. Everything on the page aligns to this. */
export function Container({
  children,
  className = "",
  width = "page",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "page" | "measure";
}) {
  const max = width === "measure" ? "max-w-measure" : "max-w-page";
  return (
    <div className={`mx-auto w-full ${max} px-gutter ${className}`}>
      {children}
    </div>
  );
}

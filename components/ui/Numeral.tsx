type NumeralProps = {
  /** "01".."05". An index, set as a dateline rather than as a badge. */
  value: string;
  className?: string;
};

/**
 * The specimen index. Mono, small, wide-tracked — it sits beside the label
 * like a plate number, and is deliberately not a circle, badge or chip.
 */
export function Numeral({ value, className = "" }: NumeralProps) {
  return (
    <span aria-hidden="true" className={`ed-label !text-ed-ink ${className}`}>
      {value}
    </span>
  );
}

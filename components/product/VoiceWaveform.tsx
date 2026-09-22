import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import {
  EXAMPLE_PROFILE,
  VOICE_TRANSCRIPT,
  WAVEFORM_ACCENT_INDICES,
  WAVEFORM_BARS,
} from "@/lib/fixtures";

type VoiceWaveformProps = {
  /** Bar heights, 0..1. */
  bars?: readonly number[];
  /** Indices rendered in accent — exactly three. */
  accentIndices?: readonly number[];
  /** Live-transcription line rendered beneath the bars. */
  transcript?: string;
  className?: string;
};

const VIEW_W = 520;
const VIEW_H = 96;
const BAR_W = 8;
/** Even a silent frame keeps a mark on the baseline. */
const MIN_H = 3;
const BASELINE = VIEW_H / 2;

/**
 * One full round trip of .pw-wave-bar: 1100ms `alternate`, so the bar is back
 * where it started after 2200ms.
 */
const CYCLE_MS = 2200;
/**
 * Per-bar phase stride. Prime, and coprime with CYCLE_MS, so `index * STRIDE`
 * modulo the cycle never repeats across a field of this size — the meter
 * reads as thirty independent channels rather than one travelling wave.
 */
const STRIDE_MS = 137;

/** Fixed elapsed figure. Deterministic by contract: never Date, never random. */
const ELAPSED = "00:04";

/**
 * The onboarding capture, mid-sentence and still running.
 *
 * MOTION — zero client JavaScript. The bars are plain square-ended <rect>s
 * sized statically from WAVEFORM_BARS; globals.css scales them on the Y axis
 * with a stepped keyframe, and each one is handed a NEGATIVE animationDelay
 * derived from its index so the field starts mid-cycle instead of ramping up
 * together. Nothing here depends on hydration.
 *
 * REDUCED MOTION — globals.css declares the animation only inside
 * `@media (prefers-reduced-motion: no-preference)`, so there is no animation
 * to cancel: the fixture amplitudes render as-is and the delays are inert.
 * That static frame is the designed image, not a fallback — the accent burst,
 * the hairline baseline, REC and the elapsed figure all still read.
 */
export function VoiceWaveform({
  bars = WAVEFORM_BARS,
  accentIndices = WAVEFORM_ACCENT_INDICES,
  transcript = VOICE_TRANSCRIPT,
  className = "",
}: VoiceWaveformProps) {
  const step = VIEW_W / Math.max(1, bars.length);
  const accent = new Set(accentIndices);

  return (
    <Frame label="Voice capture" note={EXAMPLE_PROFILE} className={className}>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 shrink-0 bg-pw-ink" />
          <MonoLabel>Rec</MonoLabel>
        </span>
        <span className="pw-num text-[12px] text-pw-ink-dim">{ELAPSED}</span>
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mt-4 h-auto w-full"
      >
        {/* Hairline baseline through the centre of the field. Drawn first so
            the bars sit on top of it. */}
        <line
          x1={0}
          y1={BASELINE}
          x2={VIEW_W}
          y2={BASELINE}
          stroke="var(--pw-hairline)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />

        {bars.map((value, index) => {
          const height = Math.max(MIN_H, value * VIEW_H);
          return (
            <rect
              key={index}
              className="pw-wave-bar"
              // Negative: the bar is already partway through its cycle on the
              // first painted frame. Derived from the index — deterministic,
              // so server and client markup are identical.
              style={{
                animationDelay: `-${(index * STRIDE_MS) % CYCLE_MS}ms`,
              }}
              x={index * step + (step - BAR_W) / 2}
              y={BASELINE - height / 2}
              width={BAR_W}
              height={height}
              fill={accent.has(index) ? "var(--pw-accent)" : "var(--pw-ink)"}
            />
          );
        })}
      </svg>

      <div className="mt-5 border-t border-pw-hairline pt-4">
        <MonoLabel as="p" tone="dim">
          Transcript
        </MonoLabel>
        <p className="mt-2 text-[14px] leading-relaxed text-pw-ink">
          {transcript}
          {/* Solid ink block, hard on/off. The blink is declared in
              globals.css under prefers-reduced-motion: no-preference. */}
          <span
            aria-hidden="true"
            className="pw-caret ml-1 inline-block h-[0.95em] w-[0.45em] translate-y-[0.1em] bg-pw-ink"
          />
        </p>
      </div>
    </Frame>
  );
}

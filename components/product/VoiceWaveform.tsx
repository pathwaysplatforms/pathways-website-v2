import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import {
  EXAMPLE_PROFILE,
  VOICE_TRANSCRIPT,
  WAVEFORM_ACCENT_INDICES,
  WAVEFORM_BARS,
} from "@/lib/fixtures";

type VoiceWaveformProps = {
  bars?: readonly number[];
  accentIndices?: readonly number[];
  transcript?: string;
  className?: string;
};

const VIEW_W = 520;
const VIEW_H = 76;
const BAR_W = 2;
/** Even a silent frame keeps a mark on the baseline. */
const MIN_H = 2;
/** One full round trip of the 1500ms alternate keyframe. */
const CYCLE = 3000;
/** Prime, coprime with CYCLE: no two bars in the field share a phase. */
const STRIDE = 137;

/**
 * The capture plate. The meter is drawn as a hairline bar chart sitting on a
 * baseline, not as a lit display — a figure in a document rather than a
 * screen recording.
 *
 * Zero client JavaScript: the motion is a CSS animation with a per-bar phase
 * offset derived from the index, so server and client markup are identical.
 * Under prefers-reduced-motion the animation is never declared and the bars
 * rest at their fixture amplitudes.
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
      <div className="flex items-baseline justify-between gap-4">
        <MonoLabel>Recording</MonoLabel>
        <span className="ed-num text-[13px] text-ed-ink">00:04</span>
      </div>

      <div className="ed-field mt-4 px-4 py-5">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-[76px] w-full"
        >
          {bars.map((value, index) => {
            const height = Math.max(MIN_H, value * VIEW_H);
            const isAccent = accent.has(index);
            return (
              <rect
                key={index}
                className="ed-wave-bar"
                x={index * step + (step - BAR_W) / 2}
                y={VIEW_H - height}
                width={BAR_W}
                height={height}
                fill={isAccent ? "var(--color-ed-signal)" : "var(--color-ed-ink)"}
                opacity={isAccent ? 1 : 0.34}
                style={{ animationDelay: `-${(index * STRIDE) % CYCLE}ms` }}
              />
            );
          })}
          <line
            x1={0}
            y1={VIEW_H}
            x2={VIEW_W}
            y2={VIEW_H}
            stroke="var(--color-ed-rule-strong)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-5">
        <MonoLabel className="block">Transcript</MonoLabel>
        <p className="mt-2 text-[16px] leading-relaxed text-ed-ink-2">
          {transcript}
          <span
            aria-hidden="true"
            className="ed-caret ml-1 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-ed-signal align-baseline"
          />
        </p>
      </div>
    </Frame>
  );
}

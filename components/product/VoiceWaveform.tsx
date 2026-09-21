import {
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
const VIEW_H = 64;
const BAR_W = 3;
/** Even a silent frame keeps a mark on the baseline. */
const MIN_H = 2;

/**
 * The onboarding capture, frozen mid-sentence. Static by contract: no
 * animation, no pulsing, no recording state. Three accent bars, everything
 * else hairline.
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
    <div className={`w-full ${className}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
      >
        {bars.map((value, index) => {
          const height = Math.max(MIN_H, value * VIEW_H);
          return (
            <rect
              key={index}
              x={index * step + (step - BAR_W) / 2}
              y={(VIEW_H - height) / 2}
              width={BAR_W}
              height={height}
              rx={BAR_W / 2}
              fill={
                accent.has(index) ? "var(--pw-accent)" : "var(--pw-hairline)"
              }
            />
          );
        })}
      </svg>

      <p className="pw-body mt-4 text-[13px] leading-relaxed">{transcript}</p>
    </div>
  );
}

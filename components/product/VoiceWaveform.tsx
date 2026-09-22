import { Mic } from "lucide-react";

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
const VIEW_H = 92;
const BAR_W = 6;
/** Even a silent frame keeps a mark on the baseline. */
const MIN_H = 3;
/** One full round trip of the 1400ms alternate keyframe. */
const CYCLE = 2800;
/** Prime, coprime with CYCLE: no two bars in the field share a phase. */
const STRIDE = 137;

/**
 * The onboarding capture, as a piece of recording hardware: a lit meter sunk
 * into the enclosure, a record lamp, a running time, and the transcript on
 * paper beneath with a live caret.
 *
 * Zero client JavaScript — the motion is a CSS animation with a per-bar phase
 * offset derived from the index, so the server and client markup are
 * identical. Under prefers-reduced-motion the animation is never declared and
 * the bars rest at their fixture amplitudes.
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
    <Frame
      label="Voice capture"
      note={EXAMPLE_PROFILE}
      dot="accent"
      className={className}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <Mic size={14} strokeWidth={2.5} aria-hidden="true" className="text-nx-ink-faint" />
          <MonoLabel tone="dim">Recording</MonoLabel>
        </span>
        <span className="nx-readout text-[13px] text-nx-ink-soft">00:04</span>
      </div>

      {/* The meter, sunk into the face. */}
      <div className="nx-well-dark mt-3 px-4 py-3">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
        >
          {/* Centre line, as etched on a scope. */}
          <line
            x1={0}
            y1={VIEW_H / 2}
            x2={VIEW_W}
            y2={VIEW_H / 2}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
          {bars.map((value, index) => {
            const height = Math.max(MIN_H, value * VIEW_H);
            const isAccent = accent.has(index);
            return (
              <rect
                key={index}
                className="nx-wave-bar"
                x={index * step + (step - BAR_W) / 2}
                y={(VIEW_H - height) / 2}
                width={BAR_W}
                height={height}
                rx={3}
                fill={isAccent ? "#7AA2FF" : "rgba(174,198,255,0.32)"}
                style={{
                  animationDelay: `-${(index * STRIDE) % CYCLE}ms`,
                  filter: isAccent
                    ? "drop-shadow(0 0 7px rgba(122,162,255,0.85))"
                    : undefined,
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4">
        <MonoLabel tone="dim">Transcript</MonoLabel>
        <p className="mt-2 text-[14.5px] leading-relaxed text-nx-ink-soft">
          {transcript}
          <span
            aria-hidden="true"
            className="nx-caret ml-1 inline-block h-[1em] w-[0.42em] translate-y-[0.14em] rounded-[1px] bg-nx-accent align-baseline"
          />
        </p>
      </div>
    </Frame>
  );
}

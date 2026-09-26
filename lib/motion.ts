/**
 * Spring presets — Apple's (damping, response) mapped onto Motion's
 * (bounce, duration). See .claude/skills/apple-design/SKILL.md §4.
 *
 * damping 1.0 (critically damped, no overshoot)  -> bounce 0
 * damping ~0.8 (momentum, slight overshoot)      -> bounce ~0.2
 *
 * `duration` here is Apple's *response* — how quickly the value reaches
 * the target — not a fixed playback length. A spring has no duration.
 */

export type Spring = {
  type: "spring";
  bounce: number;
  duration: number;
};

/** Default for anything a user can touch. damping 1.0, response 0.4. */
export const springDefault: Spring = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

/** Snappier critically-damped spring for press feedback. response 0.25. */
export const springPress: Spring = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

/** Only after a gesture carried momentum — a flick, a throw, a drag release. */
export const springMomentum: Spring = {
  type: "spring",
  bounce: 0.2,
  duration: 0.4,
};

/** Drawer / sheet. Apple ships damping 0.8, response 0.3. */
export const springSheet: Spring = {
  type: "spring",
  bounce: 0.2,
  duration: 0.3,
};

/**
 * Apple's momentum projection from the Designing Fluid Interfaces sample
 * code (§6). Exponential decay — NOT the textbook v^2/(2a).
 *
 * @param velocity px/s at release
 * @param decelerationRate 0.998 for normal scroll feel, 0.99 for snappier
 * @returns distance the gesture is still "going" past the release point
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary instead of a hard stop (§9). */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
): number {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

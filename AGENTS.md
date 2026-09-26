<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design reference

`.claude/skills/apple-design/SKILL.md` is the design authority for this project. Read it before writing or reviewing any UI — components, CSS, motion, layout, type — not only when a task sounds animation-related. It governs every build from here on.

It is not advisory. Where it states a value, that value is the default and a deviation needs a stated reason:

- Springs, not CSS transitions or `@keyframes`, for anything a user can touch or interrupt. `damping 1.0` by default; bounce (`~0.8`) only after a gesture carried momentum.
- Feedback on pointer-*down* and continuous through the gesture — never only on release.
- Animate from the live presentation value so motion can be grabbed and reversed mid-flight.
- Animate `transform` and `opacity` only.
- Enter and exit along the same path; anchor `transform-origin` to the trigger.
- Size-specific tracking (tighten large text toward `-0.02em`, body near `0`); leading tight on display, looser on body. Spacing in `rem`/`em`, never fixed px.
- Translucent chrome via `backdrop-filter` with content scrolling under; never stack two light translucent surfaces.
- Honor `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast` in every component that animates or uses translucency.

The eight foundations in §16 (purpose, agency, responsibility, familiarity, flexibility, simplicity, craft, delight) are the vocabulary for design decisions — use those names when explaining a choice.

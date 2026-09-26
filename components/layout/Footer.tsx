import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NAV_SECTIONS } from "@/lib/sections";

/**
 * SKELETON — contact form and the legal shelf. The form is not wired to
 * anything yet; the legal pages do not exist yet either.
 */
export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <Container className="grid gap-12 py-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* Contact */}
        <div>
          <h2 className="t-heading text-ink">Get in touch</h2>
          <p className="t-body mt-3 max-w-[40ch] text-ink-muted">
            {/* PLACEHOLDER copy */}
            One line on who should write to us and what to expect back.
          </p>

          <form className="mt-7 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="contact-name" label="Name" type="text" placeholder="Your name" />
              <Field
                id="contact-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder="How can we help?"
              className="t-body resize-y rounded-card border border-hairline bg-surface px-4 py-3 text-ink placeholder:text-ink-faint"
            />
            <div className="flex items-center gap-4">
              <Button type="submit" variant="secondary">
                Send
              </Button>
              <span className="t-small text-ink-faint">
                Placeholder — not wired up yet.
              </span>
            </div>
          </form>
        </div>

        {/* Shelf */}
        <div className="grid gap-10 sm:grid-cols-2 lg:justify-items-end">
          <nav aria-label="Sections">
            <h2 className="t-label text-ink-faint">Sections</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="t-small text-ink-muted no-underline hover:text-ink"
                  >
                    {s.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="t-label text-ink-faint">Legal</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                ["Privacy policy", "/legal/privacy"],
                ["Terms of use", "/legal/terms"],
                ["Disclaimer", "/legal/disclaimer"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="t-small text-ink-muted no-underline hover:text-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="t-small mt-4 max-w-[26ch] text-ink-faint">
              Placeholder — these pages are not built yet.
            </p>
          </nav>
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-7">
        <p className="t-small text-ink-faint">
          © {new Date().getFullYear()} Pathways
        </p>
        <p className="t-small text-ink-faint">
          Guidance only — not legal advice.
        </p>
      </Container>
    </footer>
  );
}

function Field({
  id,
  label,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="t-body w-full rounded-pill border border-hairline bg-surface px-5 py-3 text-ink placeholder:text-ink-faint"
      />
    </div>
  );
}

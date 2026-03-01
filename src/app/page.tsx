import Link from "next/link";

const FEATURES = [
  {
    icon: "✎",
    title: "Sketch to Email",
    description:
      "Draw your email layout on a touch-enabled canvas. Our intelligent engine analyzes your sketch and converts it into structured HTML email blocks.",
  },
  {
    icon: "⊞",
    title: "Drag & Drop Builder",
    description:
      "Build pixel-perfect emails with 14+ draggable modules — headers, footers, text, images, buttons, GIFs, videos, timers, and more.",
  },
  {
    icon: "</>",
    title: "Email-Safe HTML",
    description:
      "Generate table-based HTML that works across Gmail, Outlook, Apple Mail, and every major email client. Copy, download, or export in one click.",
  },
  {
    icon: "◉",
    title: "Responsive Preview",
    description:
      "Instantly preview your design on desktop and mobile viewports. Toggle between visual preview and raw HTML code side-by-side.",
  },
];

const ELEMENTS = [
  "Email Headers",
  "Headings",
  "Text",
  "Images",
  "Buttons",
  "Dividers",
  "Spacers",
  "Videos",
  "GIFs",
  "Countdown Timers",
  "Social Links",
  "Multi-Column Layouts",
  "Custom HTML",
  "Email Footers",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mk-surface">
      {/* Nav */}
      <nav className="border-b border-mk-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--mk-primary)] to-[var(--mk-accent)] flex items-center justify-center">
              <span className="text-xs font-bold text-white">M</span>
            </div>
            <span className="text-lg font-bold text-mk-text tracking-tight">
              markuply
            </span>
          </div>
          <Link
            href="/builder"
            className="rounded-xl bg-mk-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-mk-primary-hover transition-colors shadow-sm"
          >
            Open Builder
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mk-primary-200 bg-mk-primary-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-mk-primary animate-pulse" />
          <span className="text-xs font-medium text-mk-primary">
            Sketch &bull; Build &bull; Export
          </span>
        </div>

        <h2 className="text-5xl font-extrabold tracking-tight text-mk-text sm:text-6xl">
          Design emails by{" "}
          <span className="bg-gradient-to-r from-[var(--mk-primary)] to-[var(--mk-accent)] bg-clip-text text-transparent">
            building
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-mk-text-secondary leading-relaxed">
          The most creative drag-and-drop email HTML builder. Sketch your layout,
          drag blocks, customize every detail, and export production-ready
          HTML &mdash; all in one place.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/builder"
            className="rounded-xl bg-mk-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-mk-primary-hover transition-all shadow-lg"
          >
            Start Building
          </Link>
          <Link
            href="/builder"
            className="rounded-xl border border-mk-border bg-mk-surface px-8 py-3.5 text-base font-semibold text-mk-text hover:bg-mk-primary-50 hover:border-mk-primary/30 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-mk-border bg-mk-bg py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold text-mk-text">
            Everything you need to build emails
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-mk-border bg-mk-surface p-6 transition-all hover:shadow-lg hover:border-mk-primary/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mk-primary-50 text-xl">
                  {feature.icon}
                </div>
                <h4 className="mb-2 text-base font-semibold text-mk-text">
                  {feature.title}
                </h4>
                <p className="text-sm text-mk-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Element showcase */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="mb-4 text-3xl font-bold text-mk-text">
            14+ Email Building Blocks
          </h3>
          <p className="mb-10 text-mk-text-secondary">
            Every element you need to craft beautiful, responsive emails.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ELEMENTS.map((el) => (
              <span
                key={el}
                className="rounded-full border border-mk-border bg-mk-surface px-4 py-2 text-sm font-medium text-mk-text shadow-sm hover:border-mk-primary/40 hover:text-mk-primary transition-colors"
              >
                {el}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-mk-border bg-mk-bg py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold text-mk-text">
            How it works
          </h3>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sketch or Build",
                desc: "Draw your email layout on the canvas, or use the drag-and-drop builder to assemble blocks.",
              },
              {
                step: "2",
                title: "Customize",
                desc: "Edit text inline, adjust colors, fonts, spacing, and element properties with the visual editor.",
              },
              {
                step: "3",
                title: "Export HTML",
                desc: "Preview on desktop and mobile, then copy or download email-safe HTML ready for any ESP.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--mk-primary)] to-[var(--mk-accent)] text-lg font-bold text-white">
                  {item.step}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-mk-text">
                  {item.title}
                </h4>
                <p className="text-sm text-mk-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h3 className="text-3xl font-bold text-mk-text">
            Ready to build your next email?
          </h3>
          <p className="mt-3 text-mk-text-secondary">
            No signup required. Start designing in seconds.
          </p>
          <Link
            href="/builder"
            className="mt-8 inline-block rounded-xl bg-mk-primary px-10 py-4 text-base font-semibold text-white hover:bg-mk-primary-hover transition-all shadow-lg"
          >
            Launch Markuply
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mk-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-mk-text-muted">
          markuply &mdash; The Creative Email HTML Builder
        </div>
      </footer>
    </div>
  );
}

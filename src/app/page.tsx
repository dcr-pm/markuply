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
      "Build pixel-perfect emails with 12+ draggable modules — text, images, buttons, GIFs, videos, countdown timers, social links, and more.",
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
      "Instantly preview your design on desktop and mobile viewports. Toggle between visual preview and raw HTML code.",
  },
];

const ELEMENTS = [
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
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-indigo-600">Markup</span>ly
          </h1>
          <Link
            href="/builder"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Open Builder
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-medium text-indigo-700">
            Sketch &bull; Build &bull; Export
          </span>
        </div>

        <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Design emails by{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            sketching
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
          Whiteboard your email layout on any device, then watch it transform
          into production-ready HTML. Or use the drag-and-drop builder with 12+
          content blocks &mdash; images, GIFs, videos, countdown timers, and more.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/builder"
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Building
          </Link>
          <Link
            href="/builder"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try the Sketch Canvas
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything you need to build emails
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  {feature.icon}
                </div>
                <h4 className="mb-2 text-base font-semibold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
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
          <h3 className="mb-4 text-3xl font-bold text-gray-900">
            12+ Email Building Blocks
          </h3>
          <p className="mb-10 text-gray-600">
            Every element you need to craft beautiful, responsive emails.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ELEMENTS.map((el) => (
              <span
                key={el}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                {el}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-900">
            Ready to build your next email?
          </h3>
          <p className="mt-3 text-gray-600">
            No signup required. Start designing in seconds.
          </p>
          <Link
            href="/builder"
            className="mt-8 inline-block rounded-xl bg-indigo-600 px-10 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Launch Markuply
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-400">
          Markuply &mdash; Sketch to Email HTML Builder
        </div>
      </footer>
    </div>
  );
}

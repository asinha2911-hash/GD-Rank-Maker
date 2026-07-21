import { AmethystBanner } from "@/components/amethyst-banner"

const CODE = `export function AmethystBanner() {
  return (
    <div style={{
      position: "relative",
      aspectRatio: "234 / 60",
      background: \`
        radial-gradient(ellipse 55% 90% at 50% 45%, rgba(150,70,220,.55), transparent 70%),
        radial-gradient(circle at 50% 40%, rgba(200,150,255,.35), transparent 45%),
        radial-gradient(ellipse 120% 120% at 50% 50%, #1a0a2e 20%, #08040f 80%)
      \`,
    }}>
      {/* twinkling star field + four-point sparkles */}
      <h1 style={{
        fontFamily: "Georgia, serif",
        fontWeight: 700,
        background: "linear-gradient(180deg,#fff 0%,#b9a9d0 48%,#6f5f90 52%,#fff 100%)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        textShadow: "0 0 18px rgba(180,130,255,.8)",
      }}>
        AMETHYST
      </h1>
    </div>
  )
}`

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-balance">AMETHYST banner recreation</h1>
          <p className="text-sm text-neutral-400">A pure-CSS rendition of the cosmic galaxy banner.</p>
        </header>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">Original</span>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EIzB0NT4ui33Lpg51jkh9yqLpErRyL.png"
            alt="Original AMETHYST cosmic banner"
            className="w-full rounded border border-neutral-800"
          />
        </section>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">My rendition</span>
          <AmethystBanner />
        </section>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">Code</span>
          <pre className="overflow-x-auto rounded border border-neutral-800 bg-neutral-900 p-4 text-xs leading-relaxed text-neutral-300">
            <code>{CODE}</code>
          </pre>
        </section>
      </div>
    </main>
  )
}

import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🌤️',
    title: 'Mood Tracking',
    desc: 'Check in with yourself daily. No pressure, no judgment — just a gentle moment of self-awareness.',
    color: 'bg-blue-light/40',
    border: 'border-blue-soft/40',
    hoverBorder: 'hover:border-blue-soft',
  },
  {
    icon: '💬',
    title: 'AI Companion',
    desc: "Talk to someone who's always available. Warm, empathetic responses whenever you need them.",
    color: 'bg-lavender-light/40',
    border: 'border-lavender/40',
    hoverBorder: 'hover:border-lavender',
  },
  {
    icon: '🧘',
    title: 'Mental Gym',
    desc: 'Small, science-backed exercises for your mind. Breathing, gratitude, and gentle reframes.',
    color: 'bg-green-light/40',
    border: 'border-green-muted/40',
    hoverBorder: 'hover:border-green-muted',
  },
]

const TESTIMONIALS = [
  { text: 'This space helped me realize I wasn\'t alone in feeling overwhelmed.', name: 'Anon Student', mood: '😌' },
  { text: 'The breathing exercise actually helped me get through my exam panic.', name: 'Anon Student', mood: '💙' },
  { text: 'Venting here felt safer than anywhere else.', name: 'Anon Student', mood: '🌱' },
]

export default function Landing() {
  return (
    <div className="mesh-bg min-h-screen">
      <div className="orb w-96 h-96 bg-blue-soft top-20 -left-24 pointer-events-none" style={{position:'fixed'}} />
      <div className="orb w-80 h-80 bg-lavender top-40 right-0 pointer-events-none" style={{position:'fixed'}} />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-light/50 text-sage text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-green-muted/30 animate-fade-in anim-fill">
            <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
            Safe · Anonymous · Stigma-free
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.1] text-stone-700 mb-6 animate-fade-up anim-fill">
            You don't have to<br />
            <span className="italic text-blue-dark">carry it alone.</span>
          </h1>

          <p className="text-stone-muted text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto animate-fade-up delay-200 anim-fill">
            MindMate is your personal space to feel, reflect, and breathe — without judgment, without pressure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300 anim-fill">
            <Link
              to="/mood"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-soft to-blue-dark hover:from-blue-dark hover:to-blue-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              Check your mood ✦
            </Link>
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/70 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-blue-soft/40 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              Talk to someone
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-stone-muted animate-fade-up delay-500 anim-fill">
            <div className="text-center">
              <div className="font-display text-2xl text-stone-700 font-semibold">100%</div>
              <div>Anonymous</div>
            </div>
            <div className="w-px h-10 bg-blue-soft/30" />
            <div className="text-center">
              <div className="font-display text-2xl text-stone-700 font-semibold">24/7</div>
              <div>Available</div>
            </div>
            <div className="w-px h-10 bg-blue-soft/30" />
            <div className="text-center">
              <div className="font-display text-2xl text-stone-700 font-semibold">Free</div>
              <div>Always</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-px h-10 bg-gradient-to-b from-blue-soft/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-stone-700 mb-3">Everything you need</h2>
            <p className="text-stone-muted">Simple tools, meaningful impact</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`${f.color} border ${f.border} ${f.hoverBorder} rounded-3xl p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 group`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">{f.icon}</div>
                <h3 className="font-semibold text-stone-700 text-lg mb-2">{f.title}</h3>
                <p className="text-stone-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vent CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-lavender/20 to-lavender-light/10 border border-lavender/30 rounded-4xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="orb w-64 h-64 bg-lavender -top-16 -right-16" style={{position:'absolute'}} />
            <div className="relative z-10">
              <p className="text-lavender-dark text-sm font-semibold uppercase tracking-widest mb-3">Anonymous Venting</p>
              <h2 className="font-display text-3xl text-stone-700 mb-4">Some things just need to be said</h2>
              <p className="text-stone-muted mb-6 max-w-md mx-auto">Write it out. Release it. No names, no judgment — just space to breathe.</p>
              <Link to="/vent" className="inline-block px-6 py-3 bg-gradient-to-r from-lavender to-lavender-dark hover:from-lavender-dark hover:to-lavender-dark text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-soft">
                Start venting →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-center text-stone-700 mb-10">From the community</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass rounded-3xl p-5 border border-white/60 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                <p className="text-2xl mb-3">{t.mood}</p>
                <p className="text-stone-700 text-sm leading-relaxed italic mb-3">"{t.text}"</p>
                <p className="text-stone-muted text-xs">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis resources */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-3xl p-6 border border-blue-soft/30 shadow-card text-center">
            <p className="text-sm font-semibold text-stone-700 mb-2">Need immediate support?</p>
            <p className="text-xs text-stone-muted leading-relaxed">
              iCall: <span className="font-semibold text-blue-dark">9152987821</span> · Vandrevala Foundation: <span className="font-semibold text-blue-dark">1860-2662-345</span>
            </p>
            <p className="text-xs text-stone-muted mt-1 opacity-70">Available 24/7, free and confidential</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-4xl mb-4 animate-float inline-block">🌿</div>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-700 mb-4">Ready to feel lighter?</h2>
          <p className="text-stone-muted mb-8">It starts with one step. No sign-up, no judgment.</p>
          <Link
            to="/mood"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-soft to-blue-dark hover:from-blue-dark hover:to-blue-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-lg"
          >
            Begin your check-in ✦
          </Link>
        </div>
      </section>
    </div>
  )
}

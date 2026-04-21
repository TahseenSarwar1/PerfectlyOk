import { useState } from 'react'

const CATEGORIES = [
  { id: 'anxiety',  label: 'Anxiety',         emoji: '🌀', color: 'data-[active=true]:bg-lavender/30 data-[active=true]:border-lavender hover:bg-lavender/20' },
  { id: 'lonely',   label: 'Loneliness',       emoji: '🌙', color: 'data-[active=true]:bg-blue-light/50 data-[active=true]:border-blue-soft hover:bg-blue-light/30' },
  { id: 'academic', label: 'Academic Stress',  emoji: '📚', color: 'data-[active=true]:bg-green-light/50 data-[active=true]:border-green-muted hover:bg-green-light/30' },
  { id: 'relation', label: 'Relationships',    emoji: '💔', color: 'data-[active=true]:bg-lavender-light/50 data-[active=true]:border-lavender-dark hover:bg-lavender-light/30' },
  { id: 'self',     label: 'Self-doubt',       emoji: '🪞', color: 'data-[active=true]:bg-beige-dark/60 data-[active=true]:border-stone-muted hover:bg-beige-dark/40' },
  { id: 'other',    label: 'Something else',   emoji: '✨', color: 'data-[active=true]:bg-green-light/40 data-[active=true]:border-sage hover:bg-green-light/20' },
]

const SAMPLE_POSTS = [
  { emoji: '🌀', category: 'Anxiety', time: '2h ago', text: "I keep catastrophizing about everything lately. Even small tasks feel impossible. I know it's not rational but I can't stop the spiral." },
  { emoji: '📚', category: 'Academic Stress', time: '5h ago', text: "Three exams in four days and I feel like I'm falling behind everyone else. Is it normal to feel this overwhelmed all the time?" },
  { emoji: '🌙', category: 'Loneliness', time: '1d ago', text: "I'm surrounded by people on campus but I feel completely invisible. No one really knows me and I don't know how to change that." },
  { emoji: '💔', category: 'Relationships', time: '2d ago', text: "My best friend and I grew apart after coming to university. I miss them more than I expected and don't know how to reconnect." },
]

export default function Vent() {
  const [category, setCategory] = useState(null)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!text.trim() || !category) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mesh-bg min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md mx-auto text-center animate-bounce-in anim-fill">
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="font-display text-3xl text-stone-700 mb-4">That took courage.</h2>
          <p className="text-stone-muted leading-relaxed mb-8">
            You put words to something real. That's the first step. Your words have been released into the world anonymously — you're not alone in feeling this way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setText(''); setCategory(null) }}
              className="px-6 py-2.5 bg-blue-soft hover:bg-blue-dark text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-soft text-sm"
            >
              Vent again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mesh-bg min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-up anim-fill">
          <span className="text-4xl inline-block mb-3 animate-float">📝</span>
          <h1 className="font-display text-4xl text-stone-700 mb-3">Get it out.</h1>
          <p className="text-stone-muted">Completely anonymous. No accounts, no judgment. Just space to breathe.</p>
        </div>

        {/* Category selector */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-card mb-5 animate-fade-up delay-100 anim-fill">
          <p className="text-stone-700 font-medium mb-4 text-sm">What's weighing on you?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                data-active={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 border-transparent text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 ${c.color}`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-card mb-5 animate-fade-up delay-200 anim-fill">
          <label className="text-stone-700 font-medium text-sm block mb-3">
            Write freely. No one is watching. ✨
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind? It can be a single word, a paragraph, or everything in between. This is your space..."
            rows={6}
            className="w-full bg-beige-dark/30 border border-blue-soft/20 rounded-2xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/40 resize-none leading-relaxed transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-stone-muted">{text.length > 0 ? `${text.length} characters` : 'Start typing when you&apos;re ready'}</p>
            <p className="text-xs text-stone-muted italic">Always anonymous 🔒</p>
          </div>
        </div>

        <div className="text-center animate-fade-up delay-300 anim-fill">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || !category}
            className="px-8 py-3.5 bg-lavender hover:bg-lavender-dark disabled:bg-beige-dark disabled:text-stone-muted text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Release it into the world ✦
          </button>
          {(!text.trim() || !category) && (
            <p className="text-xs text-stone-muted mt-2">Select a category and write something first</p>
          )}
        </div>

        {/* Community board */}
        <div className="mt-16 animate-fade-up delay-400 anim-fill">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-blue-soft/20" />
            <p className="text-sm text-stone-muted font-medium">From the community</p>
            <div className="flex-1 h-px bg-blue-soft/20" />
          </div>
          <p className="text-center text-xs text-stone-muted mb-5 italic">You're not the only one feeling this way ❤️</p>
          <div className="flex flex-col gap-4">
            {SAMPLE_POSTS.map((post, i) => (
              <div key={i} className="glass rounded-3xl p-5 border border-white/60 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-3">
                  <span>{post.emoji}</span>
                  <span className="text-xs font-medium text-stone-muted bg-beige-dark/50 px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-stone-muted ml-auto">{post.time}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{post.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

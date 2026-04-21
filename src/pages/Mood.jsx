import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOODS = [
  {
    emoji: '😄', label: 'Great', value: 'great',
    color: 'hover:bg-green-light/60 data-[selected=true]:bg-green-light/80 data-[selected=true]:border-green-muted',
    response: {
      title: "That's wonderful to hear ✨",
      message: "Hold onto this feeling. You're doing something right — even if you can't see it yet. What made today feel good?",
      suggestion: 'Visit the Gym to build on this positive energy',
      to: '/gym',
      cta: 'Go to Mental Gym',
    },
  },
  {
    emoji: '😊', label: 'Good', value: 'good',
    color: 'hover:bg-blue-light/60 data-[selected=true]:bg-blue-light/80 data-[selected=true]:border-blue-soft',
    response: {
      title: "Good days are worth celebrating 🌤️",
      message: "You're in a good place right now, and that matters. Take a moment to notice it.",
      suggestion: 'Write a quick gratitude note',
      to: '/gym',
      cta: 'Try Gratitude Journaling',
    },
  },
  {
    emoji: '😐', label: 'Okay', value: 'neutral',
    color: 'hover:bg-beige-dark/60 data-[selected=true]:bg-beige-dark/80 data-[selected=true]:border-stone-muted',
    response: {
      title: "Okay is perfectly okay 🌿",
      message: "Not every day has to sparkle. Feeling neutral means you're present, and that's enough.",
      suggestion: 'Sometimes a gentle breathing exercise helps shift things',
      to: '/gym',
      cta: 'Try Breathing Exercise',
    },
  },
  {
    emoji: '😔', label: 'Low', value: 'low',
    color: 'hover:bg-lavender-light/60 data-[selected=true]:bg-lavender-light/80 data-[selected=true]:border-lavender',
    response: {
      title: "You're allowed to feel this way 💜",
      message: "Low days are part of being human. You're not broken — you're just feeling something real. We're here for you.",
      suggestion: 'Talking often helps more than we expect',
      to: '/chat',
      cta: 'Talk to someone',
    },
  },
  {
    emoji: '😣', label: 'Tough', value: 'tough',
    color: 'hover:bg-lavender-light/60 data-[selected=true]:bg-lavender/30 data-[selected=true]:border-lavender-dark',
    response: {
      title: "Thank you for being honest 💙",
      message: "Tough days are real. You're not alone in this, and it's brave to acknowledge how you feel. Please be gentle with yourself today.",
      suggestion: 'Writing your feelings down can release some weight',
      to: '/vent',
      cta: 'Write it out',
    },
  },
]

export default function Mood() {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const mood = MOODS.find(m => m.value === selected)

  const handleSelect = (v) => {
    setSelected(v)
    setSubmitted(false)
  }

  return (
    <div className="mesh-bg min-h-screen px-4 py-16">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-12 animate-fade-up anim-fill">
          <span className="inline-block text-5xl mb-4 animate-float">☁️</span>
          <h1 className="font-display text-4xl text-stone-700 mb-3">How are you feeling today?</h1>
          <p className="text-stone-muted">No right or wrong answer. Just be honest with yourself.</p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-5 mb-10 flex-wrap animate-fade-up delay-200 anim-fill">
          {MOODS.map((m) => (
            <button
              key={m.value}
              data-selected={selected === m.value}
              onClick={() => handleSelect(m.value)}
              className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-3xl border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-soft ${m.color}`}
            >
              <span className="text-4xl sm:text-5xl leading-none select-none transition-transform duration-200 hover:scale-110">
                {m.emoji}
              </span>
              <span className="text-xs sm:text-sm text-stone-muted font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        {selected && !submitted && (
          <div className="text-center animate-bounce-in anim-fill">
            <button
              onClick={() => setSubmitted(true)}
              className="px-8 py-3.5 bg-blue-soft hover:bg-blue-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-0.5"
            >
              That's how I feel ✦
            </button>
          </div>
        )}

        {submitted && mood && (
          <div className="animate-bounce-in anim-fill">
            <div className="glass rounded-4xl p-8 border border-white/60 shadow-float text-center">
              <div className="text-4xl mb-4">{mood.emoji}</div>
              <h2 className="font-display text-2xl text-stone-700 mb-3">{mood.response.title}</h2>
              <p className="text-stone-muted leading-relaxed mb-6">{mood.response.message}</p>

              <div className="bg-blue-light/30 rounded-2xl p-4 mb-6 text-sm text-stone-700 border border-blue-soft/20">
                <span className="text-blue-dark font-medium">Gentle suggestion: </span>
                {mood.response.suggestion}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={mood.response.to}
                  className="px-6 py-2.5 bg-blue-soft hover:bg-blue-dark text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-soft text-sm"
                >
                  {mood.response.cta}
                </Link>
                <button
                  onClick={() => { setSelected(null); setSubmitted(false) }}
                  className="px-6 py-2.5 bg-white/60 hover:bg-white text-stone-700 font-medium rounded-2xl border border-blue-soft/30 transition-all duration-300 text-sm"
                >
                  Check in again
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-stone-muted mt-4 italic">
              It's okay to feel this way. You're not alone. 🌿
            </p>
          </div>
        )}

        {!selected && (
          <p className="text-center text-sm text-stone-muted mt-8 animate-fade-in anim-fill italic">
            Tap on any emoji to check in with yourself
          </p>
        )}
      </div>
    </div>
  )
}

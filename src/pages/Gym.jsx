import { useState } from 'react'

const EXERCISES = [
  {
    id: 'breathing',
    emoji: '🌬️',
    title: 'Box Breathing',
    subtitle: 'Calm your nervous system in 4 minutes',
    color: 'bg-blue-light/40 border-blue-soft/40',
    badge: 'bg-blue-soft/20 text-blue-dark',
    badgeText: '4 min',
    description: 'Box breathing is used by Navy SEALs and therapists alike to reduce anxiety fast.',
    modal: {
      type: 'breathing',
      steps: ['Inhale slowly', 'Hold your breath', 'Exhale slowly', 'Hold empty'],
      duration: 4,
      tip: 'Try this before a presentation, exam, or when anxiety spikes.',
    },
  },
  {
    id: 'gratitude',
    emoji: '🌸',
    title: 'Gratitude Journal',
    subtitle: 'Rewire your brain toward the good',
    color: 'bg-green-light/40 border-green-muted/40',
    badge: 'bg-green-muted/20 text-sage',
    badgeText: '5 min',
    description: 'Research shows that writing 3 specific things you appreciate rewires neural pathways over time.',
    modal: {
      type: 'journal',
      prompts: [
        'One small thing that went well today...',
        'Someone who made me feel seen, even briefly...',
        'Something about myself I can appreciate right now...',
      ],
      tip: 'Be specific. Not "family" but "the way my friend texted to check on me."',
    },
  },
  {
    id: 'reframe',
    emoji: '🪴',
    title: 'Positive Reframing',
    subtitle: 'Gently challenge unhelpful thoughts',
    color: 'bg-lavender-light/40 border-lavender/40',
    badge: 'bg-lavender/20 text-lavender-dark',
    badgeText: '6 min',
    description: 'CBT-inspired technique to recognize cognitive distortions and find more balanced perspectives.',
    modal: {
      type: 'reframe',
      steps: [
        { q: 'What is the thought bothering you?', placeholder: "e.g., I'm going to fail this exam" },
        { q: 'What evidence supports this thought?', placeholder: 'Be honest, but specific...' },
        { q: 'What evidence challenges this thought?', placeholder: 'What would you tell a friend?' },
        { q: 'What is a more balanced way to see this?', placeholder: 'A kinder, realistic perspective...' },
      ],
      tip: 'You don\'t have to feel positive. You just need a slightly less extreme view.',
    },
  },
  {
    id: 'grounding',
    emoji: '🌿',
    title: '5-4-3-2-1 Grounding',
    subtitle: 'Come back to the present moment',
    color: 'bg-beige-dark/50 border-stone-muted/20',
    badge: 'bg-stone-muted/20 text-stone-warm',
    badgeText: '3 min',
    description: 'A sensory technique to interrupt anxious thoughts and anchor yourself in the now.',
    modal: {
      type: 'grounding',
      steps: [
        { count: 5, sense: 'See', icon: '👀', prompt: 'Name 5 things you can see around you' },
        { count: 4, sense: 'Touch', icon: '✋', prompt: '4 things you can physically feel' },
        { count: 3, sense: 'Hear', icon: '👂', prompt: '3 sounds you can hear right now' },
        { count: 2, sense: 'Smell', icon: '👃', prompt: '2 things you can smell' },
        { count: 1, sense: 'Taste', icon: '👅', prompt: '1 thing you can taste' },
      ],
      tip: 'This works best when you close your eyes between steps.',
    },
  },
]

function BreathingModal({ data, onClose }) {
  const [phase, setPhase] = useState(0)
  const [active, setActive] = useState(false)
  const [count, setCount] = useState(data.duration)

  const PHASES = data.steps.map((s, i) => ({ label: s, color: ['#A7C7E7','#CDB4DB','#B7E4C7','#CDB4DB'][i] }))

  const start = () => {
    setActive(true)
    setPhase(0)
    setCount(data.duration)
    let p = 0, c = data.duration
    const tick = setInterval(() => {
      c--
      if (c <= 0) {
        p = (p + 1) % PHASES.length
        c = data.duration
        setPhase(p)
      }
      setCount(c)
    }, 1000)
    setTimeout(() => { clearInterval(tick); setActive(false) }, 64000)
  }

  return (
    <div className="text-center">
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-1000"
          style={{
            background: PHASES[phase].color,
            transform: active ? (phase % 2 === 0 ? 'scale(1.15)' : 'scale(0.9)') : 'scale(1)',
            boxShadow: `0 0 40px ${PHASES[phase].color}60`,
          }}
        >
          {active ? (
            <div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs mt-0.5">{PHASES[phase].label}</div>
            </div>
          ) : '🌬️'}
        </div>
        {active && <p className="text-stone-muted text-sm mt-3">{PHASES[phase].label}...</p>}
      </div>
      {!active
        ? <button onClick={start} className="px-6 py-2.5 bg-blue-soft hover:bg-blue-dark text-white rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-soft">Begin breathing</button>
        : <button onClick={() => setActive(false)} className="text-sm text-stone-muted hover:text-stone-700 transition-colors">Stop</button>
      }
      <p className="text-xs text-stone-muted mt-4 bg-beige-dark/40 rounded-xl p-3 leading-relaxed">💡 {data.tip}</p>
    </div>
  )
}

function JournalModal({ data }) {
  const [answers, setAnswers] = useState(['', '', ''])
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="text-center">
      <div className="text-4xl mb-3">🌸</div>
      <h3 className="font-display text-xl text-stone-700 mb-2">Beautiful.</h3>
      <p className="text-stone-muted text-sm leading-relaxed">You just rewired your brain a tiny bit. The more you do this, the easier it gets.</p>
      <button onClick={() => { setDone(false); setAnswers(['','','']) }} className="mt-4 text-sm text-blue-dark hover:text-blue-dark/70 transition-colors">Start again</button>
    </div>
  )

  return (
    <div>
      {data.prompts.map((p, i) => (
        <div key={i} className="mb-4">
          <label className="text-xs font-semibold text-stone-muted uppercase tracking-wider block mb-1.5">{i + 1}. {p}</label>
          <textarea
            value={answers[i]}
            onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a) }}
            rows={2}
            placeholder="Write freely..."
            className="w-full bg-beige-dark/40 border border-blue-soft/20 rounded-xl px-3 py-2 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/40 resize-none"
          />
        </div>
      ))}
      <p className="text-xs text-stone-muted mb-4 bg-beige-dark/40 rounded-xl p-3 leading-relaxed">💡 {data.tip}</p>
      <button
        onClick={() => setDone(true)}
        disabled={answers.every(a => !a.trim())}
        className="w-full py-2.5 bg-green-muted hover:bg-green-dark text-white font-semibold rounded-2xl text-sm transition-all hover:-translate-y-0.5 disabled:bg-beige-dark disabled:text-stone-muted disabled:cursor-not-allowed"
      >
        I'm done writing ✓
      </button>
    </div>
  )
}

function ReframeModal({ data }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(['', '', '', ''])
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="text-center">
      <div className="text-4xl mb-3">🪴</div>
      <h3 className="font-display text-xl text-stone-700 mb-2">Well done.</h3>
      <p className="text-stone-muted text-sm leading-relaxed mb-3">You just practiced one of the most effective mental health skills there is.</p>
      <div className="bg-lavender/15 rounded-2xl p-4 text-left text-sm text-stone-700 italic">"{answers[3]}"</div>
      <button onClick={() => { setDone(false); setAnswers(['','','','']); setStep(0) }} className="mt-4 text-sm text-lavender-dark hover:opacity-70 transition-opacity">Try another thought</button>
    </div>
  )

  const current = data.steps[step]
  return (
    <div>
      <div className="flex gap-1 mb-5">
        {data.steps.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-lavender' : 'bg-beige-dark'}`} />
        ))}
      </div>
      <p className="text-sm font-medium text-stone-700 mb-2">{current.q}</p>
      <textarea
        value={answers[step]}
        onChange={e => { const a = [...answers]; a[step] = e.target.value; setAnswers(a) }}
        rows={3}
        placeholder={current.placeholder}
        className="w-full bg-beige-dark/40 border border-lavender/30 rounded-xl px-3 py-2 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-lavender/40 resize-none mb-4"
      />
      <p className="text-xs text-stone-muted mb-4 bg-beige-dark/40 rounded-xl p-3 leading-relaxed">💡 {data.tip}</p>
      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-lavender/30 text-lavender-dark rounded-xl text-sm transition-all hover:bg-lavender/10">Back</button>
        )}
        <button
          onClick={() => step < data.steps.length - 1 ? setStep(s => s + 1) : setDone(true)}
          disabled={!answers[step].trim()}
          className="flex-1 py-2 bg-lavender hover:bg-lavender-dark text-white rounded-xl text-sm font-semibold disabled:bg-beige-dark disabled:text-stone-muted transition-all hover:-translate-y-0.5"
        >
          {step < data.steps.length - 1 ? 'Next →' : 'Finish ✓'}
        </button>
      </div>
    </div>
  )
}

function GroundingModal({ data }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const s = data.steps[step]

  if (done) return (
    <div className="text-center">
      <div className="text-4xl mb-3">🌿</div>
      <h3 className="font-display text-xl text-stone-700 mb-2">You're here. You're okay.</h3>
      <p className="text-stone-muted text-sm leading-relaxed">Grounding works best with practice. Try this next time anxiety starts rising.</p>
      <button onClick={() => { setDone(false); setStep(0) }} className="mt-4 text-sm text-sage hover:opacity-70 transition-opacity">Try again</button>
    </div>
  )

  return (
    <div className="text-center">
      <div className="flex gap-1 mb-6 justify-center">
        {data.steps.map((_, i) => (
          <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-sage' : 'bg-beige-dark'}`} />
        ))}
      </div>
      <div className="w-20 h-20 rounded-full bg-green-light/50 flex items-center justify-center text-4xl mx-auto mb-4 border border-green-muted/30">
        {s.icon}
      </div>
      <div className="text-5xl font-display text-stone-700 font-bold mb-1">{s.count}</div>
      <p className="text-lg font-semibold text-stone-700 mb-2">{s.sense}</p>
      <p className="text-sm text-stone-muted mb-6 leading-relaxed">{s.prompt}</p>
      <p className="text-xs text-stone-muted mb-5 bg-beige-dark/40 rounded-xl p-3">💡 {data.tip}</p>
      <button
        onClick={() => step < data.steps.length - 1 ? setStep(s => s + 1) : setDone(true)}
        className="px-8 py-2.5 bg-sage hover:bg-sage/80 text-white font-semibold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-soft"
      >
        {step < data.steps.length - 1 ? `Next: ${data.steps[step + 1].sense} →` : 'Complete ✓'}
      </button>
    </div>
  )
}

function Modal({ exercise, onClose }) {
  const { modal } = exercise
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(140,123,107,0.25)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white/95 rounded-4xl p-6 w-full max-w-md shadow-float animate-bounce-in anim-fill max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{exercise.emoji}</span>
            <h3 className="font-display text-lg text-stone-700">{exercise.title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-beige-dark hover:bg-blue-light/30 flex items-center justify-center text-stone-muted transition-colors text-sm">✕</button>
        </div>
        {modal.type === 'breathing'  && <BreathingModal data={modal} onClose={onClose} />}
        {modal.type === 'journal'    && <JournalModal data={modal} />}
        {modal.type === 'reframe'    && <ReframeModal data={modal} />}
        {modal.type === 'grounding'  && <GroundingModal data={modal} />}
      </div>
    </div>
  )
}

export default function Gym() {
  const [open, setOpen] = useState(null)
  const exercise = EXERCISES.find(e => e.id === open)

  return (
    <div className="mesh-bg min-h-screen px-4 py-16">
      {exercise && <Modal exercise={exercise} onClose={() => setOpen(null)} />}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-up anim-fill">
          <span className="text-4xl inline-block mb-3 animate-float">🧘</span>
          <h1 className="font-display text-4xl text-stone-700 mb-3">Mental Gym</h1>
          <p className="text-stone-muted">Small exercises, real results. Pick one and give it a try.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXERCISES.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setOpen(ex.id)}
              className={`${ex.color} border rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-soft/50 group animate-fade-up anim-fill`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200 inline-block">{ex.emoji}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ex.badge}`}>{ex.badgeText}</span>
              </div>
              <h3 className="font-semibold text-stone-700 mb-1 text-base">{ex.title}</h3>
              <p className="text-stone-muted text-xs mb-3 leading-relaxed">{ex.subtitle}</p>
              <p className="text-stone-muted text-xs leading-relaxed">{ex.description}</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-dark gap-1 group-hover:gap-2 transition-all">
                <span>Start exercise</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 glass rounded-3xl p-6 border border-white/60 text-center animate-fade-up delay-400 anim-fill">
          <p className="font-display text-lg text-stone-700 mb-2">Remember</p>
          <p className="text-stone-muted text-sm leading-relaxed max-w-md mx-auto">
            You don't need to do all of these. One exercise, done genuinely, is worth more than five done half-heartedly. Start small. Be kind to yourself. 🌿
          </p>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

const MOOD_HISTORY = [
  { day: 'Mon', emoji: '😊', label: 'Good',  value: 4, color: 'bg-blue-soft' },
  { day: 'Tue', emoji: '😐', label: 'Okay',  value: 3, color: 'bg-beige-dark' },
  { day: 'Wed', emoji: '😔', label: 'Low',   value: 2, color: 'bg-lavender' },
  { day: 'Thu', emoji: '😣', label: 'Tough', value: 1, color: 'bg-lavender-dark' },
  { day: 'Fri', emoji: '😐', label: 'Okay',  value: 3, color: 'bg-beige-dark' },
  { day: 'Sat', emoji: '😊', label: 'Good',  value: 4, color: 'bg-blue-soft' },
  { day: 'Sun', emoji: '😄', label: 'Great', value: 5, color: 'bg-green-muted' },
]

const QUICK_ACTIONS = [
  { to: '/mood', emoji: '🌤️', label: 'Mood Check-in', desc: 'How are you feeling?', color: 'bg-blue-light/40 border-blue-soft/40 hover:border-blue-soft' },
  { to: '/chat', emoji: '💬', label: 'Talk to AI', desc: 'Chat with a companion', color: 'bg-lavender-light/40 border-lavender/40 hover:border-lavender' },
  { to: '/vent', emoji: '📝', label: 'Vent Anonymously', desc: 'Release what\'s heavy', color: 'bg-green-light/40 border-green-muted/40 hover:border-green-muted' },
  { to: '/gym', emoji: '🧘', label: 'Mental Gym', desc: 'Exercise your mind', color: 'bg-beige-dark/50 border-stone-muted/20 hover:border-stone-muted' },
]

const STATS = [
  { label: 'Check-ins this week', value: '7', icon: '📅' },
  { label: 'Vent posts', value: '3', icon: '📝' },
  { label: 'Gym exercises', value: '5', icon: '🧘' },
  { label: 'Avg mood score', value: '3.1', icon: '🌤️' },
]

const INSIGHTS = [
  { text: "Your mood has improved since Thursday. What changed?", type: 'positive', icon: '📈' },
  { text: "You checked in every day this week. That takes awareness.", type: 'neutral', icon: '🌿' },
  { text: "Try the breathing exercise on tough days — it helped others like you.", type: 'suggestion', icon: '💡' },
]

export default function Dashboard() {
  const maxVal = Math.max(...MOOD_HISTORY.map(m => m.value))

  return (
    <div className="mesh-bg min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10 animate-fade-up anim-fill">
          <h1 className="font-display text-4xl text-stone-700 mb-2">Your space</h1>
          <p className="text-stone-muted">A gentle look at your emotional journey this week 🌿</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-up delay-100 anim-fill">
          {STATS.map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 border border-white/60 shadow-card text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display text-2xl text-stone-700 font-semibold">{s.value}</div>
              <div className="text-xs text-stone-muted mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mood chart */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-card mb-6 animate-fade-up delay-200 anim-fill">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-stone-700">Mood this week</h2>
            <span className="text-xs text-stone-muted bg-beige-dark/50 px-2.5 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-28">
            {MOOD_HISTORY.map((m) => (
              <div key={m.day} className="flex flex-col items-center gap-1.5 flex-1 group">
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">{m.emoji}</span>
                <div
                  className={`w-full rounded-t-xl ${m.color} transition-all duration-500 group-hover:opacity-80`}
                  style={{ height: `${(m.value / maxVal) * 64}px`, minHeight: 8 }}
                  title={`${m.day}: ${m.label}`}
                />
                <span className="text-xs text-stone-muted">{m.day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-muted mt-4 text-center italic">
            It's okay that some days are harder than others — that's human.
          </p>
        </div>

        {/* Insights */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-card mb-6 animate-fade-up delay-300 anim-fill">
          <h2 className="font-semibold text-stone-700 mb-4">Gentle insights</h2>
          <div className="flex flex-col gap-3">
            {INSIGHTS.map((ins, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-2xl text-sm transition-all duration-200 hover:-translate-x-0.5 ${
                  ins.type === 'positive' ? 'bg-green-light/30 text-sage' :
                  ins.type === 'suggestion' ? 'bg-blue-light/30 text-blue-dark' :
                  'bg-beige-dark/40 text-stone-warm'
                }`}
              >
                <span>{ins.icon}</span>
                <span className="leading-relaxed">{ins.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-fade-up delay-400 anim-fill">
          <h2 className="font-semibold text-stone-700 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(a => (
              <Link
                key={a.to}
                to={a.to}
                className={`${a.color} border rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft group`}
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform duration-200">{a.emoji}</span>
                <p className="font-semibold text-stone-700 text-sm mb-0.5">{a.label}</p>
                <p className="text-xs text-stone-muted">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Reminder card */}
        <div className="mt-8 bg-gradient-to-r from-blue-soft/20 to-lavender/15 border border-blue-soft/30 rounded-3xl p-6 text-center animate-fade-up delay-500 anim-fill">
          <p className="text-blue-dark font-medium mb-1">Remember</p>
          <p className="text-stone-muted text-sm leading-relaxed">
            This is a glimpse into your week — not a judgment. Every day you show up for yourself counts. 💙
          </p>
        </div>
      </div>
    </div>
  )
}

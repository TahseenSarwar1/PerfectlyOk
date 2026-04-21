import { useState, useRef, useEffect } from 'react'

const AI_RESPONSES = [
  "I hear you, and I want you to know — what you're feeling is completely valid. You don't have to minimize it.",
  "That sounds really hard. It takes courage to even put words to it. Thank you for sharing this with me.",
  "You're not alone in this. Many students feel exactly the way you're describing, even if it doesn't seem that way from the outside.",
  "I'm here with you. Take all the time you need — there's no rush.",
  "It's okay to not be okay. You don't have to have it all figured out right now.",
  "What you're carrying sounds heavy. Have you had any moments of rest or lightness lately, even small ones?",
  "Your feelings make sense given what you're going through. You're responding like a human being — not overreacting.",
  "Sometimes naming a feeling is the first step to releasing some of its hold on you. You're doing that right now.",
  "I see you. Truly. And I think you're stronger than you give yourself credit for.",
  "One breath at a time. You don't have to solve everything today.",
]

const STARTERS = [
  "I've been feeling really overwhelmed lately",
  "I'm stressed about my exams",
  "I feel lonely even around people",
  "I don't know how to manage my anxiety",
]

let responseIdx = 0

const getId = () => Math.random().toString(36).slice(2)

const INIT = [
  {
    id: getId(),
    role: 'ai',
    text: "Hi, I'm really glad you're here 💙 This is a safe, judgment-free space. You can share anything on your mind — how are you feeling today?",
    time: new Date(),
  },
]

export default function Chat() {
  const [messages, setMessages] = useState(INIT)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    setMessages(prev => [...prev, { id: getId(), role: 'user', text: msg, time: new Date() }])
    setTyping(true)

    const delay = 1200 + Math.random() * 800
    setTimeout(() => {
      const reply = AI_RESPONSES[responseIdx % AI_RESPONSES.length]
      responseIdx++
      setTyping(false)
      setMessages(prev => [...prev, { id: getId(), role: 'ai', text: reply, time: new Date() }])
    }, delay)
  }

  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg flex flex-col" style={{ height: 'calc(100vh - 120px)', maxHeight: 720 }}>

        {/* Header */}
        <div className="glass rounded-t-4xl px-5 py-4 border border-white/60 border-b-0 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-soft/40 flex items-center justify-center text-xl border border-blue-soft/30">🤍</div>
            <div>
              <p className="font-semibold text-stone-700 text-sm">Antigravity Companion</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
                <p className="text-xs text-stone-muted">Always here for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto glass border-x border-white/60 px-4 py-4 flex flex-col gap-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 items-end animate-fade-in anim-fill ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-blue-soft/30 flex items-center justify-center text-sm flex-shrink-0 mb-0.5">🤍</div>
              )}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-soft text-white rounded-br-sm'
                    : 'bg-white/80 text-stone-700 rounded-bl-sm border border-blue-light/40'
                }`}>
                  {msg.text}
                </div>
                <span className="text-xs text-stone-muted px-1">{fmt(msg.time)}</span>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2 items-end animate-fade-in anim-fill">
              <div className="w-7 h-7 rounded-full bg-blue-soft/30 flex items-center justify-center text-sm flex-shrink-0">🤍</div>
              <div className="bg-white/80 border border-blue-light/40 rounded-3xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Starters */}
        {messages.length <= 1 && (
          <div className="glass border-x border-white/60 px-4 pb-2 flex gap-2 overflow-x-auto py-2">
            {STARTERS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="whitespace-nowrap text-xs px-3 py-1.5 bg-blue-light/50 hover:bg-blue-soft/40 text-stone-700 rounded-xl border border-blue-soft/20 transition-all flex-shrink-0 hover:-translate-y-0.5"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass rounded-b-4xl border border-white/60 border-t-0 px-4 py-3 shadow-soft">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Share what's on your mind..."
              disabled={typing}
              className="flex-1 bg-beige-dark/40 border border-blue-soft/20 rounded-2xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/50 focus:border-blue-soft transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={typing || !input.trim()}
              className="w-10 h-10 rounded-2xl bg-blue-soft hover:bg-blue-dark disabled:bg-beige-dark flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-stone-muted mt-2 opacity-70">This is a supportive space, not a crisis line.</p>
        </div>
      </div>
    </div>
  )
}

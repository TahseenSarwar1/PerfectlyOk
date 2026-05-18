import { useState, useRef, useEffect } from 'react'
import { db, auth } from '../firebase'
import { signInAnonymously } from 'firebase/auth'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import ChatRoom from '../components/ChatRoom'
import { chatWithCohere, isCohereConfigured } from '../lib/cohere'

/* ─── Fallback responses when API key is missing ─── */
const FALLBACK_RESPONSES = [
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

let fallbackIdx = 0
const getId = () => Math.random().toString(36).slice(2)

const WELCOME_MSG = {
  id: getId(),
  role: 'ai',
  text: "Hi, I'm really glad you're here 💙 This is a safe, judgment-free space. You can share anything on your mind — how are you feeling today?",
  time: new Date(),
}

/* ─── AI Chat Component with Cohere integration ─── */
function AIChat() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [conversationHistory, setConversationHistory] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const resetChat = () => {
    setMessages([{ ...WELCOME_MSG, id: getId(), time: new Date() }])
    setConversationHistory([])
    setInput('')
    setTyping(false)
    setError(null)
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || typing) return
    setInput('')
    setError(null)

    const userMsg = { id: getId(), role: 'user', text: msg, time: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: msg },
    ]

    try {
      let reply
      if (isCohereConfigured()) {
        reply = await chatWithCohere(updatedHistory)
      } else {
        /* Graceful fallback */
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800))
        reply = FALLBACK_RESPONSES[fallbackIdx % FALLBACK_RESPONSES.length]
        fallbackIdx++
      }

      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: reply },
      ])
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: getId(), role: 'ai', text: reply, time: new Date() },
      ])
    } catch (err) {
      console.error('Cohere error:', err)
      setTyping(false)
      setError('Something went wrong reaching our AI. Your words still matter — please try again in a moment.')
      /* Still provide a fallback reply */
      const fallback = FALLBACK_RESPONSES[fallbackIdx % FALLBACK_RESPONSES.length]
      fallbackIdx++
      setMessages((prev) => [
        ...prev,
        { id: getId(), role: 'ai', text: fallback, time: new Date() },
      ])
    }
  }

  const fmt = (d) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* Header */}
      <div className="glass rounded-t-4xl px-5 py-4 border border-white/60 border-b-0 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-soft/50 to-lavender/40 flex items-center justify-center text-xl border border-blue-soft/30 shadow-sm">
              🤍
            </div>
            <div>
              <p className="font-semibold text-stone-700 text-sm">
                MindMate Companion
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
                <p className="text-xs text-stone-muted">Always here for you</p>
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            title="New chat"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-muted hover:text-blue-dark bg-beige-dark/30 hover:bg-blue-light/40 rounded-xl border border-transparent hover:border-blue-soft/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-0 bg-lavender/20 border-x border-white/60 px-4 py-2.5 flex items-center gap-2 animate-fade-in anim-fill">
          <span className="text-sm">💜</span>
          <p className="text-xs text-lavender-dark leading-relaxed flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-lavender-dark/60 hover:text-lavender-dark text-sm transition-colors">✕</button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass border-x border-white/60 px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 items-end animate-fade-in anim-fill ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-soft/30 to-lavender/20 flex items-center justify-center text-sm flex-shrink-0 mb-0.5">
                🤍
              </div>
            )}
            <div
              className={`max-w-[78%] ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              } flex flex-col gap-1`}
            >
              <div
                className={`px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-soft to-blue-dark text-white rounded-br-sm shadow-sm'
                    : 'bg-white/80 text-stone-700 rounded-bl-sm border border-blue-light/40'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-stone-muted px-1">
                {fmt(msg.time)}
              </span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 items-end animate-fade-in anim-fill">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-soft/30 to-lavender/20 flex items-center justify-center text-sm flex-shrink-0">
              🤍
            </div>
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
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="whitespace-nowrap text-xs px-3.5 py-2 bg-gradient-to-r from-blue-light/50 to-lavender-light/30 hover:from-blue-soft/40 hover:to-lavender/30 text-stone-700 rounded-xl border border-blue-soft/20 transition-all flex-shrink-0 hover:-translate-y-0.5 hover:shadow-sm duration-200"
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Share what's on your mind..."
            disabled={typing}
            className="flex-1 bg-beige-dark/40 border border-blue-soft/20 rounded-2xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/50 focus:border-blue-soft transition-all disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage()}
            disabled={typing || !input.trim()}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-soft to-blue-dark hover:from-blue-dark hover:to-blue-dark disabled:from-beige-dark disabled:to-beige-dark flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 shadow-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-stone-muted mt-2 opacity-70">
          {isCohereConfigured()
            ? 'Powered by AI · This is a supportive space, not a crisis line.'
            : 'This is a supportive space, not a crisis line.'}
        </p>
      </div>
    </>
  )
}

/* ─── Peer Listener Chat Component ─── */
function PeerListenerChat({ onBack }) {
  const [status, setStatus] = useState('idle') // idle | authenticating | queued | matched
  const [uid, setUid] = useState(null)
  const [queueDocId, setQueueDocId] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [waitTime, setWaitTime] = useState(0)

  // Timer for wait time
  useEffect(() => {
    if (status !== 'queued') return
    const interval = setInterval(() => setWaitTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [status])

  // Watch queue document for being matched
  useEffect(() => {
    if (!queueDocId) return
    const unsub = onSnapshot(doc(db, 'queue', queueDocId), (snap) => {
      const data = snap.data()
      if (!data) return
      if (data.status === 'matched' && data.roomId) {
        setRoomId(data.roomId)
        setStatus('matched')
      }
    })
    return () => unsub()
  }, [queueDocId])

  const requestListener = async () => {
    setStatus('authenticating')
    try {
      // Sign in anonymously
      const cred = await signInAnonymously(auth)
      const anonUid = cred.user.uid
      setUid(anonUid)

      // Add to queue
      const docRef = await addDoc(collection(db, 'queue'), {
        suffererUid: anonUid,
        status: 'waiting',
        createdAt: serverTimestamp(),
      })
      setQueueDocId(docRef.id)
      setStatus('queued')
      setWaitTime(0)
    } catch (e) {
      console.error('Failed to join queue:', e)
      setStatus('idle')
    }
  }

  const cancelRequest = async () => {
    if (queueDocId) {
      try {
        await deleteDoc(doc(db, 'queue', queueDocId))
      } catch (e) {
        /* ignore */
      }
    }
    setStatus('idle')
    setQueueDocId(null)
    setWaitTime(0)
  }

  const handleEndSession = () => {
    setStatus('idle')
    setRoomId(null)
    setQueueDocId(null)
    setWaitTime(0)
  }

  const formatWait = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  // Matched — show chat room
  if (status === 'matched' && roomId) {
    return (
      <>
        {/* Header */}
        <div className="glass rounded-t-4xl px-5 py-4 border border-white/60 border-b-0 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-light/50 to-green-muted/30 flex items-center justify-center text-xl border border-green-muted/30">
              🤍
            </div>
            <div>
              <p className="font-semibold text-stone-700 text-sm">
                Peer Listener
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
                <p className="text-xs text-stone-muted">Connected & listening</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden glass border-x border-b border-white/60 rounded-b-4xl shadow-soft flex flex-col">
          <ChatRoom
            roomId={roomId}
            currentUid={uid}
            role="sufferer"
            onEndSession={handleEndSession}
          />
        </div>
      </>
    )
  }

  // Queued — waiting animation
  if (status === 'queued' || status === 'authenticating') {
    return (
      <div className="glass rounded-4xl border border-white/60 shadow-soft p-8 sm:p-12 flex flex-col items-center justify-center text-center animate-fade-in anim-fill">
        {/* Calming pulse animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-soft/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full bg-blue-soft/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          <div className="absolute inset-4 rounded-full bg-blue-soft/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          <div className="absolute inset-0 rounded-full bg-blue-light/50 flex items-center justify-center">
            <span className="text-3xl">🤍</span>
          </div>
        </div>

        <h3 className="font-display text-2xl text-stone-700 mb-2">
          {status === 'authenticating'
            ? 'Connecting...'
            : 'Finding a peer listener'}
        </h3>
        <p className="text-stone-muted text-sm leading-relaxed mb-2 max-w-xs">
          A trained peer listener will be with you shortly. You're anonymous and safe here.
        </p>
        {status === 'queued' && (
          <p className="text-xs text-stone-muted mb-6">
            Waiting: {formatWait(waitTime)}
          </p>
        )}

        {/* Calming tips while waiting */}
        <div className="bg-beige-dark/30 rounded-2xl p-4 mb-6 max-w-xs">
          <p className="text-xs text-sage font-medium mb-1">While you wait</p>
          <p className="text-xs text-stone-muted leading-relaxed">
            Try taking three slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. You're doing great just by being here 🌿
          </p>
        </div>

        <button
          onClick={cancelRequest}
          className="text-sm text-stone-muted hover:text-stone-700 transition-colors px-4 py-2 rounded-xl hover:bg-beige-dark/40"
        >
          Cancel request
        </button>
      </div>
    )
  }

  // Idle — request button
  return (
    <div className="glass rounded-4xl border border-white/60 shadow-soft p-8 sm:p-10 text-center animate-fade-in anim-fill">
      <div className="text-4xl mb-5 animate-float inline-block">🤍</div>
      <h3 className="font-display text-2xl text-stone-700 mb-3">
        Talk to a Real Person
      </h3>
      <p className="text-stone-muted text-sm leading-relaxed mb-6 max-w-sm mx-auto">
        Connect with a trained peer listener — someone who truly understands. 
        Your conversation is private and anonymous.
      </p>

      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={requestListener}
          className="px-8 py-3.5 bg-gradient-to-r from-green-muted to-green-dark hover:from-green-dark hover:to-green-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-0.5"
        >
          Request a Peer Listener 💚
        </button>
        <button
          onClick={onBack}
          className="text-sm text-stone-muted hover:text-stone-700 transition-colors"
        >
          ← Back to options
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto">
        <div className="bg-beige-dark/30 rounded-2xl p-3">
          <p className="text-lg mb-1">🔒</p>
          <p className="text-xs text-stone-muted">Anonymous</p>
        </div>
        <div className="bg-beige-dark/30 rounded-2xl p-3">
          <p className="text-lg mb-1">🎓</p>
          <p className="text-xs text-stone-muted">Trained</p>
        </div>
        <div className="bg-beige-dark/30 rounded-2xl p-3">
          <p className="text-lg mb-1">💙</p>
          <p className="text-xs text-stone-muted">Empathetic</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Chat Page ─── */
export default function Chat() {
  const [mode, setMode] = useState(null) // null | 'ai' | 'peer'

  // Mode selector
  if (!mode) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 animate-fade-up anim-fill">
            <span className="text-4xl inline-block mb-3 animate-float">💬</span>
            <h1 className="font-display text-4xl text-stone-700 mb-3">
              Talk to Someone
            </h1>
            <p className="text-stone-muted">
              Choose the support that feels right for you
            </p>
          </div>

          <div className="flex flex-col gap-4 animate-fade-up delay-200 anim-fill">
            {/* AI Companion Card */}
            <button
              onClick={() => setMode('ai')}
              className="glass rounded-3xl p-6 border border-white/60 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-left group"
              id="chat-mode-ai"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-soft/30 to-lavender/20 flex items-center justify-center text-2xl border border-blue-soft/20 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-700 text-base mb-1">
                    AI Companion
                  </h3>
                  <p className="text-stone-muted text-sm leading-relaxed">
                    Instant, warm responses from our AI companion. Available 24/7, no waiting.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block" />
                    <span className="text-xs text-sage font-medium">
                      Always available
                    </span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-stone-muted group-hover:text-blue-soft group-hover:translate-x-1 transition-all mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Peer Listener Card */}
            <button
              onClick={() => setMode('peer')}
              className="glass rounded-3xl p-6 border border-green-muted/40 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-left group bg-green-light/20"
              id="chat-mode-peer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-light/50 flex items-center justify-center text-2xl border border-green-muted/30 group-hover:scale-110 transition-transform">
                  🤍
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-700 text-base mb-1">
                    Peer Listener
                    <span className="ml-2 text-xs font-medium text-green-dark bg-green-light/50 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </h3>
                  <p className="text-stone-muted text-sm leading-relaxed">
                    Talk to a real, trained peer who genuinely cares. Private and anonymous.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
                    <span className="text-xs text-sage font-medium">
                      Listeners available
                    </span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-stone-muted group-hover:text-green-dark group-hover:translate-x-1 transition-all mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-stone-muted mt-6 opacity-70 animate-fade-up delay-400 anim-fill">
            Both options are safe, confidential spaces. Not a substitute for professional help.
          </p>
        </div>
      </div>
    )
  }

  // AI mode
  if (mode === 'ai') {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-lg flex flex-col"
          style={{ height: 'calc(100vh - 120px)', maxHeight: 720 }}
        >
          {/* Back button */}
          <button
            onClick={() => setMode(null)}
            className="self-start mb-3 text-sm text-stone-muted hover:text-stone-700 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-white/40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Options
          </button>
          <AIChat />
        </div>
      </div>
    )
  }

  // Peer Listener mode
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-lg flex flex-col"
        style={{ height: 'calc(100vh - 120px)', maxHeight: 720 }}
      >
        {/* Back button (only shown when not in active chat) */}
        <PeerListenerChat onBack={() => setMode(null)} />
      </div>
    </div>
  )
}

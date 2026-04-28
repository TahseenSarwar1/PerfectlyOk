import { useState, useRef, useEffect, useCallback } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'

const getId = () => Math.random().toString(36).slice(2)

export default function ChatRoom({ roomId, currentUid, role, onEndSession }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [remoteTyping, setRemoteTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [ended, setEnded] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimeout = useRef(null)

  const otherRole = role === 'sufferer' ? 'listener' : 'sufferer'
  const typingField = role === 'sufferer' ? 'suffererTyping' : 'listenerTyping'
  const otherTypingField = role === 'sufferer' ? 'listenerTyping' : 'suffererTyping'

  // Subscribe to messages
  useEffect(() => {
    if (!roomId) return
    const q = query(
      collection(db, 'chatRooms', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMessages(msgs)
    })
    return () => unsub()
  }, [roomId])

  // Subscribe to room status & typing
  useEffect(() => {
    if (!roomId) return
    const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
      const data = snap.data()
      if (!data) return
      if (data.status === 'ended') setEnded(true)
      setRemoteTyping(!!data[otherTypingField])
    })
    return () => unsub()
  }, [roomId, otherTypingField])

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, remoteTyping])

  // Update typing indicator
  const setTypingStatus = useCallback(
    async (isTyping) => {
      if (!roomId) return
      try {
        await updateDoc(doc(db, 'chatRooms', roomId), {
          [typingField]: isTyping,
        })
      } catch (e) {
        /* room may be deleted */
      }
    },
    [roomId, typingField]
  )

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setTypingStatus(true)
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setTypingStatus(false), 2000)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending || ended) return
    setInput('')
    setSending(true)
    setTypingStatus(false)
    clearTimeout(typingTimeout.current)

    try {
      await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
        text,
        senderId: currentUid,
        senderRole: role,
        createdAt: serverTimestamp(),
      })
    } catch (e) {
      console.error('Failed to send message:', e)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const handleEndSession = async () => {
    try {
      // Send a system message
      await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
        text:
          role === 'listener'
            ? 'The peer listener has ended this session. Take care of yourself 💙'
            : 'The session has been ended. Thank you for reaching out 💙',
        senderId: 'system',
        senderRole: 'system',
        createdAt: serverTimestamp(),
      })
      await updateDoc(doc(db, 'chatRooms', roomId), { status: 'ended' })
    } catch (e) {
      console.error('Failed to end session:', e)
    }
    if (onEndSession) onEndSession()
  }

  const fmt = (timestamp) => {
    if (!timestamp?.toDate) return ''
    return timestamp.toDate().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (ended) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-bounce-in anim-fill">
          <div className="text-4xl mb-4">🌿</div>
          <h3 className="font-display text-2xl text-stone-700 mb-3">
            Session ended
          </h3>
          <p className="text-stone-muted text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            Thank you for this conversation. Remember, it's okay to reach out
            whenever you need support.
          </p>
          {onEndSession && (
            <button
              onClick={onEndSession}
              className="px-6 py-2.5 bg-blue-soft hover:bg-blue-dark text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-soft text-sm"
            >
              {role === 'listener' ? 'Back to Dashboard' : 'Back to Chat'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Connection banner */}
      <div className="px-4 py-2 bg-green-light/40 border-b border-green-muted/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-muted animate-pulse-slow" />
        <span className="text-xs font-medium text-sage">
          {role === 'sufferer'
            ? 'Connected with a trained peer listener'
            : 'Connected with someone who needs support'}
        </span>
        <button
          onClick={handleEndSession}
          className="ml-auto text-xs text-stone-muted hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          End session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Initial system message */}
        <div className="text-center py-3">
          <p className="text-xs text-stone-muted bg-beige-dark/40 inline-block px-4 py-1.5 rounded-full">
            This is a safe, confidential space 🔒
          </p>
        </div>

        {messages.map((msg) => {
          if (msg.senderRole === 'system') {
            return (
              <div key={msg.id} className="text-center py-2 animate-fade-in anim-fill">
                <p className="text-xs text-stone-muted bg-lavender/20 inline-block px-4 py-1.5 rounded-full">
                  {msg.text}
                </p>
              </div>
            )
          }

          const isMe = msg.senderId === currentUid
          return (
            <div
              key={msg.id}
              className={`flex gap-2 items-end animate-fade-in anim-fill ${
                isMe ? 'flex-row-reverse' : ''
              }`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-blue-soft/30 flex items-center justify-center text-sm flex-shrink-0 mb-0.5">
                  {msg.senderRole === 'listener' ? '🤍' : '💭'}
                </div>
              )}
              <div
                className={`max-w-[78%] ${
                  isMe ? 'items-end' : 'items-start'
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-soft text-white rounded-br-sm'
                      : 'bg-white/80 text-stone-700 rounded-bl-sm border border-blue-light/40'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-stone-muted px-1">
                  {fmt(msg.createdAt)}
                </span>
              </div>
            </div>
          )
        })}

        {remoteTyping && (
          <div className="flex gap-2 items-end animate-fade-in anim-fill">
            <div className="w-7 h-7 rounded-full bg-blue-soft/30 flex items-center justify-center text-sm flex-shrink-0">
              {role === 'sufferer' ? '🤍' : '💭'}
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

      {/* Input */}
      <div className="px-4 py-3 border-t border-blue-light/30">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-beige-dark/40 border border-blue-soft/20 rounded-2xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/50 focus:border-blue-soft transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-2xl bg-blue-soft hover:bg-blue-dark disabled:bg-beige-dark flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
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
      </div>
    </div>
  )
}

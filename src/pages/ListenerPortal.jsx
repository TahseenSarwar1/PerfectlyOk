import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore'
import ChatRoom from '../components/ChatRoom'

/* ─── Login Form ─── */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      // onAuthStateChanged will handle the rest
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError('Failed to sign in. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm animate-fade-up anim-fill">
        <div className="text-center mb-8">
          <span className="text-4xl inline-block mb-3 animate-float">🤍</span>
          <h1 className="font-display text-3xl text-stone-700 mb-2">
            Peer Listener Portal
          </h1>
          <p className="text-stone-muted text-sm">
            Sign in to start helping others
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 border border-white/60 shadow-soft"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 animate-fade-in anim-fill">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="listener@example.com"
              className="w-full bg-beige-dark/40 border border-blue-soft/20 rounded-2xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/50 focus:border-blue-soft transition-all"
              required
              autoComplete="email"
              id="listener-email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-beige-dark/40 border border-blue-soft/20 rounded-2xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-blue-soft/50 focus:border-blue-soft transition-all"
              required
              autoComplete="current-password"
              id="listener-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-soft hover:bg-blue-dark disabled:bg-beige-dark text-white font-semibold rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed"
            id="listener-login-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-muted mt-4 opacity-70">
          Only authorized peer listeners can access this portal
        </p>
      </div>
    </div>
  )
}

/* ─── Listener Dashboard ─── */
function ListenerDashboard({ user }) {
  const [queue, setQueue] = useState([])
  const [activeRoomId, setActiveRoomId] = useState(null)
  const [accepting, setAccepting] = useState(false)

  // Subscribe to waiting queue
  useEffect(() => {
    const q = query(
      collection(db, 'queue'),
      where('status', '==', 'waiting'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setQueue(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const acceptNext = async () => {
    if (queue.length === 0 || accepting) return
    setAccepting(true)
    const request = queue[0]

    try {
      // Create a chat room
      const roomRef = await addDoc(collection(db, 'chatRooms'), {
        suffererId: request.suffererUid,
        listenerId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        listenerTyping: false,
        suffererTyping: false,
      })

      // Update queue entry
      await updateDoc(doc(db, 'queue', request.id), {
        status: 'matched',
        roomId: roomRef.id,
        listenerId: user.uid,
      })

      setActiveRoomId(roomRef.id)
    } catch (e) {
      console.error('Failed to accept request:', e)
    }
    setAccepting(false)
  }

  const handleEndSession = () => {
    setActiveRoomId(null)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Failed to sign out:', e)
    }
  }

  // Active chat session
  if (activeRoomId) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-lg flex flex-col"
          style={{ height: 'calc(100vh - 120px)', maxHeight: 720 }}
        >
          {/* Header */}
          <div className="glass rounded-t-4xl px-5 py-4 border border-white/60 border-b-0 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-light/40 flex items-center justify-center text-xl border border-green-muted/30">
                💭
              </div>
              <div>
                <p className="font-semibold text-stone-700 text-sm">
                  Active Session
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-muted inline-block animate-pulse-slow" />
                  <p className="text-xs text-stone-muted">
                    Someone is counting on you
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden glass border-x border-b border-white/60 rounded-b-4xl shadow-soft flex flex-col">
            <ChatRoom
              roomId={activeRoomId}
              currentUid={user.uid}
              role="listener"
              onEndSession={handleEndSession}
            />
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen mesh-bg px-4 py-8">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up anim-fill">
          <div>
            <h1 className="font-display text-3xl text-stone-700">
              Listener Dashboard
            </h1>
            <p className="text-stone-muted text-sm mt-1">
              Welcome back, {user.email?.split('@')[0]} 🤍
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-stone-muted hover:text-stone-700 transition-colors px-4 py-2 rounded-xl hover:bg-white/40 border border-white/40"
          >
            Sign out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-up delay-100 anim-fill">
          <div className="glass rounded-3xl p-5 border border-white/60 shadow-card text-center">
            <div className="font-display text-3xl text-stone-700 font-semibold mb-1">
              {queue.length}
            </div>
            <p className="text-stone-muted text-sm">Waiting for support</p>
          </div>
          <div className="glass rounded-3xl p-5 border border-white/60 shadow-card text-center">
            <div className="font-display text-3xl text-stone-700 font-semibold mb-1">
              🟢
            </div>
            <p className="text-stone-muted text-sm">You're online</p>
          </div>
        </div>

        {/* Queue */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-soft animate-fade-up delay-200 anim-fill">
          <h2 className="font-semibold text-stone-700 text-lg mb-4">
            Support Queue
          </h2>

          {queue.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4 animate-float inline-block">🌿</div>
              <p className="text-stone-muted text-sm leading-relaxed">
                No one is waiting right now.
                <br />
                Take a moment to rest. You'll be notified when someone needs you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((req, idx) => {
                const waitSec = req.createdAt?.toDate
                  ? Math.floor(
                      (Date.now() - req.createdAt.toDate().getTime()) / 1000
                    )
                  : 0
                const waitMin = Math.floor(waitSec / 60)
                const waitStr =
                  waitMin > 0 ? `${waitMin}m ${waitSec % 60}s` : `${waitSec}s`

                return (
                  <div
                    key={req.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'bg-green-light/30 border-green-muted/40'
                        : 'bg-beige-dark/20 border-white/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-soft/20 flex items-center justify-center">
                      💭
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-700">
                        Anonymous Student
                      </p>
                      <p className="text-xs text-stone-muted">
                        Waiting: {waitStr}
                      </p>
                    </div>
                    {idx === 0 && (
                      <button
                        onClick={acceptNext}
                        disabled={accepting}
                        className="px-4 py-2 bg-green-muted hover:bg-green-dark text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-soft disabled:opacity-50"
                      >
                        {accepting ? 'Connecting...' : 'Accept'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-card mt-6 animate-fade-up delay-300 anim-fill">
          <h3 className="font-semibold text-stone-700 text-sm mb-3">
            Listener Guidelines 📋
          </h3>
          <ul className="space-y-2 text-sm text-stone-muted">
            <li className="flex items-start gap-2">
              <span className="text-green-muted mt-0.5">✓</span>
              Listen actively and validate their feelings
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-muted mt-0.5">✓</span>
              Use empathetic, non-judgmental language
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-muted mt-0.5">✓</span>
              Avoid giving advice unless asked — just be present
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-soft mt-0.5">ℹ</span>
              If someone is in crisis, guide them to professional resources
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lavender mt-0.5">♥</span>
              Take care of yourself too — it's okay to take breaks
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Portal ─── */
export default function ListenerPortal() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      // Only set user if they're not anonymous (anonymous = sufferers)
      if (u && !u.isAnonymous) {
        setUser(u)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="text-center animate-fade-in anim-fill">
          <div className="text-3xl mb-3 animate-float inline-block">🤍</div>
          <p className="text-stone-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <ListenerDashboard user={user} />
}

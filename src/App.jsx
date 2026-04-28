import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Mood from './pages/Mood.jsx'
import Chat from './pages/Chat.jsx'
import Vent from './pages/Vent.jsx'
import Gym from './pages/Gym.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ListenerPortal from './pages/ListenerPortal.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"          element={<Landing />} />
        <Route path="/mood"      element={<Mood />} />
        <Route path="/chat"      element={<Chat />} />
        <Route path="/vent"      element={<Vent />} />
        <Route path="/gym"       element={<Gym />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/listener" element={<ListenerPortal />} />
    </Routes>
  )
}

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import RoutesPage from './pages/RoutesPage'
import RouteEditorPage from './pages/RouteEditorPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Route>
      <Route path="/routes/new" element={<RouteEditorPage />} />
      <Route path="/routes/:id/edit" element={<RouteEditorPage />} />
    </Routes>
  )
}

export default App

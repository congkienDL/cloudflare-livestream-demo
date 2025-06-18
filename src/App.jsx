import { useState } from 'react'
import './App.css'
import LiveInputCreator from './components/LiveInputCreator'
import StreamViewer from './components/StreamViewer'
import LiveInputsList from './components/LiveInputsList'

function App() {
  const [activeTab, setActiveTab] = useState('create')
  const [refreshInputs, setRefreshInputs] = useState(0)

  const handleInputCreated = () => {
    setRefreshInputs(prev => prev + 1)
    setActiveTab('list')
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloudflare Stream Live</h1>
        <p>Create and watch live streams</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Live Input
        </button>
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          Live Inputs
        </button>
        <button
          className={activeTab === 'watch' ? 'active' : ''}
          onClick={() => setActiveTab('watch')}
        >
          Watch Stream
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'create' && (
          <LiveInputCreator onInputCreated={handleInputCreated} />
        )}
        {activeTab === 'list' && (
          <LiveInputsList key={refreshInputs} />
        )}
        {activeTab === 'watch' && (
          <StreamViewer />
        )}
      </main>
    </div>
  )
}

export default App

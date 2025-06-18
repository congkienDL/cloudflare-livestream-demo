import { useState, useEffect } from 'react'
import { getLiveInputs, deleteLiveInput, generateStreamUrls } from '../services/cloudflareStream'

const LiveInputsList = () => {
  const [inputs, setInputs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInputs()
  }, [])

  const loadInputs = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getLiveInputs()
      if (response.success) {
        setInputs(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to load live inputs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (inputId, inputName) => {
    if (!window.confirm(`Are you sure you want to delete "${inputName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await deleteLiveInput(inputId)
      if (response.success) {
        setInputs(prev => prev.filter(input => input.uid !== inputId))
        alert('Live input deleted successfully')
      } else {
        alert(`Failed to delete live input: ${response.error}`)
      }
    } catch (err) {
      alert('Failed to delete live input')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="loading">
        <p>Loading live inputs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button className="btn" onClick={loadInputs}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Live Inputs ({inputs.length})</h2>
          <button className="btn" onClick={loadInputs}>
            Refresh
          </button>
        </div>
        
        {inputs.length === 0 ? (
          <p>No live inputs found. Create your first live input to get started!</p>
        ) : (
          <p>Manage your live inputs and get streaming details.</p>
        )}
      </div>

      {inputs.length > 0 && (
        <div className="inputs-grid">
          {inputs.map((input) => {
            const streamUrls = generateStreamUrls(input.uid)
            
            return (
              <div key={input.uid} className="input-card">
                <h3>{input.meta?.name || 'Untitled Stream'}</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p><strong>ID:</strong> <code>{input.uid}</code></p>
                  <p><strong>Created:</strong> {formatDate(input.created)}</p>
                  <p><strong>Modified:</strong> {formatDate(input.modified)}</p>
                  <p><strong>Recording Mode:</strong> {input.recording?.mode || 'off'}</p>
                  {input.recording?.requireSignedURLs && (
                    <p><strong>Requires Signed URLs:</strong> Yes</p>
                  )}
                  {input.preferLowLatency && (
                    <p><strong>Low Latency:</strong> Enabled</p>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4>RTMPS Configuration:</h4>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong>Server:</strong><br />
                    <code style={{ fontSize: '0.8rem' }}>{input.rtmps?.url}</code>
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(input.rtmps?.url)}
                    >
                      Copy
                    </button>
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong>Stream Key:</strong><br />
                    <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                      {input.rtmps?.streamKey}
                    </code>
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(input.rtmps?.streamKey)}
                    >
                      Copy
                    </button>
                  </p>
                </div>

                {!streamUrls.error && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4>Watch URLs:</h4>
                    <p style={{ fontSize: '0.9rem' }}>
                      <strong>Player:</strong><br />
                      <a 
                        href={streamUrls.watchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {streamUrls.watchUrl}
                      </a>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(streamUrls.watchUrl)}
                      >
                        Copy
                      </button>
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      <strong>HLS:</strong><br />
                      <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                        {streamUrls.hlsUrl}
                      </code>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(streamUrls.hlsUrl)}
                      >
                        Copy
                      </button>
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    onClick={() => window.open(streamUrls.watchUrl, '_blank')}
                    disabled={streamUrls.error}
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Watch
                  </button>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(input.uid)}
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Copy ID
                  </button>
                  <button
                    onClick={() => handleDelete(input.uid, input.meta?.name)}
                    style={{ 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LiveInputsList

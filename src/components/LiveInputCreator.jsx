import { useState } from 'react'
import { createLiveInput } from '../services/cloudflareStream'

const LiveInputCreator = ({ onInputCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    recordingMode: 'automatic',
    requireSignedURLs: false,
    preferLowLatency: false,
    deleteRecordingAfterDays: null
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await createLiveInput(formData)
      
      if (response.success) {
        setResult(response.data)
        setFormData({
          name: '',
          recordingMode: 'automatic',
          requireSignedURLs: false,
          preferLowLatency: false,
          deleteRecordingAfterDays: null
        })
        
        if (onInputCreated) {
          onInputCreated(response.data)
        }
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to create live input. Please check your configuration.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }

  return (
    <div className="card">
      <h2>Create New Live Input</h2>
      <p>Create a new live input to start streaming to Cloudflare Stream.</p>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="success-message">
          <h3>Live Input Created Successfully!</h3>
          <div className="stream-info">
            <h4>Stream Details:</h4>
            <p><strong>Input ID:</strong> <code>{result.uid}</code></p>
            <p><strong>Name:</strong> {result.meta.name}</p>
            <p><strong>Status:</strong> {result.status || 'Ready'}</p>
            
            <h4>RTMPS Configuration:</h4>
            <p><strong>Server URL:</strong> 
              <code>{result.rtmps.url}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(result.rtmps.url)}
              >
                Copy
              </button>
            </p>
            <p><strong>Stream Key:</strong> 
              <code>{result.rtmps.streamKey}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(result.rtmps.streamKey)}
              >
                Copy
              </button>
            </p>
            
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <h4>How to use with OBS Studio:</h4>
              <ol style={{ textAlign: 'left', margin: 0 }}>
                <li>Open OBS Studio</li>
                <li>Go to Settings → Stream</li>
                <li>Select "Custom..." as Service</li>
                <li>Copy the Server URL above into the "Server" field</li>
                <li>Copy the Stream Key above into the "Stream Key" field</li>
                <li>Click OK and start streaming!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Stream Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter a name for your live stream"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recordingMode">Recording Mode</label>
          <select
            id="recordingMode"
            name="recordingMode"
            value={formData.recordingMode}
            onChange={handleInputChange}
          >
            <option value="automatic">Automatic (Record and make available for playback)</option>
            <option value="off">Off (Live only, no recording)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="requireSignedURLs"
              checked={formData.requireSignedURLs}
              onChange={handleInputChange}
            />
            Require signed URLs for viewing
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="preferLowLatency"
              checked={formData.preferLowLatency}
              onChange={handleInputChange}
            />
            Enable low-latency mode (Beta)
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="deleteRecordingAfterDays">Auto-delete recordings after (days)</label>
          <input
            type="number"
            id="deleteRecordingAfterDays"
            name="deleteRecordingAfterDays"
            value={formData.deleteRecordingAfterDays || ''}
            onChange={handleInputChange}
            placeholder="Leave empty to keep forever (min: 30, max: 1096)"
            min="30"
            max="1096"
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Live Input'}
        </button>
      </form>
    </div>
  )
}

export default LiveInputCreator

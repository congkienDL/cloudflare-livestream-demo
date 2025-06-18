import { useState, useEffect } from 'react'
import { generateStreamUrls, getLiveInputStatus, getLiveInputVideos } from '../services/cloudflareStream'

const StreamViewer = () => {
  const [inputId, setInputId] = useState('')
  const [streamUrls, setStreamUrls] = useState(null)
  const [status, setStatus] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [playerType, setPlayerType] = useState('cloudflare')

  const handleInputChange = (e) => {
    setInputId(e.target.value)
    setStreamUrls(null)
    setStatus(null)
    setVideos([])
    setError(null)
  }

  const loadStream = async () => {
    if (!inputId.trim()) {
      setError('Please enter a valid Input ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate stream URLs
      const urls = generateStreamUrls(inputId)
      if (urls.error) {
        setError(urls.error)
        setLoading(false)
        return
      }
      setStreamUrls(urls)

      // Check status
      const statusResponse = await getLiveInputStatus(inputId)
      if (statusResponse.success) {
        setStatus(statusResponse.data)
      }

      // Get videos
      const videosResponse = await getLiveInputVideos(inputId)
      if (videosResponse.success) {
        setVideos(videosResponse.data)
      }

    } catch (err) {
      setError('Failed to load stream information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    loadStream()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }

  const refreshStatus = () => {
    if (inputId) {
      loadStream()
    }
  }

  return (
    <div className="card">
      <h2>Watch Live Stream</h2>
      <p>Enter a Live Input ID or Video ID to watch a stream.</p>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inputId">Live Input ID or Video ID *</label>
          <input
            type="text"
            id="inputId"
            value={inputId}
            onChange={handleInputChange}
            placeholder="Enter Live Input ID or Video ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="playerType">Player Type</label>
          <select
            id="playerType"
            value={playerType}
            onChange={(e) => setPlayerType(e.target.value)}
          >
            <option value="cloudflare">Cloudflare Stream Player</option>
            <option value="hls">HLS (Custom Player)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Stream'}
        </button>

        {streamUrls && (
          <button 
            type="button" 
            className="btn"
            onClick={refreshStatus}
            style={{ marginLeft: '1rem' }}
          >
            Refresh Status
          </button>
        )}
      </form>

      {streamUrls && (
        <div style={{ marginTop: '2rem' }}>
          {/* Stream Status */}
          {status && (
            <div className="stream-info">
              <h3>Stream Status</h3>
              <p><strong>Live:</strong> 
                <span className={`status-badge ${status.live ? 'status-live' : 'status-idle'}`}>
                  {status.live ? 'LIVE' : 'OFFLINE'}
                </span>
              </p>
              {status.videoUID && (
                <p><strong>Current Video ID:</strong> <code>{status.videoUID}</code></p>
              )}
            </div>
          )}

          {/* Video Player */}
          <div className="video-container">
            {playerType === 'cloudflare' ? (
              <iframe
                src={streamUrls.playerUrl}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Cloudflare Stream Player"
              />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', background: '#f8f9fa' }}>
                <p>HLS URL for custom player:</p>
                <code style={{ wordBreak: 'break-all' }}>{streamUrls.hlsUrl}</code>
                <br />
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(streamUrls.hlsUrl)}
                  style={{ marginTop: '1rem' }}
                >
                  Copy HLS URL
                </button>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  Use this URL with video.js, hls.js, or any HLS-compatible player
                </p>
              </div>
            )}
          </div>

          {/* Stream URLs */}
          <div className="stream-info">
            <h3>Stream URLs</h3>
            <p><strong>Watch Page:</strong> 
              <code>{streamUrls.watchUrl}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(streamUrls.watchUrl)}
              >
                Copy
              </button>
            </p>
            <p><strong>HLS Manifest:</strong> 
              <code>{streamUrls.hlsUrl}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(streamUrls.hlsUrl)}
              >
                Copy
              </button>
            </p>
            <p><strong>DASH Manifest:</strong> 
              <code>{streamUrls.dashUrl}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(streamUrls.dashUrl)}
              >
                Copy
              </button>
            </p>
          </div>

          {/* Videos List */}
          {videos.length > 0 && (
            <div className="stream-info">
              <h3>Associated Videos</h3>
              {videos.map((video, index) => (
                <div key={video.uid} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <p><strong>Video {index + 1}:</strong> {video.meta?.name || 'Untitled'}</p>
                  <p><strong>ID:</strong> <code>{video.uid}</code></p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${video.status?.state === 'live-inprogress' ? 'status-live' : 'status-idle'}`}>
                      {video.status?.state || 'unknown'}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(video.created).toLocaleString()}</p>
                  {video.preview && (
                    <p>
                      <a href={video.preview} target="_blank" rel="noopener noreferrer">
                        Watch this video →
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StreamViewer

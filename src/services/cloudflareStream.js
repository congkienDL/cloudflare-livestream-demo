import axios from 'axios'
import { CLOUDFLARE_CONFIG, validateConfig } from '../config/cloudflare'

// Create axios instance with default headers
const createApiClient = () => {
  validateConfig()
  
  return axios.create({
    baseURL: `${CLOUDFLARE_CONFIG.apiBaseUrl}/accounts/${CLOUDFLARE_CONFIG.accountId}/stream`,
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    }
  })
}

// Create a new live input
export const createLiveInput = async (inputData) => {
  try {
    const api = createApiClient()
    const response = await api.post('/live_inputs', {
      meta: {
        name: inputData.name || 'Live Stream'
      },
      recording: {
        mode: inputData.recordingMode || 'automatic',
        requireSignedURLs: inputData.requireSignedURLs || false,
        allowedOrigins: inputData.allowedOrigins || null
      },
      deleteRecordingAfterDays: inputData.deleteRecordingAfterDays || null,
      preferLowLatency: inputData.preferLowLatency || false
    })
    
    return {
      success: true,
      data: response.data.result
    }
  } catch (error) {
    console.error('Error creating live input:', error)
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message
    }
  }
}

// Get all live inputs
export const getLiveInputs = async () => {
  try {
    const api = createApiClient()
    const response = await api.get('/live_inputs')
    
    return {
      success: true,
      data: response.data.result
    }
  } catch (error) {
    console.error('Error fetching live inputs:', error)
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message
    }
  }
}

// Get a specific live input
export const getLiveInput = async (inputId) => {
  try {
    const api = createApiClient()
    const response = await api.get(`/live_inputs/${inputId}`)
    
    return {
      success: true,
      data: response.data.result
    }
  } catch (error) {
    console.error('Error fetching live input:', error)
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message
    }
  }
}

// Get videos for a live input
export const getLiveInputVideos = async (inputId) => {
  try {
    const api = createApiClient()
    const response = await api.get(`/live_inputs/${inputId}/videos`)
    
    return {
      success: true,
      data: response.data.result
    }
  } catch (error) {
    console.error('Error fetching live input videos:', error)
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message
    }
  }
}

// Check live input status
export const getLiveInputStatus = async (inputId) => {
  try {
    const customerCode = CLOUDFLARE_CONFIG.customerCode
    if (!customerCode) {
      throw new Error('Customer code not configured')
    }
    
    const response = await axios.get(
      `https://customer-${customerCode}.cloudflarestream.com/${inputId}/lifecycle`
    )
    
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error checking live input status:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete a live input
export const deleteLiveInput = async (inputId) => {
  try {
    const api = createApiClient()
    await api.delete(`/live_inputs/${inputId}`)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting live input:', error)
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message
    }
  }
}

// Generate stream URLs
export const generateStreamUrls = (inputId, customerCode = null) => {
  const code = customerCode || CLOUDFLARE_CONFIG.customerCode
  
  if (!code) {
    return {
      playerUrl: null,
      hlsUrl: null,
      dashUrl: null,
      error: 'Customer code not configured'
    }
  }
  
  return {
    playerUrl: `https://customer-${code}.cloudflarestream.com/${inputId}/iframe`,
    hlsUrl: `https://customer-${code}.cloudflarestream.com/${inputId}/manifest/video.m3u8`,
    dashUrl: `https://customer-${code}.cloudflarestream.com/${inputId}/manifest/video.mpd`,
    watchUrl: `https://customer-${code}.cloudflarestream.com/${inputId}/watch`
  }
}

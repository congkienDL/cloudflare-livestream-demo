// Cloudflare Stream API Configuration
export const CLOUDFLARE_CONFIG = {
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '',
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN || '',
  customerCode: import.meta.env.VITE_CLOUDFLARE_CUSTOMER_CODE || '',
  apiBaseUrl: 'https://api.cloudflare.com/client/v4'
}

// Validate configuration
export const validateConfig = () => {
  const missing = []
  
  if (!CLOUDFLARE_CONFIG.accountId) {
    missing.push('VITE_CLOUDFLARE_ACCOUNT_ID')
  }
  
  if (!CLOUDFLARE_CONFIG.apiToken) {
    missing.push('VITE_CLOUDFLARE_API_TOKEN')
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return true
}

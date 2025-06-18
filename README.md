# Cloudflare Stream Live Demo

A React application for creating and watching live streams using Cloudflare Stream API.

## 🚀 Features

- **Create Live Inputs**: Generate new live inputs with customizable settings
- **Stream Management**: View and manage all your live inputs
- **Watch Streams**: Watch live streams using Cloudflare Stream Player or HLS
- **RTMPS Configuration**: Get RTMPS server and stream key for OBS Studio
- **Real-time Status**: Check live stream status and viewer information
- **Production Ready**: Built with Vite for optimal performance

## 📋 Prerequisites

- Node.js 16+ installed
- Cloudflare account with Stream enabled
- Basic knowledge of streaming software (OBS Studio recommended)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/congkienDL/cloudflare-livestream-demo.git
cd cloudflare-livestream-demo
npm install
```

### 2. Configure Cloudflare Credentials

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Cloudflare credentials:
   ```env
   VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
   VITE_CLOUDFLARE_CUSTOMER_CODE=your_customer_code_here
   ```

### 3. Getting Your Credentials

**Account ID:**
- Go to Cloudflare Dashboard → Right sidebar → Account ID

**API Token:**
- Go to Cloudflare Dashboard → My Profile → API Tokens
- Create Token → Custom Token
- Permissions: `Zone:Zone:Read`, `Zone:Stream:Edit`

**Customer Code:**
- Go to Cloudflare Dashboard → Stream → Settings
- Look for your customer subdomain: `customer-XXXXXX.cloudflarestream.com`
- The XXXXXX part is your customer code

### 4. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Creating a Live Input

1. Go to "Create Live Input" tab
2. Enter a name for your stream
3. Configure recording and security settings
4. Click "Create Live Input"
5. Copy the RTMPS URL and Stream Key for OBS

### Setting up OBS Studio

1. Open OBS Studio
2. Go to Settings → Stream
3. Service: Select "Custom..."
4. Server: Paste the RTMPS URL
5. Stream Key: Paste the Stream Key
6. Click OK and start streaming!

### Watching Streams

1. Go to "Watch Stream" tab
2. Enter a Live Input ID or Video ID
3. Choose player type (Cloudflare or HLS)
4. Click "Load Stream"

### Managing Live Inputs

1. Go to "Live Inputs" tab
2. View all your created live inputs
3. Copy streaming URLs and configuration
4. Delete inputs you no longer need

## API Endpoints Used

- `POST /live_inputs` - Create new live input
- `GET /live_inputs` - List all live inputs
- `GET /live_inputs/{id}` - Get specific live input
- `GET /live_inputs/{id}/videos` - Get videos for live input
- `DELETE /live_inputs/{id}` - Delete live input

## Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder contains the production build ready for deployment.

### Deploy to Hostinger

1. Build the project: `npm run build`
2. Upload contents of `dist` folder to your `public_html` directory
3. Make sure `.htaccess` file is included for proper MIME types

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure your API token has the correct permissions.

### Stream Not Loading
- Check that your customer code is correct
- Verify the live input is actually streaming
- Try refreshing the stream status

### OBS Connection Issues
- Verify RTMPS URL and stream key are correct
- Check your internet connection
- Try reducing bitrate in OBS settings

## License

MIT License

# Deployment Guide

## 🚀 Deploy to Hostinger

### Method 1: Git Deployment (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Cloudflare Stream Live Demo"
   git push origin main
   ```

3. **Deploy to Hostinger:**
   - Log into your Hostinger control panel
   - Navigate to your domain's `public_html` folder
   - If Hostinger supports Git integration:
     - Connect your GitHub repository
     - Set deployment source to `dist` folder
   - If manual deployment:
     - Download/clone the repository
     - Upload contents of `dist` folder to `public_html`

### Method 2: Manual Upload

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Copy all files from `dist` folder
   - Upload to your Hostinger `public_html` directory
   - Ensure `.htaccess` file is included

### Required Files for Deployment

From the `dist` folder, upload:
- `index.html` (main page)
- `assets/` folder (contains JS and CSS)
- `.htaccess` (for proper MIME types)

## 🔧 Environment Variables for Production

Create a `.env` file with your actual Cloudflare credentials:

```env
VITE_CLOUDFLARE_ACCOUNT_ID=your_actual_account_id
VITE_CLOUDFLARE_API_TOKEN=your_actual_api_token
VITE_CLOUDFLARE_CUSTOMER_CODE=your_actual_customer_code
```

**Important:** Rebuild after changing environment variables:
```bash
npm run build
```

## 🌐 Domain Configuration

1. **Point your domain to Hostinger**
2. **Ensure SSL is enabled**
3. **Test the deployment at your domain**

## 🔍 Troubleshooting

### Common Issues:

1. **Blank page:** Check browser console for errors
2. **API errors:** Verify Cloudflare credentials
3. **MIME type errors:** Ensure `.htaccess` is uploaded
4. **CORS issues:** Check API token permissions

### Testing Checklist:

- [ ] Page loads without errors
- [ ] All three tabs are functional
- [ ] Environment variables are configured
- [ ] Cloudflare API connection works
- [ ] Stream creation and viewing work

## 📱 Mobile Compatibility

The app is responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablets

## 🔒 Security Notes

- API tokens are exposed in client-side code
- Use tokens with minimal required permissions
- Consider implementing a backend proxy for production
- Regularly rotate API tokens

## 📊 Performance

- Built with Vite for optimal loading
- Gzipped assets for faster delivery
- Lazy loading for better performance
- Optimized for modern browsers

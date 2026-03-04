# Deployment Guide

## Quick Deployment Options

### Option 1: Deploy to Render (Recommended)

#### Backend Deployment

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Select the root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_random_secret_key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

4. **Deploy** - Render will automatically deploy your backend

#### Frontend Deployment

1. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Navigate to client folder: `cd client`
   - Run: `vercel`
   - Follow prompts

2. **Update Backend URL**
   - In `client/src/context/AuthContext.jsx` and `client/src/context/SocketContext.jsx`
   - Replace `http://localhost:5000` with your Render backend URL

### Option 2: Deploy to Railway

1. **Create Railway account** at https://railway.app

2. **New Project → Deploy from GitHub**

3. **Add MongoDB Plugin**
   - Click "New" → "Database" → "MongoDB"
   - Copy connection string

4. **Configure Environment Variables** (same as above)

5. **Deploy** - Railway handles the rest

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set CLIENT_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## MongoDB Atlas Setup

1. **Create Account** at https://www.mongodb.com/cloud/atlas

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users

3. **Database Access**
   - Create database user
   - Save username and password

4. **Network Access**
   - Add IP: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

## Email Configuration (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Use in Environment Variables**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured
- [ ] Gmail App Password generated
- [ ] All environment variables set
- [ ] JWT_SECRET is strong and random
- [ ] CLIENT_URL points to production frontend
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Socket.io connection working
- [ ] Email notifications working
- [ ] Test all user roles
- [ ] Test approval workflow
- [ ] Test venue booking

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-cms
JWT_SECRET=generate_random_string_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (Update in code)
- Update API base URL in axios configuration
- Update Socket.io connection URL

## Post-Deployment

1. **Seed Database**
   ```bash
   # Connect to your production database
   node server/seed.js
   ```

2. **Test Login**
   - Try logging in with test accounts
   - Verify all roles work

3. **Test Workflow**
   - Create event as student
   - Approve as faculty
   - Approve as HOD
   - Approve as ABC
   - Final approve as Super Admin

4. **Monitor Logs**
   - Check backend logs for errors
   - Monitor email delivery
   - Check Socket.io connections

## Troubleshooting

### CORS Errors
- Ensure CLIENT_URL is set correctly
- Check CORS configuration in `server/index.js`

### Database Connection Failed
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure database user has correct permissions

### Emails Not Sending
- Verify Gmail App Password
- Check EMAIL_HOST and EMAIL_PORT
- Ensure 2FA is enabled

### Socket.io Not Connecting
- Check CLIENT_URL in backend
- Verify Socket.io URL in frontend
- Check CORS settings

## Security Best Practices

1. **Strong JWT Secret**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Environment Variables**
   - Never commit `.env` file
   - Use platform-specific secret management

3. **Database Security**
   - Use strong database passwords
   - Limit network access
   - Regular backups

4. **Rate Limiting**
   - Consider adding rate limiting middleware
   - Protect against brute force attacks

5. **HTTPS**
   - Always use HTTPS in production
   - Most platforms provide this automatically

## Scaling Considerations

- Use Redis for Socket.io scaling
- Implement caching for frequently accessed data
- Add database indexes for better performance
- Consider CDN for static assets
- Monitor application performance

## Support

For issues or questions:
- Check logs first
- Review environment variables
- Test locally before deploying
- Check platform-specific documentation

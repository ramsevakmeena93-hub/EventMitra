# Quick Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher) installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed
- A Gmail account (for email notifications)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-cms
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Setup Gmail for Email Notifications

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
4. Use this password in `EMAIL_PASS` in your `.env` file

### 4. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On Windows:
net start MongoDB

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI` in `.env`

### 5. Seed Database

```bash
node server/seed.js
```

This creates:
- Test users for all roles
- Sample venues

### 6. Start the Application

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 7. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

### 8. Login with Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | password123 |
| Faculty | faculty@test.com | password123 |
| HOD | hod@test.com | password123 |
| ABC | abc@test.com | password123 |
| Dean | dean@test.com | password123 |
| Registrar | registrar@test.com | password123 |

## Testing the Workflow

1. **Login as Student** (student@test.com)
   - Go to "Apply Event"
   - Fill the form and submit

2. **Login as Faculty** (faculty@test.com)
   - Check dashboard for pending approval
   - Approve the event

3. **Login as HOD** (hod@test.com)
   - Check dashboard for pending approval
   - Approve the event

4. **Login as ABC** (abc@test.com)
   - Check dashboard for pending approval
   - Select a Super Admin
   - Approve the event

5. **Login as Dean** (dean@test.com)
   - Check dashboard for pending approval
   - Give final approval

6. **Login back as Student**
   - Check event status (should be "APPROVED")
   - View timeline

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, check network access settings

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2FA is enabled
- Try with a different Gmail account

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

cd client
rm -rf node_modules
npm install
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Nodemon restarts server on file changes

### Database GUI
Use MongoDB Compass to view your database:
- Download: https://www.mongodb.com/products/compass
- Connect with your MongoDB URI

### API Testing
Use Postman or Thunder Client to test APIs:
- Import the API endpoints
- Test authentication
- Test event creation and approval

### Debugging
- Backend logs appear in the terminal running `npm run server`
- Frontend logs appear in browser console (F12)
- Check Network tab for API calls

## Next Steps

1. **Customize Venues**
   - Add more venues via seed script
   - Or create them through the application

2. **Add More Users**
   - Register new users with different roles
   - Test with multiple faculty/HODs

3. **Customize Email Templates**
   - Edit `server/utils/email.js`
   - Modify email content and styling

4. **Theme Customization**
   - Edit `client/tailwind.config.js`
   - Modify colors and styles

5. **Deploy to Production**
   - Follow `DEPLOYMENT.md` guide
   - Setup production database
   - Configure production environment variables

## Project Structure

```
college-cms/
├── server/              # Backend code
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── utils/          # Utilities (email, socket)
│   └── index.js        # Server entry point
├── client/             # Frontend code
│   └── src/
│       ├── components/ # React components
│       ├── context/    # Context providers
│       ├── pages/      # Page components
│       └── App.jsx     # Main app component
├── package.json        # Backend dependencies
├── .env               # Environment variables
└── README.md          # Documentation
```

## Getting Help

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for production setup
- Check console logs for errors
- Verify environment variables are set correctly

## Success Checklist

- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] MongoDB running and connected
- [ ] Gmail App Password configured
- [ ] Database seeded
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can login with test accounts
- [ ] Can create and approve events
- [ ] Email notifications working
- [ ] Real-time updates working

Congratulations! Your College CMS is now running! 🎉

# College Classroom Management System (CMS)

> 🎉 **PROJECT STATUS: COMPLETE & READY TO RUN!**

A full-stack web application for managing classroom event bookings and approvals in a college environment with multi-level approval workflow.

## 🚀 Quick Start

**New here?** Start with one of these:
- 👉 **[START_HERE.md](START_HERE.md)** - Choose your path
- ⚡ **[GET_STARTED.md](GET_STARTED.md)** - 5-minute quick start
- 📖 **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide

**Already set up?** Run the app:
```bash
npm run dev
```

---

## Features

- **Multi-Level Approval Workflow**: Faculty → HOD → ABC → Super Admin
- **Real-Time Notifications**: Socket.io for instant updates
- **Email Notifications**: Automated emails at each approval stage
- **Venue Availability Checking**: Prevent double bookings
- **Calendar View**: Visual representation of bookings
- **Role-Based Dashboards**: Custom views for each user role
- **Event Modification**: ABC can modify event details
- **Timeline Tracking**: Track approval progress in real-time
- **Light/Dark Theme**: Toggle between themes
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Socket.io Client
- Axios
- React Calendar
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Nodemailer
- Bcrypt

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd college-cms
```

2. **Install server dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

4. **Environment Configuration**

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-cms
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Email Setup (Gmail)**:
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use the generated password in `EMAIL_PASS`

5. **Seed Database**

```bash
node server/seed.js
```

This creates test accounts and venues.

## Running the Application

### Development Mode

**Option 1: Run both servers concurrently**
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

### Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Test Accounts

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | password123 |
| Faculty | faculty@test.com | password123 |
| HOD | hod@test.com | password123 |
| ABC | abc@test.com | password123 |
| Dean | dean@test.com | password123 |
| Registrar | registrar@test.com | password123 |

## User Roles

### Student
- Apply for events
- Select venue, date, time, and faculty
- Track approval status
- Accept/reject modifications
- View timeline

### Faculty
- Review student applications
- Approve/reject events
- View all assigned events

### HOD (Head of Department)
- Review faculty-approved events
- Approve/reject events
- Forward to ABC

### ABC (Admin Block Coordinator)
- Review HOD-approved events
- Approve/reject/modify events
- Select super admin for final approval
- Modify date/time/venue

### Super Admin (Dean/Registrar)
- Final approval authority
- View calendar of all events
- System-wide statistics
- Approve/reject events

## Approval Workflow

1. **Student** submits event application
2. **Faculty** reviews and approves/rejects
3. **HOD** reviews and approves/rejects
4. **ABC** reviews and can:
   - Approve and forward to Super Admin
   - Reject
   - Modify (sends back to student for acceptance)
5. **Super Admin** gives final approval
6. Event is **APPROVED** and confirmed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `POST /api/events/create` - Create event (Student)
- `POST /api/events/check-availability` - Check venue availability
- `GET /api/events/my-events` - Get user's events
- `GET /api/events/pending` - Get pending approvals
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/approve` - Approve event
- `POST /api/events/:id/reject` - Reject event
- `POST /api/events/:id/modify` - Modify event (ABC)
- `POST /api/events/:id/accept-modification` - Accept modification (Student)

### Venues
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create venue (Admin)

### Users
- `GET /api/users/faculty` - Get faculty list
- `GET /api/users/hods` - Get HOD list
- `GET /api/users/abc` - Get ABC list
- `GET /api/users/superadmins` - Get super admin list

### Dashboard
- `GET /api/dashboard/stats` - Get role-based statistics

### Calendar
- `GET /api/calendar` - Get calendar events

## Project Structure

```
college-cms/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Venue.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── venues.js
│   │   ├── users.js
│   │   ├── dashboard.js
│   │   └── calendar.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── email.js
│   │   └── socket.js
│   ├── index.js
│   └── seed.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboards/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventTimeline.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ApplyEvent.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Developer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── package.json
├── .env.example
└── README.md
```

## Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, Render, or DigitalOcean
- Set environment variables
- Ensure MongoDB connection string is correct

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or serve from Express

### Environment Variables for Production
- Update `MONGODB_URI` with production database
- Change `JWT_SECRET` to a strong random string
- Update `CLIENT_URL` to production frontend URL
- Configure email credentials

## Features in Detail

### Venue Availability
- Real-time checking before submission
- Prevents double bookings
- Shows available/booked status

### Email Notifications
- Event submission confirmation
- Approval notifications
- Rejection notifications with reason
- Modification notifications

### Real-Time Updates
- Socket.io integration
- Instant dashboard updates
- Live notification popups

### Timeline Tracking
- Visual approval progress
- Shows all approval stages
- Displays timestamps and approvers

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`

### Email Not Sending
- Verify Gmail App Password
- Check EMAIL_HOST and EMAIL_PORT
- Ensure 2FA is enabled on Gmail

### Socket.io Connection Issues
- Check CORS settings
- Verify CLIENT_URL in `.env`
- Ensure both servers are running

## License

MIT

## Developer

Built with ❤️ for college event management

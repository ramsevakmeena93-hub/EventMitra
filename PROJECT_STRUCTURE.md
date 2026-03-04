# College CMS - Complete Project Structure

## Overview

This is a production-ready, full-stack College Classroom Management System with:
- Multi-level approval workflow
- Real-time notifications
- Email integration
- Calendar management
- Role-based access control

## Complete File Structure

```
college-cms/
│
├── server/                          # Backend Node.js/Express
│   ├── models/                      # Mongoose Models
│   │   ├── User.js                  # User model (Student, Faculty, HOD, ABC, SuperAdmin)
│   │   ├── Event.js                 # Event model with approval workflow
│   │   └── Venue.js                 # Venue model
│   │
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # Authentication (login, register, me)
│   │   ├── events.js                # Event CRUD and approval operations
│   │   ├── venues.js                # Venue management
│   │   ├── users.js                 # User listings (faculty, HOD, etc.)
│   │   ├── dashboard.js             # Dashboard statistics
│   │   └── calendar.js              # Calendar events
│   │
│   ├── middleware/                  # Express Middleware
│   │   └── auth.js                  # JWT authentication & authorization
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── email.js                 # Nodemailer email service
│   │   └── socket.js                # Socket.io helper functions
│   │
│   ├── index.js                     # Server entry point
│   └── seed.js                      # Database seeding script
│
├── client/                          # Frontend React/Vite
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── dashboards/          # Role-specific dashboards
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── FacultyDashboard.jsx
│   │   │   │   ├── HODDashboard.jsx
│   │   │   │   ├── ABCDashboard.jsx
│   │   │   │   └── SuperAdminDashboard.jsx
│   │   │   │
│   │   │   ├── EventCard.jsx        # Event display card
│   │   │   ├── EventTimeline.jsx    # Approval timeline
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── PrivateRoute.jsx     # Protected route wrapper
│   │   │
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── ThemeContext.jsx     # Light/Dark theme
│   │   │   └── SocketContext.jsx    # Socket.io connection
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── ApplyEvent.jsx       # Event application form
│   │   │   ├── Dashboard.jsx        # Dashboard router
│   │   │   └── Developer.jsx        # Developer info page
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   │
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── postcss.config.js            # PostCSS configuration
│
├── package.json                     # Backend dependencies
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
├── SETUP.md                         # Setup instructions
├── DEPLOYMENT.md                    # Deployment guide
└── PROJECT_STRUCTURE.md             # This file
```

## Key Features by File

### Backend

#### Models
- **User.js**: 5 roles (student, faculty, hod, abc, superadmin), password hashing, validation
- **Event.js**: Complete approval workflow, history tracking, modification support
- **Venue.js**: Building types, capacity, facilities, HOD department mapping

#### Routes
- **auth.js**: JWT-based authentication, registration, login, current user
- **events.js**: 
  - Create event with availability check
  - Multi-level approval (faculty → HOD → ABC → superadmin)
  - Rejection with reason
  - Modification by ABC
  - Student acceptance of modifications
  - Event listing by role
- **venues.js**: CRUD operations for venues
- **users.js**: Get lists of faculty, HODs, ABCs, super admins
- **dashboard.js**: Role-specific statistics
- **calendar.js**: Calendar view with date filtering

#### Middleware
- **auth.js**: JWT verification, role-based authorization

#### Utils
- **email.js**: 
  - Nodemailer configuration
  - Email templates for all scenarios
  - Submission, approval, rejection, modification emails
- **socket.js**: Real-time event updates, notifications

### Frontend

#### Components
- **EventCard.jsx**: Reusable event display with action buttons
- **EventTimeline.jsx**: Visual approval progress tracker
- **Navbar.jsx**: Responsive navigation with theme toggle
- **PrivateRoute.jsx**: Protected route wrapper

#### Dashboards
Each role has a custom dashboard:
- **StudentDashboard**: View events, accept modifications, timeline
- **FacultyDashboard**: Pending approvals, approve/reject
- **HODDashboard**: Pending approvals, approve/reject
- **ABCDashboard**: Approve/modify/reject, select super admin
- **SuperAdminDashboard**: Final approval, calendar view, system stats

#### Context
- **AuthContext**: Login, logout, user state, token management
- **ThemeContext**: Light/dark mode toggle, localStorage persistence
- **SocketContext**: Real-time connection, event updates, notifications

#### Pages
- **Home**: Landing page with features
- **Login/Register**: Authentication forms
- **ApplyEvent**: Event application form with availability check
- **Dashboard**: Role-based dashboard router
- **Developer**: Project information

## Data Flow

### Event Creation Flow
```
Student fills form
    ↓
Check venue availability
    ↓
Create event (status: pending_faculty)
    ↓
Email to student (confirmation)
    ↓
Email to faculty (pending approval)
    ↓
Socket notification to faculty
```

### Approval Flow
```
Faculty approves
    ↓
Status: pending_hod
    ↓
Email to student & HOD
    ↓
HOD approves
    ↓
Status: pending_abc
    ↓
Email to student & ABC
    ↓
ABC approves + selects super admin
    ↓
Status: pending_superadmin
    ↓
Email to student & super admin
    ↓
Super admin approves
    ↓
Status: approved (FINAL)
    ↓
Email to student (final approval)
```

### Modification Flow
```
ABC modifies event
    ↓
Status: modification_pending
    ↓
Email to student with changes
    ↓
Student accepts
    ↓
Apply modifications
    ↓
Reset to pending_faculty
    ↓
Restart approval workflow
```

### Rejection Flow
```
Any approver rejects
    ↓
Status: rejected
    ↓
Store rejection reason
    ↓
Email to student with reason
    ↓
Socket notification
    ↓
End workflow
```

## API Endpoints Summary

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Events
- POST `/api/events/create` - Create event
- POST `/api/events/check-availability` - Check availability
- GET `/api/events/my-events` - Get user's events
- GET `/api/events/pending` - Get pending approvals
- GET `/api/events/:id` - Get event details
- POST `/api/events/:id/approve` - Approve event
- POST `/api/events/:id/reject` - Reject event
- POST `/api/events/:id/modify` - Modify event
- POST `/api/events/:id/accept-modification` - Accept modification

### Venues
- GET `/api/venues` - List venues
- POST `/api/venues` - Create venue

### Users
- GET `/api/users/faculty` - List faculty
- GET `/api/users/hods` - List HODs
- GET `/api/users/abc` - List ABCs
- GET `/api/users/superadmins` - List super admins

### Dashboard & Calendar
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/calendar` - Get calendar events

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum [student, faculty, hod, abc, superadmin],
  department: String (for faculty/hod),
  branch: String (for student),
  enrollmentNo: String (for student, unique),
  isActive: Boolean,
  timestamps
}
```

### Events Collection
```javascript
{
  studentId: ObjectId (ref: User),
  studentName: String,
  branch: String,
  enrollmentNo: String,
  facultyId: ObjectId (ref: User),
  hodId: ObjectId (ref: User),
  abcId: ObjectId (ref: User),
  superAdminId: ObjectId (ref: User),
  venueId: ObjectId (ref: Venue),
  date: Date,
  time: String,
  reason: String,
  status: Enum [pending_faculty, pending_hod, pending_abc, pending_superadmin, approved, rejected, modification_pending],
  currentApprover: Enum [faculty, hod, abc, superadmin, student],
  rejectionReason: String,
  history: [{
    action: Enum [submitted, approved, rejected, modified],
    role: String,
    userId: ObjectId,
    userName: String,
    reason: String,
    timestamp: Date,
    modifications: {
      date: Date,
      time: String,
      venue: ObjectId
    }
  }],
  modificationAccepted: Boolean,
  timestamps
}
```

### Venues Collection
```javascript
{
  name: String,
  building: Enum [old, new, other],
  room: String,
  capacity: Number,
  facilities: [String],
  hodDepartment: String,
  isActive: Boolean,
  timestamps
}
```

## Technology Stack Details

### Backend Dependencies
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "cors": "CORS middleware",
  "dotenv": "Environment variables",
  "nodemailer": "Email service",
  "socket.io": "Real-time communication",
  "express-validator": "Input validation"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-dom": "React DOM",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "socket.io-client": "Socket.io client",
  "react-calendar": "Calendar component",
  "react-hot-toast": "Toast notifications",
  "lucide-react": "Icons",
  "tailwindcss": "CSS framework"
}
```

## Security Features

1. **Authentication**: JWT-based with httpOnly cookies option
2. **Authorization**: Role-based access control
3. **Password Security**: Bcrypt hashing with salt
4. **Input Validation**: Express-validator
5. **CORS**: Configured for specific origins
6. **Environment Variables**: Sensitive data in .env

## Real-Time Features

1. **Socket.io Integration**: Bidirectional communication
2. **Event Updates**: Live dashboard updates
3. **Notifications**: Instant popup notifications
4. **User Rooms**: Each user joins their own room
5. **Event Broadcasting**: Updates sent to relevant users

## Email Notifications

1. **Event Submission**: Confirmation to student
2. **Pending Approval**: Notification to next approver
3. **Approval**: Confirmation to student
4. **Rejection**: Reason sent to student
5. **Modification**: Details sent to student
6. **Final Approval**: Celebration email

## Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Responsive navigation
- Adaptive layouts
- Touch-friendly interfaces

## Theme Support

- Light mode (default)
- Dark mode
- System preference detection
- LocalStorage persistence
- Smooth transitions

## Testing Accounts

After seeding:
- student@test.com / password123
- faculty@test.com / password123
- hod@test.com / password123
- abc@test.com / password123
- dean@test.com / password123
- registrar@test.com / password123

## Performance Optimizations

1. **Database Indexes**: On frequently queried fields
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Debouncing**: For search and input fields
5. **Pagination**: For large data sets (ready to implement)

## Future Enhancements

- [ ] File upload for event documents
- [ ] SMS notifications
- [ ] Advanced calendar features
- [ ] Event analytics and reports
- [ ] Bulk operations
- [ ] Export to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced search and filters
- [ ] Audit logs

This is a complete, production-ready system ready for deployment!

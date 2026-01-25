# Salon Management System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Models](#database-models)
5. [API Routes](#api-routes)
6. [Admin Dashboard Pages](#admin-dashboard-pages)
7. [Public Website Pages](#public-website-pages)
8. [Components](#components)
9. [Authentication & Authorization](#authentication--authorization)
10. [Features](#features)
11. [Environment Variables](#environment-variables)
12. [Setup Instructions](#setup-instructions)
13. [Deployment](#deployment)
14. [File Upload System](#file-upload-system)
15. [Color Scheme & Typography](#color-scheme--typography)

---

## Project Overview

**Ishfaq Mens Salon** is a comprehensive salon management system built as a single Next.js application. It provides:

- **Public Website**: Customer-facing website for browsing services, viewing team, and booking appointments
- **Admin Dashboard**: Complete management system for salon operations including bookings, employees, sales, attendance, and reports

### Key Features
- Online appointment booking system
- Employee management with commission tracking
- Sales tracking and reporting
- Customer management
- Attendance tracking
- Daily summaries and analytics
- WhatsApp integration (mock)
- Logo and salon name customization
- Fully mobile-responsive design

---

## Technology Stack

### Frontend
- **Next.js 16.1.4** (App Router)
- **React 19.2.3**
- **Tailwind CSS 4** - Utility-first CSS framework
- **JavaScript/JSX** (No TypeScript)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose 9.1.5** - MongoDB object modeling

### Authentication
- **NextAuth.js v5 (beta.30)** - Authentication and session management
- **bcryptjs 3.0.3** - Password hashing

### Utilities
- **date-fns 4.1.0** - Date manipulation and formatting
- **dotenv 17.2.3** - Environment variable management

### Fonts
- **Comfortaa** - Headings
- **Nunito** - Body text
- **Ubuntu** - UI elements (buttons, forms)

---

## Project Structure

```
salooooon/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public website routes
│   │   │   ├── layout.js          # Public layout with Header/Footer
│   │   │   ├── page.js            # Homepage
│   │   │   ├── about/
│   │   │   ├── book/              # Booking page
│   │   │   ├── contact/
│   │   │   ├── gallery/
│   │   │   ├── services/
│   │   │   └── team/
│   │   ├── admin/                 # Admin dashboard routes
│   │   │   ├── layout.js          # Admin layout with Sidebar
│   │   │   ├── dashboard/
│   │   │   ├── bookings/
│   │   │   ├── customers/
│   │   │   ├── employees/
│   │   │   ├── services/
│   │   │   ├── sales/
│   │   │   ├── attendance/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   ├── customers/
│   │   │   ├── employees/
│   │   │   ├── services/
│   │   │   ├── sales/
│   │   │   ├── attendance/
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── upload/
│   │   │   └── whatsapp/
│   │   ├── login/                 # Login page
│   │   ├── layout.js               # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── admin/                 # Admin components
│   │   │   ├── Sidebar.js
│   │   │   ├── PageHeader.js
│   │   │   ├── StatCard.js
│   │   │   ├── SettingsForms.js
│   │   │   └── ...
│   │   ├── public/                # Public components
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   └── ui/                    # Reusable UI components
│   │       └── Button.js
│   ├── lib/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── auth.js                 # NextAuth configuration
│   │   ├── auth-helpers.js        # Auth utility functions
│   │   └── utils.js               # General utilities
│   ├── models/                     # Mongoose models
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Customer.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   ├── Sale.js
│   │   ├── Attendance.js
│   │   ├── DailySummary.js
│   │   └── Settings.js
│   └── middleware.js              # Route protection middleware
├── public/
│   └── uploads/                   # Uploaded files
│       ├── employees/             # Employee images
│       └── logo/                  # Salon logos
├── scripts/
│   └── seed.js                    # Database seeding script
├── .env.local                     # Environment variables
├── package.json
└── PROJECT_DOCUMENTATION.md      # This file
```

---

## Database Models

### 1. User Model (`src/models/User.js`)
**Purpose**: Authentication and user management

**Fields**:
- `email` (String, required, unique) - User email
- `password` (String, required) - Hashed password
- `role` (String, enum: ['owner', 'staff'], default: 'staff')
- `name` (String, required)
- `phone` (String)
- `isActive` (Boolean, default: true)
- `timestamps` (createdAt, updatedAt)

**Indexes**:
- `email` (unique)
- `role`

---

### 2. Employee Model (`src/models/Employee.js`)
**Purpose**: Staff/employee management

**Fields**:
- `userId` (ObjectId, ref: 'User', optional) - Linked user account
- `name` (String, required)
- `phone` (String, required)
- `role` (String, enum: ['barber', 'stylist', 'receptionist', 'manager'])
- `commissionRate` (Number, 0-100, default: 0)
- `services` (Array of ObjectIds, ref: 'Service') - Services employee can perform
- `workingDays` (Array of Strings) - Days of week employee works
- `status` (String, enum: ['active', 'inactive'], default: 'active')
- `joinedDate` (Date, default: Date.now)
- `imageUrl` (String, default: '/images/default-employee.png')
- `timestamps`

**Indexes**:
- `status`
- `userId`

---

### 3. Customer Model (`src/models/Customer.js`)
**Purpose**: Customer information management

**Fields**:
- `name` (String, required)
- `phone` (String, required, unique)
- `email` (String, optional)
- `address` (String, optional)
- `notes` (String, optional)
- `lastVisitDate` (Date, optional)
- `totalVisits` (Number, default: 0)
- `totalSpent` (Number, default: 0)
- `timestamps`

**Indexes**:
- `phone` (unique)

---

### 4. Service Model (`src/models/Service.js`)
**Purpose**: Salon services catalog

**Fields**:
- `name` (String, required, unique)
- `description` (String, optional)
- `price` (Number, required, min: 0)
- `duration` (Number, required, min: 1) - Duration in minutes
- `isActive` (Boolean, default: true)
- `timestamps`

**Indexes**:
- `name` (unique)
- `isActive`

---

### 5. Booking Model (`src/models/Booking.js`)
**Purpose**: Appointment bookings

**Fields**:
- `customerId` (ObjectId, ref: 'Customer', optional) - Can be null for walk-ins
- `customerName` (String, required) - For walk-ins or non-registered customers
- `customerPhone` (String, required)
- `customerEmail` (String, optional)
- `serviceIds` (Array of ObjectIds, ref: 'Service', required)
- `employeeId` (ObjectId, ref: 'Employee', optional)
- `bookingDate` (Date, required)
- `bookingTime` (String, required) - Time in HH:mm format
- `status` (String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled')
- `totalPrice` (Number, required)
- `notes` (String, optional)
- `timestamps`

**Indexes**:
- `bookingDate`
- `status`
- `customerId`
- `employeeId`

---

### 6. Sale Model (`src/models/Sale.js`)
**Purpose**: Sales transactions

**Fields**:
- `customerId` (ObjectId, ref: 'Customer', optional)
- `customerName` (String, required)
- `customerPhone` (String, required)
- `bookingId` (ObjectId, ref: 'Booking', optional)
- `employeeId` (ObjectId, ref: 'Employee', optional)
- `serviceIds` (Array of ObjectIds, ref: 'Service')
- `saleDate` (Date, required, default: Date.now)
- `totalAmount` (Number, required, min: 0)
- `paymentMethod` (String, enum: ['cash', 'card', 'online'], default: 'cash')
- `commissionAmount` (Number, default: 0)
- `notes` (String, optional)
- `timestamps`

**Indexes**:
- `saleDate`
- `customerId`
- `employeeId`
- `paymentMethod`

---

### 7. Attendance Model (`src/models/Attendance.js`)
**Purpose**: Employee attendance tracking

**Fields**:
- `employeeId` (ObjectId, ref: 'Employee', required)
- `date` (Date, required)
- `checkInTime` (Date, optional)
- `checkOutTime` (Date, optional)
- `status` (String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present')
- `notes` (String, optional)
- `timestamps`

**Indexes**:
- `employeeId`
- `date`
- Compound: `{ employeeId: 1, date: 1 }` (unique)

---

### 8. DailySummary Model (`src/models/DailySummary.js`)
**Purpose**: Daily business summaries

**Fields**:
- `summaryDate` (Date, required, unique)
- `totalBookings` (Number, default: 0)
- `completedBookings` (Number, default: 0)
- `cancelledBookings` (Number, default: 0)
- `totalRevenue` (Number, default: 0)
- `totalSales` (Number, default: 0)
- `cashSales` (Number, default: 0)
- `cardSales` (Number, default: 0)
- `onlineSales` (Number, default: 0)
- `totalCommission` (Number, default: 0)
- `newCustomers` (Number, default: 0)
- `notes` (String, optional)
- `timestamps`

**Indexes**:
- `summaryDate` (unique)

---

### 9. Settings Model (`src/models/Settings.js`)
**Purpose**: Salon configuration and settings

**Fields**:
- `salonName` (String, default: 'Ishfaq Mens Salon')
- `salonAddress` (String, default: '')
- `salonPhone` (String, default: '+92 300 1234567')
- `logo` (String, default: '') - Logo image URL
- `openingTime` (String, default: '09:00')
- `closingTime` (String, default: '18:00')
- `closedDays` (Array of Strings) - Days salon is closed
- `whatsappNumber` (String, default: '+92 300 1234567')
- `defaultCommissionRate` (Number, 0-100, default: 20)
- `timestamps`

**Static Methods**:
- `getSettings()` - Ensures only one settings document exists

---

## API Routes

### Authentication
- **POST** `/api/auth/[...nextauth]` - NextAuth authentication handler

### Bookings
- **GET** `/api/bookings` - Get bookings (with filters: date, status, employeeId)
- **POST** `/api/bookings` - Create new booking
- **GET** `/api/bookings/[id]` - Get single booking
- **PUT** `/api/bookings/[id]` - Update booking
- **GET** `/api/bookings/available-slots` - Get available time slots for a date

### Customers
- **GET** `/api/customers` - Get all customers
- **POST** `/api/customers` - Create new customer
- **GET** `/api/customers/[id]` - Get single customer
- **GET** `/api/customers/due-for-reminder` - Get customers due for reminder

### Employees
- **GET** `/api/employees` - Get employees (with filters: status, serviceId)
- **POST** `/api/employees` - Create new employee
- **GET** `/api/employees/[id]` - Get single employee
- **PUT** `/api/employees/[id]` - Update employee
- **GET** `/api/employees/[id]/earnings` - Get employee earnings

### Services
- **GET** `/api/services` - Get services (with filter: activeOnly)
- **POST** `/api/services` - Create new service
- **GET** `/api/services/[id]` - Get single service
- **PUT** `/api/services/[id]` - Update service

### Sales
- **GET** `/api/sales` - Get sales (with filters: date, employeeId, paymentMethod)
- **POST** `/api/sales` - Create new sale
- **GET** `/api/sales/daily-summary` - Get daily sales summary
- **GET** `/api/sales/employee-earnings` - Get employee earnings summary

### Attendance
- **GET** `/api/attendance` - Get attendance records (with filters: date, employeeId)
- **POST** `/api/attendance` - Create/update attendance record

### Dashboard
- **GET** `/api/dashboard/overview` - Get dashboard overview statistics

### Reports
- **GET** `/api/reports/daily` - Get daily report data

### Settings
- **GET** `/api/settings` - Get salon settings (admin only)
- **PUT** `/api/settings` - Update salon settings (admin only)
- **GET** `/api/settings/public` - Get public settings (name, logo) - No auth required

### Uploads
- **POST** `/api/upload/employee-image` - Upload employee image
- **POST** `/api/upload/logo` - Upload salon logo

### WhatsApp (Mock)
- **POST** `/api/whatsapp/send-booking-confirmation` - Send booking confirmation
- **POST** `/api/whatsapp/send-reminder` - Send appointment reminder
- **POST** `/api/whatsapp/send-daily-summary` - Send daily summary

### Daily Summary
- **POST** `/api/daily-summary` - Create/update daily summary

---

## Admin Dashboard Pages

### 1. Dashboard (`/admin/dashboard`)
**Purpose**: Overview of salon operations

**Features**:
- Key statistics cards (today's bookings, revenue, customers, employees)
- Recent bookings list
- Revenue chart (daily/weekly/monthly)
- Quick actions

**Components Used**:
- `StatCard`
- `PageHeader`

---

### 2. Bookings (`/admin/bookings`)
**Purpose**: Manage appointments

**Features**:
- View all bookings with filters (date, status)
- Create new booking
- Update booking status
- View booking details
- Cancel bookings
- Mark as completed/no-show

**Filters**:
- Date picker
- Status filter (scheduled, completed, cancelled, no-show)

---

### 3. Customers (`/admin/customers`)
**Purpose**: Customer management

**Features**:
- View all customers
- Search customers
- View customer details
- Customer history (bookings, sales)
- Add new customer
- Edit customer information

**Customer Details Page** (`/admin/customers/[id]`):
- Customer information
- Booking history
- Purchase history
- Total visits and spending

---

### 4. Employees (`/admin/employees`)
**Purpose**: Staff management

**Features**:
- View all employees
- Add new employee
- Edit employee details
- View employee profile
- Manage employee services
- Set commission rates
- Upload employee images
- Activate/deactivate employees

**Pages**:
- `/admin/employees` - List all employees
- `/admin/employees/add` - Add new employee
- `/admin/employees/[id]` - Employee details
- `/admin/employees/[id]/edit` - Edit employee

---

### 5. Services (`/admin/services`)
**Purpose**: Service catalog management

**Features**:
- View all services
- Add new service
- Edit service details
- Activate/deactivate services
- Set prices and durations

---

### 6. Sales (`/admin/sales`)
**Purpose**: Sales tracking

**Features**:
- View all sales
- Record new sale (walk-in)
- Filter by date, employee, payment method
- View sale details
- Calculate commissions

**Features**:
- Daily sales summary
- Payment method breakdown
- Employee earnings

---

### 7. Attendance (`/admin/attendance`)
**Purpose**: Employee attendance tracking

**Features**:
- View attendance records
- Mark check-in/check-out
- View attendance by date
- View employee attendance history
- Mark absent/late/half-day

**Filters**:
- Date picker
- Employee filter

---

### 8. Reports (`/admin/reports`)
**Purpose**: Business analytics and reports

**Features**:
- Daily reports
- Revenue reports
- Employee performance
- Customer analytics
- Service popularity
- Export capabilities (future)

---

### 9. Settings (`/admin/settings`)
**Purpose**: Salon configuration

**Features**:
- Update salon name
- Upload/change logo
- Set working hours
- Configure closed days
- Set WhatsApp number
- Set default commission rate
- Update contact information

**Components Used**:
- `SettingsForms`

---

## Public Website Pages

### 1. Homepage (`/`)
**Purpose**: Landing page

**Sections**:
- Hero section with salon name and CTA
- Featured services (3 services)
- Featured team members (3 employees)
- Testimonials
- Call-to-action section

**Data Sources**:
- Services (active only)
- Employees (active only)
- Settings (salon name, logo)

---

### 2. Services (`/services`)
**Purpose**: Display all available services

**Features**:
- Grid layout of all active services
- Service details (name, description, price, duration)
- Book service button
- CTA section

---

### 3. Team (`/team`)
**Purpose**: Display salon team

**Features**:
- Grid layout of all active employees
- Employee images or initials
- Employee role and services
- Book with specific employee option
- CTA section

---

### 4. Book Appointment (`/book`)
**Purpose**: Online booking system

**Multi-step Form**:
1. **Step 1**: Select Services
   - Checkbox list of services
   - Shows price and duration
   - Calculates total

2. **Step 2**: Select Date & Time
   - Date picker
   - Available time slots
   - Filters based on selected services duration

3. **Step 3**: Select Staff (Optional)
   - Any available or specific employee
   - Shows employee images

4. **Step 4**: Contact Information
   - Name (required)
   - Phone (required)
   - Email (optional)
   - Notes (optional)

5. **Step 5**: Confirmation
   - Review booking details
   - Confirm booking
   - Success message with booking ID

**Features**:
- Step indicator
- Form validation
- Error handling
- Mobile-responsive design

---

### 5. About (`/about`)
**Purpose**: About the salon

**Sections**:
- Our Story
- Mission & Values
- Features grid (Quality, Expert Team, Hygiene, Fair Pricing)
- CTA section

---

### 6. Gallery (`/gallery`)
**Purpose**: Showcase salon work

**Features**:
- Image grid (placeholder currently)
- Hover effects
- Category filters (future)
- CTA section

---

### 7. Contact (`/contact`)
**Purpose**: Contact information and form

**Features**:
- Contact information cards (Phone, Email, Address)
- Contact form
- Business hours
- Map placeholder
- Form submission (mock)

---

## Components

### Admin Components (`src/components/admin/`)

#### Sidebar.js
- Navigation menu for admin dashboard
- Displays salon logo/name from settings
- Active route highlighting
- Mobile-responsive

#### PageHeader.js
- Page title and description
- Action buttons
- Breadcrumbs (optional)

#### StatCard.js
- Statistics display card
- Icon, title, value, change indicator
- Color variants

#### SettingsForms.js
- Salon settings form
- Logo upload
- Working hours configuration
- Form validation

### Public Components (`src/components/public/`)

#### Header.js
- Navigation bar
- Salon logo/name (from settings)
- Mobile menu
- Scroll effects
- Fixed positioning

#### Footer.js
- Footer with multiple sections
- Quick links
- Contact information
- Social media links
- Copyright

### UI Components (`src/components/ui/`)

#### Button.js
- Reusable button component
- Variants (primary, secondary)
- Loading states
- Disabled states
- Full-width option

---

## Authentication & Authorization

### Authentication System
- **NextAuth.js v5** with Credentials provider
- JWT session strategy
- Password hashing with bcryptjs

### User Roles
1. **Owner**: Full access to all features
2. **Staff**: Limited access (can be customized)

### Protected Routes
- All `/admin/*` routes require authentication
- Middleware (`middleware.js`) protects admin routes
- Unauthenticated users redirected to `/login`

### Auth Helpers (`src/lib/auth-helpers.js`)
- `getSession()` - Get current session
- `isAuthenticated()` - Check if user is authenticated
- `isOwner()` - Check if user is owner
- `isStaff()` - Check if user is staff
- `getCurrentUser()` - Get current user details
- `requireAuth()` - Require authentication (throws if not)
- `requireOwner()` - Require owner role (throws if not)

### Login Page (`/login`)
- Email and password form
- Error handling
- Redirects to admin dashboard on success

---

## Features

### Core Features

1. **Appointment Booking**
   - Multi-step booking form
   - Available time slot calculation
   - Service selection
   - Employee assignment
   - Booking confirmation

2. **Employee Management**
   - Employee profiles
   - Service assignments
   - Commission rates
   - Image uploads
   - Working days configuration

3. **Sales Tracking**
   - Record sales
   - Payment method tracking
   - Commission calculation
   - Daily summaries

4. **Customer Management**
   - Customer profiles
   - Booking history
   - Purchase history
   - Customer search

5. **Attendance Tracking**
   - Check-in/check-out
   - Attendance history
   - Status tracking (present, absent, late)

6. **Reports & Analytics**
   - Daily summaries
   - Revenue reports
   - Employee performance
   - Dashboard overview

7. **Settings Management**
   - Salon branding (name, logo)
   - Working hours
   - Default commission rates
   - Contact information

### Advanced Features

1. **Available Time Slots Calculation**
   - Considers existing bookings
   - Service duration
   - Working hours
   - Employee availability

2. **Commission Calculation**
   - Automatic commission calculation
   - Employee-specific rates
   - Daily commission summaries

3. **Daily Summaries**
   - Automatic summary generation
   - Revenue tracking
   - Booking statistics
   - Customer metrics

4. **WhatsApp Integration (Mock)**
   - Booking confirmations
   - Appointment reminders
   - Daily summaries

5. **File Uploads**
   - Employee images
   - Salon logos
   - File validation
   - Public URL generation

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/salon-management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-management

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

# Optional: Email configuration (if using email provider)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
```

### Generating NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

### Installation Steps

1. **Clone/Navigate to project directory**
   ```bash
   cd salooooon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create `.env.local` file
   - Add MongoDB URI and NextAuth secret (see Environment Variables section)

4. **Set up MongoDB**
   - Start MongoDB locally, or
   - Use MongoDB Atlas and update `MONGODB_URI`

5. **Seed initial data (optional)**
   ```bash
   npm run seed
   ```
   This creates an initial owner user:
   - Email: `owner@salon.com`
   - Password: `admin123` (change immediately!)

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Public website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
   - Login: `http://localhost:3000/login`

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

3. **Configure environment variables**
   - Add `MONGODB_URI`
   - Add `NEXTAUTH_URL` (your Vercel domain)
   - Add `NEXTAUTH_SECRET`

4. **Deploy**
   - Vercel will automatically deploy on push

### Other Deployment Options

- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean App Platform**
- **AWS Amplify**

### Important Notes for Deployment

1. **MongoDB**: Use MongoDB Atlas for production
2. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary) for production
3. **Environment Variables**: Never commit `.env.local` to Git
4. **NextAuth URL**: Update `NEXTAUTH_URL` to your production domain

---

## File Upload System

### Employee Images
- **Endpoint**: `POST /api/upload/employee-image`
- **Storage**: `public/uploads/employees/`
- **Format**: Any image format
- **Access**: Public URL `/uploads/employees/filename.jpg`

### Salon Logo
- **Endpoint**: `POST /api/upload/logo`
- **Storage**: `public/uploads/logo/`
- **Format**: Image files only
- **Max Size**: 2MB
- **Access**: Public URL `/uploads/logo/filename.jpg`

### File Naming
- Files are renamed with timestamp: `{timestamp}-{original-name}`
- Special characters are sanitized

---

## Color Scheme & Typography

### Color Palette

**Primary Colors**:
- Dark Charcoal: `#393E46`
- Slate Blue: `#929AAB`
- Light Grey: `#F7F7F7`
- Medium Grey: `#EEEEEE`
- White: `#FFFFFF`

**Status Colors**:
- Success: Background `#D1FAE5`, Text `#065F46`
- Warning: Background `#FEF3C7`, Text `#92400E`
- Error: Background `#FEE2E2`, Text `#7F1D1D`
- Info: Background `#DBEAFE`, Text `#0C4A6E`

**Accent Colors**:
- Amber: `#F59E0B`
- Blue: `#3B82F6`
- Green: `#10B981`
- Red: `#EF4444`

### Typography

**Font Families**:
- **Comfortaa**: Headings (h1-h6)
- **Nunito**: Body text, paragraphs
- **Ubuntu**: UI elements (buttons, forms)

**Font Weights**:
- Comfortaa: 300, 400, 500, 600, 700
- Nunito: 200-1000 (including italic)
- Ubuntu: 300, 400, 500, 700 (including italic)

**CSS Variables**:
- `--font-comfortaa`: Comfortaa font family
- `--font-nunito`: Nunito font family
- `--font-ubuntu`: Ubuntu font family

---

## Mobile Responsiveness

All pages are fully mobile-responsive with:
- Responsive grid layouts (1 col mobile, 2 tablet, 3+ desktop)
- Touch-friendly buttons (minimum 44px height)
- Responsive typography (scales with screen size)
- Mobile navigation menus
- Optimized forms for mobile input
- Proper text wrapping and overflow handling

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Database Indexes

All models have appropriate indexes for:
- Unique fields (email, phone, etc.)
- Frequently queried fields (date, status, etc.)
- Compound indexes for common query patterns

---

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **Route Protection**: Admin routes protected by middleware
3. **Input Validation**: All API endpoints validate input
4. **File Upload Validation**: File type and size validation
5. **Environment Variables**: Sensitive data stored in environment variables
6. **CORS**: Configured for production domains

---

## Future Enhancements

Potential features to add:
- Email notifications
- SMS integration
- Payment gateway integration
- Advanced reporting and analytics
- Customer loyalty program
- Inventory management
- Multi-location support
- Mobile app (React Native)
- Real-time notifications
- Calendar view for bookings
- Recurring appointments
- Customer reviews and ratings

---

## Support & Maintenance

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify `MONGODB_URI` in `.env.local`

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

3. **File Upload Errors**
   - Ensure `public/uploads/` directories exist
   - Check file permissions

4. **Build Errors**
   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

---

## License

This project is proprietary software for Ishfaq Mens Salon.

---

## Contact

For questions or support, contact the development team.

---

**Last Updated**: 2024
**Version**: 0.1.0
**Status**: Production Ready

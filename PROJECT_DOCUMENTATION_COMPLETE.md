# Ishfaq Mens Salon - Complete Project Documentation

**Version**: 2.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready  
**Framework**: Next.js 16.1.4 (App Router)  
**Database**: MongoDB with Mongoose

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Models & Schema](#database-models--schema)
6. [Modules & Features](#modules--features)
7. [Use Cases & Scenarios](#use-cases--scenarios)
8. [API Documentation](#api-documentation)
9. [User Interfaces](#user-interfaces)
10. [Workflows & Business Logic](#workflows--business-logic)
11. [Thermal Printer Compatibility](#thermal-printer-compatibility)
12. [File Upload System](#file-upload-system)
13. [Authentication & Security](#authentication--security)
14. [Mobile Responsiveness](#mobile-responsiveness)
15. [Deployment Guide](#deployment-guide)
16. [Environment Configuration](#environment-configuration)
17. [Troubleshooting](#troubleshooting)
18. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**Ishfaq Mens Salon Management System** is a comprehensive, full-stack web application designed to manage all aspects of a modern salon business. The system provides:

- **Public-facing website** for customer bookings and service discovery
- **Admin dashboard** for complete business management
- **Real-time booking system** with intelligent slot management
- **Sales tracking and reporting** with detailed analytics
- **Employee management** with commission tracking
- **Receipt generation** with thermal printer support
- **Mobile-responsive design** for all devices

---

## Project Overview

### Purpose
A complete salon management solution that streamlines operations, improves customer experience, and provides comprehensive business insights.

### Key Capabilities
- Online appointment booking system
- Walk-in customer management
- Employee scheduling and attendance tracking
- Sales and revenue tracking
- Commission calculation and management
- Customer relationship management
- Daily reports and analytics
- Receipt printing (thermal printer compatible)
- Image management (employee photos, service images, salon logo)
- WhatsApp integration (mock/ready for production)

### Target Users
1. **Salon Owners/Managers**: Full access to all features
2. **Staff Members**: Limited access based on role
3. **Customers**: Public website for booking appointments

---

## Technology Stack

### Frontend
- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **Tailwind CSS 4** - Utility-first styling
- **JavaScript/JSX** - Programming language (no TypeScript)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose 9.1.5** - ODM for MongoDB

### Authentication
- **NextAuth.js v5 (beta.30)** - Authentication framework
- **bcryptjs 3.0.3** - Password hashing

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **dotenv 17.2.3** - Environment variables
- **@vercel/blob 2.0.1** - File storage (Vercel Blob)

### Fonts
- **Comfortaa** - Headings
- **Nunito** - Body text
- **Ubuntu** - UI elements

---

## System Architecture

### Application Structure
```
salooooon/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public website routes
│   │   │   ├── layout.js          # Public layout (Header/Footer)
│   │   │   ├── page.js            # Homepage
│   │   │   ├── about/             # About page
│   │   │   ├── book/              # Booking system
│   │   │   │   ├── page.js        # Multi-step booking form
│   │   │   │   ├── confirmation/  # Booking confirmation
│   │   │   │   └── payment/       # Payment processing
│   │   │   ├── contact/           # Contact page
│   │   │   ├── gallery/           # Gallery page
│   │   │   ├── services/          # Services listing
│   │   │   └── team/              # Team/employees page
│   │   ├── admin/                 # Admin dashboard routes
│   │   │   ├── layout.js          # Admin layout (Sidebar)
│   │   │   ├── dashboard/         # Dashboard overview
│   │   │   ├── bookings/          # Booking management
│   │   │   │   └── [id]/          # Booking details
│   │   │   ├── customers/         # Customer management
│   │   │   │   └── [id]/          # Customer details
│   │   │   ├── employees/         # Employee management
│   │   │   │   ├── add/           # Add employee
│   │   │   │   ├── [id]/          # Employee details
│   │   │   │   └── [id]/edit/     # Edit employee
│   │   │   ├── services/          # Service management
│   │   │   ├── sales/             # Sales tracking
│   │   │   │   └── list/          # Sales list with receipts
│   │   │   ├── attendance/        # Attendance tracking
│   │   │   ├── reports/           # Reports & analytics
│   │   │   │   └── [date]/        # Detailed daily report
│   │   │   └── settings/          # System settings
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication
│   │   │   ├── bookings/         # Booking operations
│   │   │   ├── customers/        # Customer operations
│   │   │   ├── employees/        # Employee operations
│   │   │   ├── services/         # Service operations
│   │   │   ├── sales/            # Sales operations
│   │   │   ├── attendance/       # Attendance operations
│   │   │   ├── dashboard/        # Dashboard data
│   │   │   ├── reports/          # Report generation
│   │   │   ├── settings/         # Settings management
│   │   │   ├── upload/           # File uploads
│   │   │   ├── receipt/          # Receipt generation
│   │   │   └── whatsapp/         # WhatsApp integration
│   │   ├── login/                 # Login page
│   │   ├── layout.js              # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── admin/                 # Admin components
│   │   │   ├── Sidebar.js         # Navigation sidebar
│   │   │   ├── PageHeader.js      # Page header component
│   │   │   ├── StatCard.js        # Statistics card
│   │   │   ├── SettingsForms.js   # Settings form
│   │   │   ├── BookingActions.js  # Booking action buttons
│   │   │   ├── RescheduleModal.js # Reschedule booking modal
│   │   │   ├── Receipt.js         # Receipt component
│   │   │   ├── SalesListClient.js # Sales list (client-side)
│   │   │   ├── AddWalkInButton.js # Add walk-in sale button
│   │   │   ├── CloseDayButton.js  # Close day button
│   │   │   ├── EmployeeImage.js   # Employee image component
│   │   │   └── ServiceImage.js    # Service image component
│   │   ├── public/                # Public components
│   │   │   ├── Header.js          # Website header
│   │   │   └── Footer.js          # Website footer
│   │   └── ui/                    # Reusable UI components
│   │       └── Button.js          # Button component
│   ├── lib/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── auth.js                 # NextAuth configuration
│   │   ├── auth-helpers.js        # Auth utility functions
│   │   └── utils.js               # General utilities
│   ├── models/                     # Mongoose models
│   │   ├── User.js                # User/authentication model
│   │   ├── Employee.js            # Employee model
│   │   ├── Customer.js            # Customer model
│   │   ├── Service.js             # Service model
│   │   ├── Booking.js             # Booking model
│   │   ├── Sale.js                # Sale/transaction model
│   │   ├── Attendance.js          # Attendance model
│   │   ├── DailySummary.js        # Daily summary model
│   │   ├── Settings.js            # Settings model
│   │   └── WhatsAppLog.js         # WhatsApp log model
│   └── middleware.js              # Route protection
├── public/                         # Static assets
├── scripts/
│   └── seed.js                    # Database seeding
├── .env.local                     # Environment variables
├── package.json
└── PROJECT_DOCUMENTATION_COMPLETE.md
```

---

## Database Models & Schema

### 1. User Model (`src/models/User.js`)
**Purpose**: Authentication and user account management

**Schema**:
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  name: String (required),
  phone: String (optional),
  role: String (enum: ['owner', 'staff'], default: 'staff'),
  employeeId: ObjectId (ref: 'Employee', optional),
  timestamps: true
}
```

**Indexes**:
- `email` (unique)

**Methods**:
- `comparePassword(candidatePassword)` - Verify password

**Use Cases**:
- Admin login authentication
- Role-based access control
- Linking user accounts to employee profiles

---

### 2. Employee Model (`src/models/Employee.js`)
**Purpose**: Staff/employee management and profiles

**Schema**:
```javascript
{
  userId: ObjectId (ref: 'User', optional),
  name: String (required),
  phone: String (required),
  role: String (enum: ['barber', 'stylist', 'receptionist', 'manager']),
  commissionRate: Number (0-100, default: 0),
  services: [ObjectId] (ref: 'Service'),
  workingDays: [String] (enum: days of week),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  joinedDate: Date (default: Date.now),
  image: String (URL, default: ''),
  timestamps: true
}
```

**Indexes**:
- `status`
- `userId`

**Use Cases**:
- Employee profile management
- Service assignment
- Commission tracking
- Working schedule management
- Employee availability for bookings

---

### 3. Customer Model (`src/models/Customer.js`)
**Purpose**: Customer information and relationship management

**Schema**:
```javascript
{
  name: String (required),
  phone: String (required, unique),
  email: String (optional, lowercase),
  visitCount: Number (default: 0),
  lastVisit: Date (optional),
  preferredEmployee: ObjectId (ref: 'Employee', optional),
  notes: String (optional),
  isDue: Boolean (default: false),
  lastReminderSent: Date (optional),
  timestamps: true
}
```

**Indexes**:
- `phone` (unique)
- `isDue`
- `lastVisit`

**Methods**:
- `checkIfDue()` - Check if customer is due for reminder (25-30 days)

**Use Cases**:
- Customer profile management
- Visit history tracking
- Reminder system for repeat customers
- Preferred employee assignment

---

### 4. Service Model (`src/models/Service.js`)
**Purpose**: Salon services catalog

**Schema**:
```javascript
{
  name: String (required),
  description: String (optional),
  image: String (URL, optional),
  price: Number (required, min: 0),
  duration: Number (required, min: 15), // minutes
  isActive: Boolean (default: true),
  timestamps: true
}
```

**Indexes**:
- `isActive`

**Use Cases**:
- Service catalog management
- Pricing management
- Service duration for booking calculations
- Service images for public display

---

### 5. Booking Model (`src/models/Booking.js`)
**Purpose**: Appointment bookings management

**Schema**:
```javascript
{
  customerId: ObjectId (ref: 'Customer', required),
  serviceIds: [ObjectId] (ref: 'Service', required),
  employeeId: ObjectId (ref: 'Employee', optional),
  bookingDate: Date (required),
  bookingTime: String (required, format: HH:mm),
  status: String (enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled'),
  bookingType: String (enum: ['online', 'walk-in'], default: 'online'),
  notes: String (optional),
  paymentStatus: String (enum: ['pending', 'paid', 'failed'], default: 'pending'),
  advanceAmount: Number (default: 0),
  rescheduleCount: Number (default: 0, max: 2),
  rescheduledFrom: Date (optional),
  timestamps: true
}
```

**Indexes**:
- `bookingDate`
- `status`
- `customerId`
- `employeeId`

**Methods**:
- `getTotalDuration()` - Calculate total duration from services
- `getTotalPrice()` - Calculate total price from services

**Use Cases**:
- Online appointment booking
- Walk-in appointment creation
- Booking status management
- Rescheduling (max 2 times)
- Advance payment tracking

---

### 6. Sale Model (`src/models/Sale.js`)
**Purpose**: Sales transactions and revenue tracking

**Schema**:
```javascript
{
  bookingId: ObjectId (ref: 'Booking', optional),
  customerId: ObjectId (ref: 'Customer', required),
  employeeId: ObjectId (ref: 'Employee', required),
  amount: Number (required, min: 0),
  paymentMethod: String (enum: ['cash', 'online'], required),
  discountApplied: Number (default: 0, min: 0),
  finalAmount: Number (required, min: 0),
  saleDate: Date (required, default: Date.now),
  timestamps: true
}
```

**Indexes**:
- `saleDate`
- `employeeId`
- `customerId`
- `paymentMethod`

**Methods**:
- `getCommission()` - Calculate commission for employee

**Use Cases**:
- Recording sales transactions
- Payment method tracking
- Discount application
- Commission calculation
- Receipt generation

---

### 7. Attendance Model (`src/models/Attendance.js`)
**Purpose**: Employee attendance tracking

**Schema**:
```javascript
{
  employeeId: ObjectId (ref: 'Employee', required),
  date: Date (required),
  status: String (enum: ['present', 'absent', 'leave'], required),
  checkIn: Date (optional),
  checkOut: Date (optional),
  timestamps: true
}
```

**Indexes**:
- Compound: `{ employeeId: 1, date: 1 }` (unique)
- `date`

**Use Cases**:
- Daily attendance tracking
- Check-in/check-out recording
- Attendance history
- Payroll calculations

---

### 8. DailySummary Model (`src/models/DailySummary.js`)
**Purpose**: Daily business summaries and reports

**Schema**:
```javascript
{
  summaryDate: Date (required, unique),
  totalSales: Number (default: 0),
  cashSales: Number (default: 0),
  onlineSales: Number (default: 0),
  totalClients: Number (default: 0),
  topEarner: {
    employeeId: ObjectId (ref: 'Employee'),
    employeeName: String,
    earnings: Number
  },
  summaryData: String (optional),
  sentViaWhatsApp: Boolean (default: false),
  timestamps: true
}
```

**Indexes**:
- `summaryDate` (unique)

**Use Cases**:
- Daily business summaries
- Revenue tracking
- Top performer identification
- WhatsApp summary sending
- Historical reporting

---

### 9. Settings Model (`src/models/Settings.js`)
**Purpose**: Salon configuration and branding

**Schema**:
```javascript
{
  salonName: String (default: 'Ishfaq Mens Salon'),
  logo: String (URL, default: ''),
  salonAddress: String (default: ''),
  salonPhone: String (default: '+92 300 1234567'),
  openingTime: String (default: '09:00'),
  closingTime: String (default: '18:00'),
  closedDays: [String] (enum: days of week),
  whatsappNumber: String (default: '+92 300 1234567'),
  defaultCommissionRate: Number (0-100, default: 20),
  advancePaymentEnabled: Boolean (default: false),
  advancePercentage: Number (0-100, default: 50),
  timestamps: true
}
```

**Static Methods**:
- `getSettings()` - Ensures only one settings document exists

**Use Cases**:
- Salon branding (name, logo)
- Business hours configuration
- Contact information
- Default commission rates
- Payment settings

---

### 10. WhatsAppLog Model (`src/models/WhatsAppLog.js`)
**Purpose**: WhatsApp message logging

**Schema**:
```javascript
{
  type: String (enum: ['booking', 'reminder', 'summary']),
  recipient: String (phone number),
  message: String,
  status: String (enum: ['sent', 'failed', 'pending']),
  sentAt: Date,
  timestamps: true
}
```

**Use Cases**:
- Message tracking
- Delivery status
- Audit trail

---

## Modules & Features

### Module 1: Authentication & Authorization

**Features**:
- Email/password authentication
- Role-based access control (Owner/Staff)
- Session management with NextAuth.js
- Protected admin routes
- Password hashing with bcrypt

**Components**:
- Login page (`/login`)
- Auth middleware
- Session management

**Use Cases**:
- Admin login
- Session persistence
- Role-based feature access
- Secure logout

---

### Module 2: Booking Management

**Features**:
- Multi-step online booking form
- Available time slot calculation
- Service selection with pricing
- Employee assignment (optional)
- Booking confirmation
- Booking status management (scheduled, completed, cancelled, no-show)
- Rescheduling (max 2 times)
- Advance payment support
- Walk-in booking creation

**Components**:
- Booking form (5 steps)
- Booking list view
- Booking details page
- Booking actions (complete, cancel, reschedule)
- Reschedule modal

**Use Cases**:
- Customer books appointment online
- Admin creates walk-in booking
- Admin marks booking as completed
- Customer reschedules appointment
- Admin cancels booking
- System calculates available slots

---

### Module 3: Customer Management

**Features**:
- Customer profile creation
- Customer search and filtering
- Visit history tracking
- Purchase history
- Preferred employee assignment
- Reminder system (25-30 days since last visit)
- Customer notes

**Components**:
- Customer list
- Customer details page
- Customer search
- Customer form

**Use Cases**:
- Register new customer
- View customer history
- Update customer information
- Identify customers due for reminder
- Track customer preferences

---

### Module 4: Employee Management

**Features**:
- Employee profile creation
- Service assignment
- Commission rate configuration
- Working days setup
- Employee status (active/inactive)
- Image upload (Vercel Blob)
- Employee earnings tracking
- Performance analytics

**Components**:
- Employee list
- Add employee form
- Edit employee form
- Employee details page
- Employee image upload

**Use Cases**:
- Add new employee
- Assign services to employee
- Set commission rates
- Upload employee photos
- View employee performance
- Deactivate employee

---

### Module 5: Service Management

**Features**:
- Service catalog management
- Service pricing
- Service duration configuration
- Service images (Vercel Blob)
- Service activation/deactivation
- Service description

**Components**:
- Service list
- Service form (add/edit)
- Service image upload

**Use Cases**:
- Add new service
- Update service pricing
- Upload service images
- Activate/deactivate services
- View service catalog

---

### Module 6: Sales & Transactions

**Features**:
- Sale recording (from booking or walk-in)
- Payment method tracking (cash/online)
- Discount application
- Commission calculation
- Receipt generation
- Sales history
- Daily sales summary
- Employee earnings breakdown

**Components**:
- Sales list
- Add walk-in sale button
- Receipt component
- Sales summary cards

**Use Cases**:
- Complete booking and create sale
- Record walk-in sale
- Apply discounts
- Generate receipt
- View sales history
- Calculate commissions

---

### Module 7: Attendance Tracking

**Features**:
- Check-in/check-out recording
- Attendance status (present, absent, leave)
- Daily attendance view
- Employee attendance history
- Date-based filtering

**Components**:
- Attendance list
- Check-in/check-out buttons
- Attendance calendar view

**Use Cases**:
- Employee checks in
- Employee checks out
- Mark employee absent
- View attendance history
- Generate attendance reports

---

### Module 8: Reports & Analytics

**Features**:
- Daily summary reports
- Detailed daily reports (clickable dates)
- Revenue analytics
- Employee performance metrics
- Customer analytics
- Payment method breakdown
- Top earner identification
- Date range filtering

**Components**:
- Reports list page
- Detailed report page
- Summary cards
- Data tables
- Mobile card views

**Use Cases**:
- View daily summaries
- Analyze revenue trends
- Track employee performance
- Generate period reports
- Export data (future)

---

### Module 9: Dashboard

**Features**:
- Today's sales overview
- Cash vs Online breakdown
- Clients count
- Top earner display
- Tomorrow's bookings
- Quick actions (Add walk-in, Close day)

**Components**:
- Stat cards
- Dashboard layout
- Quick action buttons

**Use Cases**:
- View daily overview
- Quick access to common actions
- Monitor business metrics

---

### Module 10: Settings Management

**Features**:
- Salon name and branding
- Logo upload (Vercel Blob)
- Business hours configuration
- Closed days setup
- Contact information
- WhatsApp number
- Default commission rate
- Advance payment settings

**Components**:
- Settings form
- Logo upload
- Working hours picker

**Use Cases**:
- Update salon information
- Change business hours
- Upload logo
- Configure payment settings

---

### Module 11: Receipt Generation

**Features**:
- Automatic receipt generation for sales
- Receipt preview
- Print functionality
- Thermal printer compatible format
- Receipt number generation
- Complete transaction details

**Components**:
- Receipt component
- Print dialog
- Receipt styling

**Use Cases**:
- Generate receipt after sale
- Print receipt for customer
- View receipt history

---

### Module 12: Public Website

**Features**:
- Homepage with hero section
- Services listing with images
- Team/employees showcase
- About page
- Gallery page
- Contact page with form
- Online booking system
- Responsive design

**Components**:
- Header with navigation
- Footer with links
- Service cards
- Employee cards
- Booking form

**Use Cases**:
- Customer browses services
- Customer views team
- Customer books appointment
- Customer contacts salon

---

## Use Cases & Scenarios

### Scenario 1: Customer Books Appointment Online

**Actors**: Customer

**Preconditions**:
- Customer has internet access
- Services are available
- Salon is open

**Flow**:
1. Customer visits public website
2. Navigates to "Book Appointment"
3. **Step 1**: Selects one or more services
4. **Step 2**: Chooses date and available time slot
5. **Step 3**: Optionally selects preferred employee
6. **Step 4**: Enters contact information (name, phone, email)
7. **Step 5**: Reviews booking details and confirms
8. System creates booking with status "scheduled"
9. Customer receives confirmation

**Postconditions**:
- Booking created in database
- Time slot marked as unavailable
- Customer receives confirmation

**Alternative Flows**:
- No available slots → Customer selects different date
- Service unavailable → Customer selects different service
- Booking fails → Error message displayed

---

### Scenario 2: Admin Completes Booking and Generates Sale

**Actors**: Admin/Staff

**Preconditions**:
- Booking exists with status "scheduled"
- Customer has received service

**Flow**:
1. Admin navigates to Bookings page
2. Finds the booking
3. Clicks "Mark as Completed"
4. Selects payment method (cash/online)
5. Optionally applies discount
6. System creates Sale record
7. Booking status changes to "completed"
8. Receipt is generated automatically
9. Admin can print receipt

**Postconditions**:
- Sale recorded
- Booking marked completed
- Receipt available for printing
- Customer visit count updated
- Employee commission calculated

**Alternative Flows**:
- Customer no-show → Mark as "no-show"
- Customer cancels → Mark as "cancelled"

---

### Scenario 3: Walk-in Customer Sale

**Actors**: Admin/Staff

**Preconditions**:
- Customer arrives without booking

**Flow**:
1. Admin clicks "Add Walk-in Sale" on dashboard
2. Enters customer information (or selects existing customer)
3. Selects services provided
4. Selects employee who provided service
5. Enters payment method
6. Optionally applies discount
7. System creates Sale record
8. Receipt is generated
9. Admin prints receipt

**Postconditions**:
- Sale recorded
- Receipt generated
- Customer record updated (if existing customer)
- Employee commission calculated

---

### Scenario 4: Employee Check-in/Check-out

**Actors**: Employee/Admin

**Preconditions**:
- Employee exists in system
- Date is current date

**Flow**:
1. Admin navigates to Attendance page
2. Selects current date
3. Finds employee
4. Clicks "Check In" → Records check-in time
5. Later, clicks "Check Out" → Records check-out time
6. System updates attendance record

**Postconditions**:
- Attendance record created/updated
- Check-in/check-out times recorded
- Status set to "present"

**Alternative Flows**:
- Employee absent → Mark as "absent"
- Employee on leave → Mark as "leave"

---

### Scenario 5: View Daily Report

**Actors**: Admin/Owner

**Preconditions**:
- Sales exist for the date

**Flow**:
1. Admin navigates to Reports page
2. Optionally selects date range
3. Views summary table
4. Clicks on specific date
5. Views detailed report with:
   - All sales transactions
   - Employee earnings breakdown
   - Payment method breakdown
   - Customer count

**Postconditions**:
- Detailed report displayed
- All transaction data visible

---

### Scenario 6: Add New Employee

**Actors**: Admin/Owner

**Preconditions**:
- Admin is logged in
- Services exist (for assignment)

**Flow**:
1. Admin navigates to Employees page
2. Clicks "Add Employee"
3. Uploads employee photo
4. Enters basic information (name, phone, role)
5. Sets commission rate
6. Selects services employee can provide
7. Selects working days
8. Sets status (active/inactive)
9. Saves employee

**Postconditions**:
- Employee created
- Image uploaded to Vercel Blob
- Employee available for bookings

---

### Scenario 7: Reschedule Booking

**Actors**: Admin/Customer (via admin)

**Preconditions**:
- Booking exists with status "scheduled"
- Booking is in the future
- Reschedule count < 2

**Flow**:
1. Admin navigates to Bookings page
2. Finds booking to reschedule
3. Clicks "Reschedule"
4. Selects new date
5. Selects new time slot
6. Confirms reschedule
7. System updates booking
8. Original time slot becomes available
9. New time slot marked as booked

**Postconditions**:
- Booking date/time updated
- Reschedule count incremented
- Time slots updated

**Alternative Flows**:
- Max reschedules reached → Cannot reschedule
- Past date selected → Validation error

---

### Scenario 8: Generate and Print Receipt

**Actors**: Admin/Staff

**Preconditions**:
- Sale exists

**Flow**:
1. Admin navigates to Sales page
2. Finds the sale
3. Clicks "Print Receipt"
4. Receipt preview opens
5. Admin clicks "Print Receipt" button
6. Browser print dialog opens
7. Admin selects thermal printer
8. Receipt prints on thermal printer

**Postconditions**:
- Receipt printed
- Customer receives receipt

---

### Scenario 8: Close Day and Generate Summary

**Actors**: Admin/Owner

**Preconditions**:
- Day has sales/transactions

**Flow**:
1. Admin navigates to Dashboard
2. Clicks "Close Day" button
3. System generates daily summary:
   - Total sales
   - Cash vs Online breakdown
   - Total clients
   - Top earner
4. Summary saved to database
5. Optionally send via WhatsApp

**Postconditions**:
- Daily summary created
- Summary available in reports
- WhatsApp message sent (if enabled)

---

## API Documentation

### Authentication APIs

#### POST `/api/auth/[...nextauth]`
NextAuth authentication handler

---

### Booking APIs

#### GET `/api/bookings`
Get all bookings with optional filters

**Query Parameters**:
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (scheduled, completed, cancelled, no-show)
- `employeeId` - Filter by employee

**Response**:
```json
{
  "success": true,
  "data": [/* booking objects */]
}
```

#### POST `/api/bookings`
Create new booking

**Body**:
```json
{
  "customerName": "John Doe",
  "customerPhone": "+923001234567",
  "customerEmail": "john@example.com",
  "serviceIds": ["service_id_1", "service_id_2"],
  "employeeId": "employee_id",
  "bookingDate": "2026-01-27",
  "bookingTime": "14:00",
  "notes": "Optional notes"
}
```

#### GET `/api/bookings/[id]`
Get single booking details

#### PUT `/api/bookings/[id]`
Update booking

**Body**:
```json
{
  "status": "completed",
  "paymentMethod": "cash",
  "discountApplied": 0
}
```

#### GET `/api/bookings/available-slots`
Get available time slots for a date

**Query Parameters**:
- `date` - Date (YYYY-MM-DD)
- `duration` - Total duration in minutes
- `employeeId` - Optional employee filter

**Response**:
```json
{
  "success": true,
  "data": {
    "availableSlots": ["09:00", "09:30", "10:00", ...],
    "bookedSlots": ["11:00", "14:30"]
  }
}
```

#### POST `/api/bookings/[id]/reschedule`
Reschedule booking

**Body**:
```json
{
  "newDate": "2026-01-28",
  "newTime": "15:00"
}
```

#### POST `/api/bookings/[id]/mock-pay`
Mock payment processing for advance payment

---

### Customer APIs

#### GET `/api/customers`
Get all customers

**Query Parameters**:
- `search` - Search by name or phone
- `isDue` - Filter customers due for reminder

#### POST `/api/customers`
Create or update customer (upsert by phone)

#### GET `/api/customers/[id]`
Get single customer with history

#### GET `/api/customers/due-for-reminder`
Get customers due for reminder (25-30 days)

---

### Employee APIs

#### GET `/api/employees`
Get all employees

**Query Parameters**:
- `status` - Filter by status (active/inactive)
- `serviceId` - Filter by service capability

#### POST `/api/employees`
Create new employee

#### GET `/api/employees/[id]`
Get employee details with earnings

#### PUT `/api/employees/[id]`
Update employee

#### GET `/api/employees/[id]/earnings`
Get employee earnings for current month

---

### Service APIs

#### GET `/api/services`
Get all services

**Query Parameters**:
- `activeOnly` - Return only active services (true/false)

#### POST `/api/services`
Create new service

#### GET `/api/services/[id]`
Get single service

#### PUT `/api/services/[id]`
Update service

#### DELETE `/api/services/[id]`
Delete service

---

### Sales APIs

#### GET `/api/sales`
Get all sales

**Query Parameters**:
- `date` - Filter by date
- `employeeId` - Filter by employee
- `paymentMethod` - Filter by payment method

#### POST `/api/sales`
Create new sale (walk-in)

#### GET `/api/sales/daily-summary`
Get daily sales summary

**Query Parameters**:
- `date` - Date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2026-01-26",
    "totalSales": 11800,
    "cashSales": 500,
    "onlineSales": 11300,
    "totalClients": 2,
    "staffEarnings": [/* employee earnings */],
    "totalDiscounts": 0,
    "sales": [/* all sales */]
  }
}
```

#### GET `/api/sales/employee-earnings`
Get employee earnings summary

---

### Attendance APIs

#### GET `/api/attendance`
Get attendance records

**Query Parameters**:
- `date` - Filter by date
- `employeeId` - Filter by employee

#### POST `/api/attendance`
Create or update attendance record

**Body**:
```json
{
  "employeeId": "employee_id",
  "date": "2026-01-26",
  "status": "present",
  "checkIn": "2026-01-26T09:00:00Z",
  "checkOut": "2026-01-26T18:00:00Z"
}
```

---

### Dashboard APIs

#### GET `/api/dashboard/overview`
Get dashboard overview statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "todayTotalSale": 11800,
    "cashSales": 500,
    "onlineSales": 11300,
    "clientsToday": 2,
    "topEarner": {
      "name": "Tayyab",
      "earnings": 11800
    },
    "tomorrowBookings": 3
  }
}
```

---

### Reports APIs

#### GET `/api/reports/daily`
Get daily reports

**Query Parameters**:
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": [{
    "_id": "summary_id",
    "summaryDate": "2026-01-26T00:00:00Z",
    "totalSales": 11800,
    "cashSales": 500,
    "onlineSales": 11300,
    "totalClients": 2,
    "topEarner": {
      "employeeName": "Tayyab",
      "earnings": 11800
    }
  }]
}
```

#### GET `/api/reports/daily/[date]`
Get detailed daily report for specific date

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2026-01-26",
    "summaryDate": "2026-01-26T00:00:00Z",
    "totalSales": 11800,
    "cashSales": 500,
    "onlineSales": 11300,
    "totalDiscounts": 0,
    "totalClients": 2,
    "totalSalesCount": 2,
    "staffEarnings": [{
      "employeeId": "emp_id",
      "employeeName": "Tayyab",
      "commissionRate": 20,
      "earnings": 11800,
      "commission": 2360,
      "saleCount": 2
    }],
    "paymentBreakdown": {
      "cash": { "count": 1, "amount": 500 },
      "online": { "count": 1, "amount": 11300 }
    },
    "sales": [/* detailed sales with customer, employee, services */]
  }
}
```

---

### Settings APIs

#### GET `/api/settings`
Get salon settings (admin only)

#### PUT `/api/settings`
Update salon settings (admin only)

#### GET `/api/settings/public`
Get public settings (no auth required)

**Response**:
```json
{
  "success": true,
  "data": {
    "salonName": "Ishfaq Mens Salon",
    "logo": "https://...",
    "salonAddress": "...",
    "salonPhone": "+92 300 1234567",
    "whatsappNumber": "+92 300 1234567",
    "openingTime": "09:00",
    "closingTime": "18:00",
    "closedDays": []
  }
}
```

---

### Upload APIs

#### POST `/api/upload/employee-image`
Upload employee image

**Body**: FormData with `image` file

**Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://blob.vercel-storage.com/..."
  }
}
```

#### POST `/api/upload/service-image`
Upload service image

**Body**: FormData with `image` file

**Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://blob.vercel-storage.com/..."
  }
}
```

#### POST `/api/upload/logo`
Upload salon logo

**Body**: FormData with `image` file

---

### Receipt APIs

#### GET `/api/receipt/[id]`
Get receipt data for sale

**Response**:
```json
{
  "success": true,
  "data": {
    "saleId": "sale_id",
    "receiptNumber": "REC-12345678",
    "saleDate": "2026-01-26T14:30:00Z",
    "salon": {
      "name": "Ishfaq Mens Salon",
      "address": "...",
      "phone": "+92 300 1234567",
      "logo": "https://..."
    },
    "customer": {
      "name": "John Doe",
      "phone": "+923001234567",
      "email": "john@example.com"
    },
    "employee": {
      "name": "Tayyab",
      "role": "barber"
    },
    "services": [{
      "name": "Haircut",
      "price": 500,
      "duration": 30
    }],
    "payment": {
      "subtotal": 500,
      "discount": 0,
      "total": 500,
      "method": "cash"
    },
    "commission": {
      "amount": 100,
      "rate": 20
    }
  }
}
```

---

### WhatsApp APIs (Mock)

#### POST `/api/whatsapp/send-booking-confirmation`
Send booking confirmation via WhatsApp

#### POST `/api/whatsapp/send-reminder`
Send appointment reminder

#### POST `/api/whatsapp/send-daily-summary`
Send daily summary via WhatsApp

#### POST `/api/whatsapp/run-reminders`
Run reminder automation

---

## User Interfaces

### Public Website Pages

#### 1. Homepage (`/`)
- Hero section with salon name
- Featured services (3 services)
- Featured team members (3 employees)
- Call-to-action sections
- Responsive design

#### 2. Services Page (`/services`)
- Grid layout of all active services
- Service cards with images
- Price and duration display
- "Book This Service" button
- CTA section

#### 3. Team Page (`/team`)
- Grid layout of all active employees
- Employee cards with photos
- Role and services display
- "Book with [Employee]" option

#### 4. Book Appointment Page (`/book`)
- Multi-step form (5 steps)
- Step 1: Service selection
- Step 2: Date & time selection
- Step 3: Employee selection (optional)
- Step 4: Contact information
- Step 5: Confirmation
- Progress indicator
- Form validation

#### 5. About Page (`/about`)
- Salon story
- Mission & values
- Features grid
- CTA section

#### 6. Gallery Page (`/gallery`)
- Image grid (placeholder)
- Category filters (future)

#### 7. Contact Page (`/contact`)
- Contact information cards
- Contact form
- Business hours
- Map placeholder

---

### Admin Dashboard Pages

#### 1. Dashboard (`/admin/dashboard`)
- Statistics cards
- Today's sales overview
- Cash vs Online breakdown
- Top earner
- Tomorrow's bookings
- Quick actions

#### 2. Bookings (`/admin/bookings`)
- Bookings list with filters
- Date picker
- Status filter
- Booking actions (complete, cancel, reschedule)
- Booking details modal
- Mobile card view

#### 3. Customers (`/admin/customers`)
- Customer list
- Search functionality
- Customer details page
- Booking history
- Purchase history
- Mobile card view

#### 4. Employees (`/admin/employees`)
- Employee list
- Add employee page
- Edit employee page
- Employee details page
- Image upload
- Service assignment
- Mobile card view

#### 5. Services (`/admin/services`)
- Service list
- Add/edit service form
- Image upload
- Activate/deactivate
- Mobile responsive

#### 6. Sales (`/admin/sales`)
- Sales list
- Add walk-in sale
- Receipt printing
- Sales summary
- Employee earnings
- Mobile card view

#### 7. Attendance (`/admin/attendance`)
- Attendance list
- Check-in/check-out buttons
- Date filter
- Employee filter
- Mobile card view

#### 8. Reports (`/admin/reports`)
- Daily reports list
- Date range filter
- Clickable dates for detailed view
- Summary table
- Mobile card view

#### 9. Detailed Report (`/admin/reports/[date]`)
- Summary cards
- Staff earnings breakdown
- All sales transactions
- Complete transaction details
- Mobile card views for tables

#### 10. Settings (`/admin/settings`)
- Salon information form
- Logo upload
- Working hours configuration
- Closed days selection
- Contact information
- Payment settings

---

## Workflows & Business Logic

### Workflow 1: Complete Booking to Sale

1. Customer books appointment online
2. Booking created with status "scheduled"
3. Customer arrives and receives service
4. Admin marks booking as "completed"
5. System automatically:
   - Creates Sale record
   - Links to booking
   - Calculates total from services
   - Applies discount (if any)
   - Calculates final amount
   - Updates customer visit count
   - Calculates employee commission
6. Receipt is generated
7. Admin can print receipt

---

### Workflow 2: Available Time Slot Calculation

1. Customer selects services
2. System calculates total duration
3. System fetches:
   - Working hours from settings
   - Closed days from settings
   - Existing bookings for the date
   - Employee availability (if selected)
4. System generates available slots:
   - Starts from opening time
   - Creates 30-minute intervals
   - Excludes booked slots
   - Considers service duration
   - Ensures no overlap
5. Returns available slots to customer

**Business Rules**:
- Minimum slot duration: 30 minutes
- Cannot book past dates
- Cannot book past times for today
- Cannot book on closed days
- Must respect working hours

---

### Workflow 3: Commission Calculation

1. Sale is created
2. System fetches employee
3. Gets employee's commission rate
4. Calculates commission:
   ```
   commission = (finalAmount * commissionRate) / 100
   ```
5. Stores commission in sale record
6. Aggregates for daily/monthly reports

---

### Workflow 4: Daily Summary Generation

1. Admin clicks "Close Day"
2. System fetches all sales for the day
3. Calculates:
   - Total sales
   - Cash sales
   - Online sales
   - Total clients (unique)
   - Top earner
4. Creates DailySummary record
5. Optionally sends via WhatsApp
6. Summary available in reports

---

### Workflow 5: Customer Reminder System

1. System checks customers daily
2. For each customer:
   - Calculates days since last visit
   - If 25-30 days, marks as "due"
3. Admin can view due customers
4. Admin can send reminder via WhatsApp
5. System logs reminder sent date

---

## Thermal Printer Compatibility

### ✅ YES, Your Project IS Compatible with Thermal Printers!

Your receipt generation system is **fully compatible with thermal printers**. Here's why:

### Current Implementation

1. **Receipt Component** (`src/components/admin/Receipt.js`):
   - Uses standard thermal printer page size: `80mm` width
   - CSS includes: `@page { size: 80mm auto; margin: 0.2cm; }`
   - Optimized font sizes for thermal printing
   - Proper formatting for receipt paper

2. **Print Functionality**:
   - Uses browser's native `window.print()` API
   - Opens print dialog
   - Supports any printer connected to the system
   - Works with thermal printers via system print drivers

3. **Receipt Format**:
   - Compact layout (80mm width)
   - Essential information only
   - Clear sections (header, customer, services, payment, footer)
   - Proper text sizing for thermal paper

### How It Works

1. **When Receipt is Generated**:
   - Sale is completed
   - Receipt component opens
   - Preview is displayed

2. **When Print is Clicked**:
   - Browser print dialog opens
   - User selects thermal printer
   - Receipt prints on thermal paper

3. **Print Format**:
   - 80mm width (standard thermal printer size)
   - Auto height (adjusts to content)
   - Minimal margins
   - Black & white (thermal printers don't need color)

### Supported Thermal Printers

Your system works with **any thermal printer** that:
- Is connected to the computer/device
- Has proper print drivers installed
- Supports 80mm paper width
- Can be selected in browser print dialog

**Common Thermal Printer Brands**:
- Epson TM series
- Star Micronics
- Bixolon
- Citizen
- Any ESC/POS compatible printer

### Testing Thermal Printer

1. **Connect Printer**:
   - Connect thermal printer via USB/Network
   - Install printer drivers
   - Test print from system

2. **Test Receipt Printing**:
   - Complete a sale
   - Click "Print Receipt"
   - Select thermal printer from print dialog
   - Verify print output

3. **Adjustments** (if needed):
   - Printer settings in browser
   - Page size: 80mm
   - Margins: Minimal
   - Scale: 100%

### Receipt Content

Your receipts include:
- ✅ Salon name and logo
- ✅ Receipt number
- ✅ Date and time
- ✅ Customer information
- ✅ Employee/service provider
- ✅ Services list with prices
- ✅ Subtotal, discount, total
- ✅ Payment method
- ✅ Thank you message
- ✅ Contact information

### Future Enhancements (Optional)

If you want **direct thermal printer integration** (without browser dialog):

1. **ESC/POS Library Integration**:
   - Use libraries like `node-thermal-printer`
   - Direct printer communication
   - Requires printer IP/USB connection

2. **Print Server**:
   - Dedicated print server
   - API endpoint for printing
   - Better control over formatting

3. **Cloud Print**:
   - Google Cloud Print
   - Network printer support

**Current Status**: ✅ **Works perfectly with thermal printers via browser print dialog**

---

## File Upload System

### Vercel Blob Storage

**Storage Provider**: Vercel Blob Storage (`@vercel/blob`)

**Uploaded Files**:
1. **Employee Images**: `services/employee_*.jpg`
2. **Service Images**: `services/service_*.jpg`
3. **Salon Logo**: `logo/logo_*.jpg`

### Upload Process

1. User selects file from desktop
2. File validated (type, size)
3. File uploaded to Vercel Blob
4. Public URL returned
5. URL stored in database

### File Validation

- **Types**: Images only (image/*)
- **Size**: Max 5MB
- **Formats**: JPG, PNG, GIF

### Setup Required

See `BLOB_SETUP.md` for:
- Vercel Blob store creation
- Token configuration
- Environment variable setup

---

## Authentication & Security

### Authentication Flow

1. User enters email/password
2. Credentials validated against database
3. Password verified with bcrypt
4. JWT session created
5. Session cookie set
6. User redirected to dashboard

### Authorization

- **Owner Role**: Full access
- **Staff Role**: Limited access (customizable)

### Protected Routes

- All `/admin/*` routes require authentication
- Middleware checks session
- Unauthenticated users redirected to `/login`

### Security Features

- Password hashing (bcrypt)
- Session management (NextAuth)
- Route protection (middleware)
- Input validation
- File upload validation
- Environment variable protection

---

## Mobile Responsiveness

### Design Approach

- **Mobile-first**: Designed for mobile, enhanced for desktop
- **Responsive grids**: 1 col mobile, 2 tablet, 3+ desktop
- **Touch-friendly**: Minimum 44px touch targets
- **Responsive typography**: Scales with screen size
- **Mobile navigation**: Hamburger menu
- **Card views**: Mobile-optimized card layouts for tables

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- Collapsible navigation
- Card-based table views
- Optimized forms
- Touch-friendly buttons
- Proper text wrapping
- Horizontal scroll for wide tables

---

## Deployment Guide

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Vercel account (for Blob storage)
- Git repository

### Environment Variables

Create `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/salon-management
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/salon

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables

3. Start MongoDB (if local)

4. Seed database (optional):
   ```bash
   npm run seed
   ```

5. Run dev server:
   ```bash
   npm run dev
   ```

### Production Deployment (Vercel)

1. Push code to GitHub

2. Import to Vercel:
   - Go to vercel.com
   - Import repository
   - Configure environment variables

3. Deploy:
   - Vercel auto-deploys on push
   - Or manually trigger deployment

### Production Checklist

- ✅ MongoDB Atlas configured
- ✅ Environment variables set
- ✅ Vercel Blob token configured
- ✅ NEXTAUTH_URL set to production domain
- ✅ NEXTAUTH_SECRET generated
- ✅ Database seeded (initial admin user)

---

## Environment Configuration

### Required Variables

```env
MONGODB_URI=mongodb://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Optional Variables

```env
OWNER_PHONE=+923001234567  # For WhatsApp summaries
```

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify MONGODB_URI
   - Check network/firewall

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Clear browser cookies

3. **File Upload Errors**
   - Check BLOB_READ_WRITE_TOKEN
   - Verify Vercel Blob store exists
   - Check file size/type

4. **Receipt Print Issues**
   - Verify printer is connected
   - Check printer drivers
   - Try different browser
   - Check printer paper size (80mm)

5. **Build Errors**
   - Clear `.next` directory
   - Reinstall dependencies
   - Check Node.js version

---

## Future Enhancements

### Planned Features

1. **Payment Gateway Integration**
   - Stripe/PayPal integration
   - Online payment processing
   - Payment history

2. **Email Notifications**
   - Booking confirmations
   - Reminders
   - Receipts via email

3. **SMS Integration**
   - Real SMS sending
   - Appointment reminders
   - Marketing messages

4. **Advanced Reporting**
   - PDF export
   - Excel export
   - Custom date ranges
   - Charts and graphs

5. **Inventory Management**
   - Product tracking
   - Stock management
   - Purchase orders

6. **Customer Loyalty Program**
   - Points system
   - Rewards
   - Discounts

7. **Multi-location Support**
   - Multiple salon branches
   - Centralized management

8. **Mobile App**
   - React Native app
   - Push notifications
   - Mobile booking

9. **Calendar View**
   - Visual calendar
   - Drag-and-drop rescheduling
   - Employee schedule view

10. **Customer Reviews**
    - Rating system
    - Review management
    - Public display

---

## Support & Maintenance

### Getting Help

- Check this documentation
- Review error messages
- Check browser console
- Verify environment variables

### Maintenance Tasks

- Regular database backups
- Monitor file storage usage
- Update dependencies
- Review security logs

---

## License

Proprietary software for Ishfaq Mens Salon.

---

## Contact

For questions or support, contact the development team.

---

**Document Version**: 2.0.0  
**Last Updated**: January 26, 2026  
**Status**: Production Ready

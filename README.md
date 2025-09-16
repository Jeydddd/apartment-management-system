# Apartment Management System

A comprehensive front-end apartment management system built with HTML, CSS, and JavaScript. This system allows tenants, owners, and administrators to manage apartments, payments, maintenance requests, and more.

## Features

### 🏠 Landing Page
- Role selection (Tenant, Owner, Admin)
- Sign up and login functionality
- Find apartment feature (accessible without login)

### 👤 Tenant Features
- **My Unit**: View assigned apartment details
- **Payments**: View payment history and bills
- **Maintenance Requests**: Submit and track maintenance requests
- **Announcements**: View system announcements
- **Find Apartment**: Search and request apartments

### 🏢 Owner Features
- **Business Permit Requirement**: Must upload business permit to add apartments
- **My Apartments**: Add, edit, and manage apartments
- **My Tenants**: View and manage tenant information
- **Payments**: View income reports and payment status
- **Maintenance Status**: Update maintenance request status
- **Settings**: Manage profile and upload business permit

### ⚙️ Admin Features
- **Tenants Profile**: View all tenant information
- **Owners Profile**: Manage owners and verify business permits
- **Apartments**: Oversee all apartments in the system
- **Payments**: Track all payment transactions
- **Reports**: Generate system-wide reports
- **Maintenance**: View all maintenance requests
- **User Management**: Approve, block, or delete users
- **Settings**: System administration and data management

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The system will automatically load with sample data

### Sample Accounts
The system comes pre-loaded with sample accounts for testing:

**Tenant Account:**
- Email: `john@example.com`
- Password: `password123`

**Owner Account:**
- Email: `jane@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## Usage

### For Tenants
1. Select "Tenant" role on the landing page
2. Sign up for a new account or login with existing credentials
3. Navigate through the dashboard to:
   - View your assigned apartment
   - Check payment history
   - Submit maintenance requests
   - View announcements
   - Search for new apartments

### For Owners
1. Select "Owner" role on the landing page
2. Sign up and upload your business permit
3. Once verified, you can:
   - Add and manage apartments
   - View tenant information
   - Track payments and income
   - Update maintenance request status
   - Manage your profile

### For Administrators
1. Select "Admin" role on the landing page
2. Login with admin credentials
3. Access comprehensive system management:
   - View all users and apartments
   - Verify owner business permits
   - Generate system reports
   - Manage maintenance requests
   - Export system data

## Data Storage

The system uses browser localStorage to persist data, including:
- User accounts and profiles
- Apartment listings
- Payment records
- Maintenance requests
- System announcements

**Note**: Data is stored locally in your browser and will be lost if you clear browser data.

## File Structure

```
apartment-management-system/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── script.js               # Main JavaScript functionality
├── owner-features.js       # Owner-specific features
├── admin-features.js       # Admin-specific features
└── README.md              # This file
```

## Key Features

### 🔐 Authentication System
- Role-based access control
- Secure login/logout functionality
- Business permit verification for owners

### 🏠 Apartment Management
- Add, edit, and delete apartments
- Search and filter functionality
- Status tracking (available/occupied)
- Owner-tenant assignment

### 💰 Payment Tracking
- Payment history and status
- Income reports for owners
- System-wide revenue tracking

### 🔧 Maintenance System
- Request submission by tenants
- Status updates by owners
- Priority levels and tracking

### 📊 Reporting
- Comprehensive system reports
- User statistics
- Revenue tracking
- Occupancy rates

## Browser Compatibility

This system is compatible with all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Responsive Design

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Customization

The system can be easily customized by modifying:
- `styles.css` for visual changes
- `script.js` for functionality modifications
- Sample data in the JavaScript files

## Support

For questions or issues:
1. Check the browser console for error messages
2. Ensure JavaScript is enabled
3. Verify localStorage is available
4. Try refreshing the page

## License

This project is open source and available under the MIT License.

---

**Note**: This is a front-end demonstration system. In a production environment, you would need a proper backend server, database, and security measures.

# Premium Properties - Real Estate Website with Admin Panel

## Overview
A fully responsive real estate agent website with a complete admin panel for managing properties. Agents can add, edit, and delete properties with image uploads, and the website automatically updates with the latest listings.

## 📁 Files Structure
```
frontend/
├── index.html           # Main website
├── styles.css          # Website styling
├── script.js           # Website functionality
├── admin.html          # Admin panel login & management
├── admin-styles.css    # Admin panel styling
├── admin-script.js     # Admin panel functionality
└── README.md           # This file
```

## 🚀 Features

### Main Website (Public)
- ✅ Responsive design for all devices (mobile, tablet, desktop)
- ✅ Hero section with property search
- ✅ Featured properties grid with filtering
- ✅ Property detail modals
- ✅ About section with company statistics
- ✅ Contact form
- ✅ Link to admin panel
- ✅ Real-time updates from admin panel

### Admin Panel
- ✅ Secure login (username & password)
- ✅ Dashboard with statistics
- ✅ Property management (Add, Edit, Delete)
- ✅ Image upload with preview
- ✅ Edit property details:
  - Property name
  - Type (House, Apartment, Condo)
  - Price
  - Location/Address
  - Bedrooms, Bathrooms, Square Feet
  - Description
  - Amenities
  - Featured image
- ✅ Property search & filtering
- ✅ Responsive design for all devices
- ✅ Settings management
- ✅ Password change functionality
- ✅ Secure logout

## 🔐 Login Credentials

**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

> **Note:** In a production environment, these should be stored securely on a backend server with proper authentication.

## 📖 How to Use

### Opening the Website
1. Open `index.html` in your web browser
2. You'll see the main real estate website
3. Click "Admin" in the navigation menu to access the admin panel

### Accessing the Admin Panel
1. Go to `admin.html` directly or click the "Admin" link on the main website
2. Enter the login credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

### Managing Properties

#### Adding a New Property
1. Click on "Add Property" in the sidebar
2. Fill in all the required fields:
   - Property Name
   - Property Type (House, Apartment, or Condo)
   - Price
   - Location/Address
   - Number of Bedrooms
   - Number of Bathrooms
   - Square Footage
   - Description (optional)
   - Amenities (comma-separated, e.g., "Pool, Gym, Parking")
   - Upload an image from your gallery
3. Click "Add Property"
4. The property will appear on the website immediately

#### Editing a Property
1. Click "Properties" in the sidebar
2. Find the property you want to edit
3. Click the "Edit" button
4. Modify any details you want to change
5. You can upload a new image or keep the existing one
6. Click "Save Changes"

#### Deleting a Property
1. Click "Properties" in the sidebar
2. Find the property you want to delete
3. Click the "Delete" button
4. Confirm the deletion

#### Searching Properties
1. Click "Properties" in the sidebar
2. Use the search bar to find properties by name or location
3. Results will filter in real-time

### Dashboard
- Shows total number of properties
- Shows active listings count
- Shows properties added this month

### Settings
1. Click "Settings" in the sidebar
2. **Account Settings:** Update your email and phone number
3. **Change Password:** Set a new admin password
4. **Reset Data:** Delete all properties (use with caution)

## 💾 Data Storage

The website uses **browser's LocalStorage** to save all property data. This means:
- Properties are saved locally on your computer
- Data persists even after closing the browser
- Data is cleared if you clear browser cache/cookies
- Different browsers have separate storage

### Backing Up Your Data
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find "adminProperties" in Local Storage
4. Copy the data for backup

## 📱 Responsive Design

The website is fully responsive and works perfectly on:
- **Desktop** (1200px and above)
- **Tablet** (768px - 1199px)
- **Mobile** (480px - 767px)
- **Small Mobile** (below 480px)

Features adapt automatically:
- Navigation collapses to hamburger menu on mobile
- Grid layouts adjust for screen size
- Forms stack vertically on small screens
- Touch-friendly buttons and controls

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css` and `admin-styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    --accent-color: #3498db;
    /* ... more colors ... */
}
```

### Company Information
Update in `index.html`:
- Company name (logo)
- Contact information
- Social media links

### Admin Credentials
Edit in `admin-script.js`:
```javascript
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
```

## 🔒 Security Notes

⚠️ **Important:** This is a frontend-only application for demonstration. In production:
1. **Never** store credentials in the frontend
2. Use a proper backend authentication system
3. Implement JWT or similar token-based authentication
4. Use HTTPS for all communications
5. Implement proper API authentication
6. Store data in a secure database
7. Add rate limiting and security headers
8. Implement proper access controls

## 🐛 Troubleshooting

### Properties not showing
- Check browser console for errors (F12)
- Clear browser cache and reload
- Make sure JavaScript is enabled

### Admin panel not loading
- Verify `admin.html`, `admin-styles.css`, and `admin-script.js` are in same folder
- Check browser console for errors
- Try a different browser

### Images not uploading
- Ensure file is a valid image format (JPG, PNG, etc.)
- Check browser file size limits
- Try with a smaller image

### Lost data
- LocalStorage was cleared (check browser settings)
- Different browser/device has separate storage
- Incognito/Private browsing uses temporary storage

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the correct location
3. Try clearing browser cache
4. Check that JavaScript is enabled

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

**Created:** December 2025  
**Version:** 1.0

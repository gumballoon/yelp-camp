# YelpCamp

A full-featured campground review application built with Node.js, Express, and MongoDB. This project is part of Colt Steele's Web Developer Bootcamp on Udemy.

## 🔗 Course Link
[The Web Developer Bootcamp 2025](https://www.udemy.com/course/the-web-developer-bootcamp/) by Colt Steele

## 📋 Features

### Core Functionality
- **Campground Management**: Create, read, update, and delete campgrounds
- **Review System**: Leave reviews and ratings for campgrounds
- **User Authentication**: Register, login, and logout with secure sessions
- **Authorization**: Only campground authors can edit/delete their posts
- **Image Upload**: Upload multiple images using Cloudinary
- **Interactive Maps**: MapBox integration for location visualization
- **Search & Filter**: Find campgrounds by location

### Security Features
- **Input Validation**: Server-side validation using Joi
- **Data Sanitization**: Protection against NoSQL injection attacks
- **Authentication**: Passport.js with local strategy
- **Session Management**: Secure session handling with MongoDB store
- **Content Security Policy**: Helmet.js for security headers
- **XSS Protection**: Sanitized HTML content

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap** - CSS framework
- **JavaScript** - Client-side scripting

### Authentication & Security
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing (via passport-local-mongoose)
- **Helmet.js** - Security headers
- **express-mongo-sanitize** - MongoDB injection prevention
- **sanitize-html** - HTML sanitization

### File Storage & APIs
- **Cloudinary** - Image hosting and management
- **MapBox** - Maps and geocoding
- **Multer** - File upload handling

### Development Tools
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management
- **connect-flash** - Flash messaging
- **method-override** - HTTP method override

## 📁 Project Structure

```
yelp-camp/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── controllers/           # Route handlers
│   ├── campgrounds.js     # Campground CRUD operations
│   ├── reviews.js         # Review management
│   └── users.js           # User authentication
├── models/                # Database schemas
│   ├── campground.js      # Campground model
│   ├── review.js          # Review model
│   └── user.js            # User model
├── routes/                # Express routes
│   ├── campgrounds.js     # Campground routes
│   ├── reviews.js         # Review routes
│   └── users.js           # Authentication routes
├── views/                 # EJS templates
│   ├── campgrounds/       # Campground views
│   ├── users/             # Authentication views
│   └── layouts/           # Layout templates
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── images/            # Static images
├── utilities/             # Helper functions
│   ├── AppError.js        # Custom error class
│   └── middleware.js      # Custom middleware
├── seeds/                 # Database seeding
│   └── index.js           # Seed script
└── cloudinary/            # Cloudinary configuration
    └── index.js           # Cloud storage setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- MapBox account (for maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yelp-camp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_URL=mongodb://127.0.0.1:27017/yelp-camp
   SECRET=your-session-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   MAPBOX_TOKEN=your-mapbox-token
   ```

4. **Seed the database** (optional)
   ```bash
   node seeds/index.js
   ```

5. **Start the application**
   ```bash
   node app.js
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🗃️ Database Schema

### Campground Model
- Title, price, location, description
- Geographic coordinates (GeoJSON)
- Image URLs and filenames
- Author reference (User)
- Reviews array (Review references)

### Review Model
- Rating (1-5 stars)
- Review text
- Author reference (User)
- Associated campground reference

### User Model
- Username and password (hashed)
- Email address
- Authentication handled by Passport.js

## 🔧 Configuration

### Security Settings
- Sessions expire after 1 week
- HTTP-only cookies for security
- Content Security Policy configured for trusted sources
- MongoDB injection protection enabled

### Image Upload
- Maximum 3 images per campground
- Automatic image optimization via Cloudinary
- Thumbnail generation for listings
- Carousel-optimized images for detail views

## 🎯 Key Features Explained

### Authentication Flow
1. User registration with validation
2. Secure password hashing
3. Session-based authentication
4. Logout functionality with session cleanup

### Campground Management
1. Create new campgrounds with images and location
2. Automatic geocoding for map display
3. Edit/delete permissions for authors only
4. Image management with Cloudinary

### Review System
1. Star-based rating system
2. Text reviews with validation
3. Author-only edit/delete permissions
4. Average rating calculation

## 📱 Responsive Design
- Mobile-first approach with Bootstrap
- Interactive maps adapt to screen size
- Optimized image loading for different devices
- Touch-friendly interface elements

## 🔒 Security Measures
- Input validation and sanitization
- XSS and injection attack prevention
- Secure session management
- Environment variable protection
- Content Security Policy implementation

## 🚀 Deployment
The application is configured for production deployment with:
- Environment-based configuration
- Database connection fallbacks
- Error handling for production
- Security headers and HTTPS support

## 📚 Learning Outcomes
This project demonstrates:
- Full-stack web development
- RESTful API design
- Database relationships and modeling
- Authentication and authorization
- File upload and cloud storage
- Security best practices
- Responsive web design
- Error handling and validation

## 📄 License
This project is for educational purposes as part of the Web Developer Bootcamp curriculum.

---

**Course Link**: [The Web Developer Bootcamp 2025](https://www.udemy.com/course/the-web-developer-bootcamp/) by Colt Steele
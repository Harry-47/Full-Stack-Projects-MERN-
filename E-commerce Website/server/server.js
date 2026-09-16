const express = require('express');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
 

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (Local)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected locally"))
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// Passport configuration
app.use(
    session({
        secret: 'somethingverysecret', // Change this in production
        resave: false,
        saveUninitialized: false,
    })
);


app.use(passport.initialize());


// Middleware
const allowedOrigins = [
  'https://e-commerce-website-gilt-delta.vercel.app/',
  'https://e-commerce-website-git-main-harry-47s-projects.vercel.app/',
  'https://e-commerce-website-7kbvh8cnu-harry-47s-projects.vercel.app/',
  'http://localhost:5173', // local testing 
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('dev'));



const authRoutes = require('./routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

// Import user routes
const cartRoutes = require('./routes/User/cartRoutes');
const orderRoutes = require('./routes/User/orderRoutes');
const productRoutes = require('./routes/User/productRoutes');


// //Import admin routes
const adminProductRoutes = require('./routes/Admin/adminProductRoutes');
const adminUserRoutes = require('./routes/Admin/adminUserRoutes');
const adminOrderRoutes = require('./routes/Admin/adminOrderRoutes');
const adminDashboard = require('./routes/Admin/adminDashboardRoutes')



//import checktoken, chekkadmin, checkuser middleware
const { checkToken, checkAdmin, checkUser } = require('./controllers/authController')
// User routes
app.use('/api/v1/users/carts',checkToken, checkUser, cartRoutes);
app.use('/api/v1/users/orders',checkToken, checkUser, orderRoutes);
app.use('/api/v1/users/products',  productRoutes);


// Admin routes

app.use('/api/v1/admin/dashboard', checkToken, checkAdmin,adminDashboard);
app.use('/api/v1/admin/products',checkToken,checkAdmin, adminProductRoutes);
app.use('/api/v1/admin/users',checkToken, checkAdmin, adminUserRoutes);
app.use('/api/v1/admin/orders',checkToken, checkAdmin, adminOrderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("🎯 API Running Successfully!");
  
  
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
  console.log(err)
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

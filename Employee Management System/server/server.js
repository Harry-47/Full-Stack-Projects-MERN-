const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');


const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/Employee/employeeRoutes');
const managerRoutes = require('./routes/Manager/managerRoutes');

const app = express();

// CORS config
app.use(cors({
  origin: ['http://192.168.1.13:5173', 'http://localhost:5173', "http://192.168.1.9:5173"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport configuration
app.use(
    session({
        secret: 'somethingverysecret', // Change this in production
        resave: false,
        saveUninitialized: false,
    })
);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/manager', managerRoutes);

// DB connection
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

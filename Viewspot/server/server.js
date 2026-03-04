const express = require('express');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const http = require('http');

const { Server } = require('socket.io');
 

const app = express();

const server = http.createServer(app);

// 2. Initialize Socket.io on that server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL (Vite)
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible to routes/controllers via req.app.get('socketio')
app.set('socketio', io)


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





// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('dev'));

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Import user routes
app.use('/uploads', express.static('uploads'));


const userRoutes = require('./routes/User/uploadPost');
// User routes
app.use("/api/user", userRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

io.on("connection", (socket) => {
    console.log("🔌 Socket Connected:", socket.id);

    // A. User Setup (Join own room for notifications/private messages)
    socket.on("setup", (userData) => {
        if (userData) {
            socket.join(userData); // Room name = User ID
            console.log(`👤 User joined personal room: ${userData}`);
            socket.emit("connected");
        }
    });

    // B. Join Chat Room (Specific Conversation)
    socket.on("join_chat", (room) => {
        socket.join(room);
        console.log(`💬 User Joined Chat Room: ${room}`);
    });

    // C. Send Message (Receive from client, send to others in room)
    socket.on("new_message", (newMessageRecieved) => {
        var chat = newMessageRecieved.conversationId; // Backend should populate this

        if (!chat) return console.log("Chat.conversation not defined");

        // Doosre user ko bhejo (Sender ko wapis mat bhejo)
        socket.to(chat).emit("message_received", newMessageRecieved);
        
        console.log("📨 Message Sent to Room:", chat);
    });

    // D. Cleanup
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});


// Start server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

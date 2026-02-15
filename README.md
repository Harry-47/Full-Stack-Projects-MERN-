# 🚀 MERN Stack Industrial Projects Hub

Welcome to my full-stack development journey! This repository contains production-grade applications built with the MERN stack, focusing on performance, security, and modern state management.

## 🛠️ Tech Stack Used
- **Frontend:** React.js, Tailwind CSS, TanStack Query (React Query), Axios.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Authentication:** JWT (JSON Web Tokens) with Secure Cookie storage.

---

## 📂 Projects Included

### 1. Employee Management System (EMS)
A comprehensive system for managing corporate staff data.
- **Key Features:** Role-based access and optimized API calls.
- **Key Tech:** Axios Interceptors, JWT, and Express Middlewares.
- **[API Docs here](https://huraira-7718308.postman.co/workspace/Huraira's-Workspace~40076f1a-cf93-4965-8e3c-4bd885960a0f/collection/45870313-52212d2a-7c8f-49d0-a0ef-7544ea89a0c6?action=share&creator=45870313)** 

### 2. E-commerce Platform
A feature-rich web store for a seamless shopping experience.
- **Key Features:** Product filtering, Cart management, and Persistent state.
- **Key Tech:** React Query for caching, Redux/Zustand for state.
- **[API Docs here](https://huraira-7718308.postman.co/workspace/Huraira's-Workspace~40076f1a-cf93-4965-8e3c-4bd885960a0f/collection/45870313-1e884326-8a0b-4da2-b543-9d0affe00a36?action=share&creator=45870313&active-environment=45870313-8c28137c-9918-4441-99f5-23c7428c389b)**

---

## 🔒 Security & Optimization
- **Secure Auth:** Implemented protected routes and token rotation.
- **Performance:** Used React Query to minimize redundant API hits.
- **Code Quality:** Organized into a clean Controller-Service architecture.

---

🚀 How to Run Locally
*Prerequisites:  Node.js and MongoDB are required to be installed.*

Follow these steps to get the projects up and running on your local machine:

1. Clone the Repository

git clone https://github.com/Harry-47/Full-Stack-Projects.git.
cd Full-Stack-Projects.


2. Setup the Backend (Server)
Choose a project (e.g., Employee-Management-System) and navigate to its server folder:
cd Employee-Management-System/server
npm install

Environment Variables: Create a .env file in the server folder and add your:

MONGO_URI (Your MongoDB connection string)

JWT_SECRET (Any random string for authentication)

PORT (e.g., 5000)

GITHUB_CLIENT_ID(For Oauth, create an OAuth app in your developer settings in your github account first , it will proivde you this so just copy-paste here)

GITHUB_CLIENT_SECRET(Same as above)

MAILTRAP_USER (Go to mailtrap, create an account and copy this and paste here)

MAILTRAP_PASS ( same as above)

CLIENT_URL (URL OF THE FRONTEND APP)

SERVER_URL (URL OF THE BACKEND APP)

Run the server:

 npm run dev

 
3. Setup the Frontend (Client)
Open a new terminal and navigate to the client folder:


cd Employee-Management-System/client.
npm install.

Environment Variables: Create a .env file in the server folder and add your:

VITE_API_URL( basically the base route of your backend server).

VITE_SERVER_URL ( what i did was base route for serving static file was different that actual base route so just add it by finding from network tab where does the img tag requests for the image, HEHE 😅).

VITE_AUTH_URL ( this is same as your VITE_API_URL but specifically named just for auth pages to send request to server , but must add because auth pages are actually using it).

npm run dev.




*Developed by [Harry-47](https://github.com/Harry-47) - CS Undergrad & MERN Enthusiast.*

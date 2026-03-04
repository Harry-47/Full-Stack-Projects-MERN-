import "./App.css";
import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";

// Socket global taake re-render pe disconnect na ho
let socket;

function App() {
  // 1. Root Loader se User ID nikalo
  const { loggedInUserId } = useLoaderData() || {}; 

  useEffect(() => {
    // Agar user login nahi hai, to socket connect mat karo
    if (!loggedInUserId) return;

    // --- SOCKET SETUP ---
    socket = io("http://localhost:3000"); // Backend URL
    socket.emit("setup", loggedInUserId);

    // --- GLOBAL NOTIFICATION LISTENER ---
    socket.on("new_notification", (notif) => {
      // Toast ka Text banao
      const senderName = notif.sender.name || notif.sender.displayName || "Someone";
      let actionText = "interacted with you";
      
      if (notif.type === 'like') actionText = "liked your post ❤️";
      if (notif.type === 'comment') actionText = `commented on your post 💬`;
      if (notif.type === 'follow') actionText = "started following you 👤";

      // Toast dikhao
      toast.info(`${senderName} ${actionText}`, {
        position: "top-right",
        autoClose: 2000,
        theme: "dark" // Viewspot Vibe
      });
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.off("new_notification");
        socket.disconnect();
      }
    };
  }, [loggedInUserId]);

  return (
    <>
      <ToastContainer />
      <Outlet /> {/* Yahan baki pages (Feed, Profile) render honge */}
    </>
  );
}

export default App;
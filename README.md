# 🧮 Multiplayer Counter

A real-time web-based **MULTIPLAYER** counter that shows live user lists, personal scores, and mouse cursors for all connected players!

The **motivation** behind this was to so something with socket.io, the simplest multiplayer application one could make, with the already given default app with vite.

Later added the **Multi-Cursor** functionality as well.

Built with **React (frontend)** and **Node.js + Socket.IO (backend)**.  
**Frontend** deployed on **Vercel**, **backend** on **Render**.

**[Try the live demo!](https://multiplayer-counter.vercel.app/)**

---

## 🚀 Features

- **Real-time** multiplayer counter — increments reflected live for everyone
- **User ranking/scoreboard** with join time and scores
- **Live cursors:** See where each user’s mouse is (desktop only)
- **Persistent scores** using backend runtime storage (`userdata.json`)
- **Works on mobile and desktop** (with limited cursor features)
- Fun for classrooms, friends’ groups, or demo interviews!

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks), Vite, CSS
- **Backend:** Node.js, Express, Socket.IO
- **Storage:** JSON file (`userdata.json`) on backend only
- **Hosting:** Vercel (frontend), Render (backend)

---

## 🌐 Live Instances

- **Frontend:** [https://multiplayer-counter.vercel.app/](https://multiplayer-counter.vercel.app/)
- **Backend:** [https://nebula-runner-backend.onrender.com/](https://nebula-runner-backend.onrender.com/) *(Note: Your backend **must** be configured for your frontend domain in CORS)*

---

## 🧑💻 Local Development

### **1. Clone the repo**
```
git clone https://github.com/hariom57/multiplayer-counter.git
cd multiplayer-counter
```

### **2. Backend setup**
```
cd server
npm install
npm start
```

### **3. Frontend setup**
```
cd ../src
npm install
npm run dev
```

### **4. Connecting Frontend to Backend**
In `src/App.jsx`, set the Socket.IO connection URL to your backend:
```
// For local dev:
sock.current = io("http://localhost:4000");

// For deploy:
sock.current = io("https://nebula-runner-backend.onrender.com");
```

---

## 📜 License

**MIT License.**  
**Free for demo & educational use. Adapt for your own projects!**

---

**Enjoy! Pull requests welcome.**
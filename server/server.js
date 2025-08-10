import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://multiplayer-counter.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});


const DATA_FILE = path.resolve('./userdata.json');
let counter = 0;
let userData = {};

// Load saved user data and counter
try {
  if (fs.existsSync(DATA_FILE)) {
    const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (d.userData) {
      Object.entries(d.userData).forEach(([n, u]) => { u.sockets = new Set(); d.userData[n] = u; });
      userData = d.userData;
    }
    if (typeof d.counter === 'number') counter = d.counter;
  }
} catch {;}

// Save only score/joinTime/counter, not sockets or cursor
const saveData = () => {
  fs.writeFile(
    DATA_FILE, 
    JSON.stringify({ 
      userData: Object.fromEntries(Object.entries(userData).map(([n, u]) => [n, { score: u.score, joinTime: u.joinTime }])), 
      counter 
    }, null, 2), 
    () => {}
  );
};

const getSortedUsers = () =>
  Object.keys(userData)
    .map(name => ({ name, score: userData[name].score, joinTime: userData[name].joinTime }))
    .filter(u => userData[u.name].sockets.size)
    .sort((a, b) => b.score !== a.score ? b.score - a.score : a.joinTime - b.joinTime);

const getAllCursors = () => {
  const cursors = {};
  Object.entries(userData).forEach(([name, u]) => {
    if (u.sockets.size && u.cursor) cursors[name] = u.cursor;
  });
  return cursors;
};

io.on('connection', socket => {
  socket.on('setName', name => {
    name = name.trim();
    if (!name) return;
    if (!userData[name]) userData[name] = { score: 0, joinTime: Date.now(), sockets: new Set() };
    userData[name].sockets.add(socket.id);
    socket.username = name;
    saveData();
    socket.emit('yourName', name);
    io.emit('onlineUsers', getSortedUsers());
    io.emit('cursors', getAllCursors());
    socket.emit('counterUpdate', counter);
  });

  socket.on('increment', () => {
    counter++;
    const u = userData[socket.username];
    if (u) { u.score++; saveData(); }
    io.emit('counterUpdate', counter);
    io.emit('onlineUsers', getSortedUsers());
  });

  socket.on('updateCursor', pos => {
    const u = userData[socket.username];
    if (u) { u.cursor = pos; io.emit('cursors', getAllCursors()); }
  });

  socket.on('disconnect', () => {
    const u = userData[socket.username];
    if (u) { u.sockets.delete(socket.id); }
    io.emit('onlineUsers', getSortedUsers());
    io.emit('cursors', getAllCursors());
    saveData();
  });
});

server.listen(4000);
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./index.css";

export default function App() {
  const [counter, setCounter] = useState(0), [users, setUsers] = useState([]);
  const [myName, setMyName] = useState(""), [nameIn, setNameIn] = useState("");
  const [joined, setJoined] = useState(false), [cursors, setCursors] = useState({});
  const sock = useRef(null);

  const connect = name => {
    sock.current?.disconnect();
    sock.current = io("https://multiplayer-counter.onrender.com");
    sock.current.on("yourName", setMyName);
    sock.current.on("onlineUsers", setUsers);
    sock.current.on("counterUpdate", setCounter);
    sock.current.on("cursors", setCursors);
    sock.current.on("connect", () => sock.current.emit("setName", name));

    window.onmousemove = e =>
      sock.current && sock.current.emit("updateCursor", {
        x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight
      });
  };

  useEffect(() => {
    let u = localStorage.getItem("username");
    if (u) { setJoined(true); setNameIn(u); connect(u); }
    return () => sock.current?.disconnect();
  }, []);

  const join = () => {
    if (nameIn.trim()) {
      localStorage.setItem("username", nameIn.trim());
      setJoined(true);
      connect(nameIn.trim());
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    setJoined(false); setMyName(""); setUsers([]);
    sock.current?.disconnect(); sock.current = null;
  };

  if (!joined)
    return (
      <div className="center">
        <h1>Enter your name</h1>
        <input value={nameIn} onChange={e => setNameIn(e.target.value)} />
        <button onClick={join}>Join</button>
      </div>
    );

  return (
    <div className="app">
      <div className="ui">
        <h1>🧮 Multiplayer Counter</h1>
        <p className="counter">Counter: {counter}</p>
        <button onClick={() => sock.current.emit("increment")}>Click to Increment</button>
        <button className="logout" onClick={logout}>Logout</button>
        <h2>🟢 Online Users (sorted):</h2>
        <ul className="user-list">
          {users.map((u, i) => (
            <li key={u.name} className={u.name === myName ? "you" : ""}>
              <span>{i + 1}. {u.name} {u.name === myName && "(You)"}</span>
              <span className="rank">Score: {u.score}</span>
            </li>
          ))}
        </ul>
      </div>
      {Object.entries(cursors).map(([name, pos]) =>
        <div key={name}
          className={`cursor${name === myName ? " me" : ""}`}
          style={{ left: `${pos.x * 100}vw`, top: `${pos.y * 100}vh` }}
          title={name === myName ? `${name} (You)` : name}
        />
      )}
    </div>
  );
}
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Connect to server
const socket = io("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chat message", ({ username, message }) => {
      setChat((prevChat) => [...prevChat, { username, message }]);
      scrollToBottom();
    });

    // Listen for typing indicators
    socket.on("user typing", (users) => {
      setTypingUsers(users.filter(user => user !== username));
    });

    // Cleanup on component unmount
    return () => {
      socket.off("chat message");
      socket.off("user typing");
    };
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      setIsLoggedIn(true);
      socket.emit("user joined", username);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("chat message", { username, message });
    socket.emit("stopped typing", username);
    setMessage("");
    inputRef.current.focus();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim() !== "") {
      socket.emit("typing", username);
    } else {
      socket.emit("stopped typing", username);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
          }
          
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .login-container {
            max-width: 420px;
            width: 90%;
            margin: auto;
            padding: 40px;
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            animation: fadeIn 0.6s ease-out;
            transform-style: preserve-3d;
            transition: all 0.4s ease;
          }
          
          .login-container:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          }
          
          .login-container h2 {
            color: #4a4a4a;
            margin-bottom: 25px;
            font-weight: 600;
            font-size: 1.8rem;
          }
          
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .input-group {
            position: relative;
          }
          
          .login-container input[type="text"] {
            padding: 15px 20px;
            width: 100%;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
          }
          
          .login-container input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
          }
          
          .login-container button {
            padding: 15px;
            font-size: 16px;
            background: linear-gradient(to right, #667eea, #764ba2);
            border: none;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          
          .login-container button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(102, 126, 234, 0.6);
          }
          
          .login-container button:active {
            transform: translateY(0);
          }
          
          .login-container::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
            z-index: -1;
            border-radius: 25px;
            opacity: 0.7;
            filter: blur(20px);
            animation: gradientBG 8s ease infinite;
            background-size: 200% 200%;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .floating-icons {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
          }
          
          .floating-icons div {
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            bottom: -150px;
            animation: float 15s linear infinite;
            border-radius: 50%;
          }
          
          .floating-icons div:nth-child(1) {
            left: 25%;
            width: 80px;
            height: 80px;
            animation-delay: 0s;
          }
          
          .floating-icons div:nth-child(2) {
            left: 10%;
            width: 20px;
            height: 20px;
            animation-delay: 2s;
            animation-duration: 12s;
          }
          
          .floating-icons div:nth-child(3) {
            left: 70%;
            width: 20px;
            height: 20px;
            animation-delay: 4s;
          }
          
          .floating-icons div:nth-child(4) {
            left: 40%;
            width: 60px;
            height: 60px;
            animation-delay: 0s;
            animation-duration: 18s;
          }
          
          .floating-icons div:nth-child(5) {
            left: 65%;
            width: 20px;
            height: 20px;
            animation-delay: 0s;
          }
          
          .floating-icons div:nth-child(6) {
            left: 75%;
            width: 110px;
            height: 110px;
            animation-delay: 3s;
          }
          
          .floating-icons div:nth-child(7) {
            left: 35%;
            width: 150px;
            height: 150px;
            animation-delay: 7s;
          }
          
          .floating-icons div:nth-child(8) {
            left: 50%;
            width: 25px;
            height: 25px;
            animation-delay: 15s;
            animation-duration: 45s;
          }
          
          .floating-icons div:nth-child(9) {
            left: 20%;
            width: 15px;
            height: 15px;
            animation-delay: 2s;
            animation-duration: 35s;
          }
          
          .floating-icons div:nth-child(10) {
            left: 85%;
            width: 150px;
            height: 150px;
            animation-delay: 0s;
            animation-duration: 11s;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
              border-radius: 50%;
            }
            100% {
              transform: translateY(-1000px) rotate(720deg);
              opacity: 0;
              border-radius: 50%;
            }
          }
        `}</style>

        <div className="floating-icons">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="login-container">
          <h2>Join the Chat Universe</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your cosmic username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit">Launch Chat</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        }
        
        body {
          background: #f5f7fa;
          min-height: 100vh;
          padding: 20px;
        }
        
        .app-container {
          max-width: 800px;
          width: 95%;
          margin: 30px auto;
          padding: 30px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.5s ease-out;
          overflow: hidden;
          position: relative;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .app-header h2 {
          color: #4a4a4a;
          font-weight: 600;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
        }
        
        .user-badge {
          background: linear-gradient(to right, #667eea, #764ba2);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          margin-left: 10px;
          box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
        }
        
        .chat-box {
          border: 1px solid #e0e0e0;
          height: 400px;
          overflow-y: auto;
          padding: 20px;
          margin-bottom: 25px;
          background: #fafafa;
          border-radius: 15px;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.03);
          scrollbar-width: thin;
          scrollbar-color: #667eea #f1f1f1;
        }
        
        .chat-box::-webkit-scrollbar {
          width: 8px;
        }
        
        .chat-box::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .chat-box::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #667eea, #764ba2);
          border-radius: 10px;
        }
        
        .chat-box::-webkit-scrollbar-thumb:hover {
          background: #5a6fd1;
        }
        
        .chat-message {
          margin-bottom: 15px;
          line-height: 1.4;
          padding: 12px 15px;
          border-radius: 12px;
          max-width: 80%;
          position: relative;
          animation: messageIn 0.3s ease-out;
          word-wrap: break-word;
        }
        
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-username {
          font-weight: 600;
          margin-bottom: 5px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }
        
        .message-content {
          font-size: 0.95rem;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: #999;
          margin-top: 5px;
          text-align: right;
        }
        
        .user-message {
          margin-left: auto;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-top-right-radius: 5px;
          padding: 12px 15px;
        }
        
        .other-message {
          margin-right: auto;
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-top-left-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.85rem;
          color: #666;
          padding: 5px 15px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          width: fit-content;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .typing-dots {
          display: flex;
          margin-left: 5px;
        }
        
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #667eea;
          border-radius: 50%;
          margin: 0 2px;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        
        .chat-form {
          display: flex;
          gap: 10px;
          position: relative;
        }
        
        .chat-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }
        
        .chat-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .send-button {
          padding: 0 25px;
          font-size: 16px;
          background: linear-gradient(to right, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(102, 126, 234, 0.6);
        }
        
        .send-button:active {
          transform: translateY(0);
        }
        
        .send-icon {
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
        
        .send-button:hover .send-icon {
          transform: translateX(3px);
        }
        
        .chat-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.03;
          background-image: radial-gradient(#667eea 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .online-users {
          position: absolute;
          top: 20px;
          right: 20px;
          background: white;
          padding: 10px 15px;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          font-size: 0.85rem;
          color: #666;
          display: flex;
          align-items: center;
        }
        
        .online-dot {
          width: 8px;
          height: 8px;
          background: #4caf50;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }
      `}</style>

      <div className="app-container">
        <div className="chat-background"></div>
        
        <div className="app-header">
          <h2>Cosmic Chat <span className="user-badge">{username}</span></h2>
          <div className="online-users">
            <span className="online-dot"></span>
            Online
          </div>
        </div>
        
        <div className="chat-box" ref={chatBoxRef}>
          {chat.map((msg, index) => (
            <div 
              className={`chat-message ${msg.username === username ? 'user-message' : 'other-message'}`}
              key={index}
            >
              <div className="message-username">
                {msg.username === username ? 'You' : msg.username}
              </div>
              <div className="message-content">{msg.message}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="chat-form">
          <input
            type="text"
            placeholder="Send a message across the cosmos..."
            value={message}
            onChange={handleTyping}
            className="chat-input"
            ref={inputRef}
            autoFocus
          />
          <button type="submit" className="send-button">
            Send <span className="send-icon">✈️</span>
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
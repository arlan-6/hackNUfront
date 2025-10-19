'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { VacancyList } from '@/components/VacancyList/VacancyList';

const SOCKET_SERVER_URL = 'http://localhost:8000';
export default function HomePage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      path: '/socket.io', // Match the mount point on your FastAPI server
      transports: ['websocket'], // Ensure WebSocket is preferred
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    newSocket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, `Server: ${data.data}`]);
    });

    newSocket.on('response', (data) => {
      setMessages((prevMessages) => [...prevMessages, `Server Response: ${data.data}`]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      socket.emit('my_event', { message: inputMessage });
      setMessages((prevMessages) => [...prevMessages, `You: ${inputMessage}`]);
      setInputMessage('');
    }
  };
  return (
    <>
      <VacancyList />
      <div>
          <h1>FastAPI Socket.IO Chat</h1>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
    </>
  );
}

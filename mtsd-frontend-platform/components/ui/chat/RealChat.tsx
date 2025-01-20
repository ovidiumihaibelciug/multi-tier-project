"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Conversation from "./Conversation";
import Messages from "./Messages";

const Chat = ({ chats, activeChat, currentUserId }) => {
  const [messages, setMessages] = useState(activeChat?.messages);
  const [socket, setSocket] = useState(null);

  const currentChatId = activeChat?.id;

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket && currentChatId) {
      socket.emit("joinChat", currentChatId);
      return () => {
        socket.emit("leaveChat", currentChatId);
      };
    }
  }, [socket, currentChatId]);

  const sendMessage = (content) => {
    if (socket && currentChatId) {
      socket.emit("sendMessage", {
        chatId: currentChatId,
        senderId: currentUserId,
        content,
      });
    }
  };

  return (
    <div className="">
      <div className="flex bg-white dark:bg-gray-900">
        <div className="w-80 h-screen dark:bg-gray-800 p-2 hidden md:block">
          <div className="h-full overflow-y-auto">
            <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">
              Chat
            </div>
            <div className="search-chat flex p-3">
              <input
                className="input text-gray-700 dark:text-gray-200 text-sm p-3 focus:outline-none bg-gray-200 dark:bg-gray-700  w-full rounded-l-md"
                type="text"
                placeholder="Search Messages"
              />
              <div className="bg-gray-200 dark:bg-gray-700 flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">
              Recent
            </div>
            <Conversation chats={chats} />
          </div>
        </div>

        {/* Messages Section */}
        <div className="flex-grow h-screen p-2 rounded-md">
          <Messages
            activeChat={activeChat}
            currentUserId={currentUserId}
            messages={messages}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

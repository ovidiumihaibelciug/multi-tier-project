import React, { useState } from "react";

const Messages = ({ activeChat, currentUserId, messages, sendMessage }) => {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="flex-grow h-full flex flex-col">
      {/* Chat Header */}
      <div className="w-full h-15 p-1 bg-blue-600 dark:bg-gray-800 shadow-md rounded-xl rounded-bl-none rounded-br-none">
        <div className="flex p-2 align-middle items-center">
          <div className="p-2 md:hidden rounded-full mr-1 hover:bg-blue-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <div className="border rounded-full border-white p-1/2">
            <img
              className="w-14 h-14 rounded-full"
              src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            <div className="text-md text-gray-50 font-semibold">
              {activeChat?.participants
                ?.filter((participant) => participant.id !== currentUserId)
                .map((item) => item.name)
                .join(", ")}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="text-xs text-gray-50 ml-1">Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="w-full flex-grow bg-gray-100 dark:bg-gray-900 my-2 p-2 overflow-y-auto">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex items-end ${
              message.sender?.id === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.sender?.id !== currentUserId && (
              <img
                className="w-8 h-8 m-3 rounded-full"
                src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                alt="avatar"
              />
            )}
            <div
              className={`p-3 mx-3 my-1 rounded-2xl ${
                message.sender?.id === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="h-15 p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center">
          <input
            className="flex-grow p-3 text-sm bg-gray-200 dark:bg-gray-700 rounded-l-md focus:outline-none"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message ..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;

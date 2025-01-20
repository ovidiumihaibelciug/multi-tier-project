import React from "react";
import ConversationItem from "./ConversationItem";
const Conversation = ({ chats = [] }) => {
  return (
    <div className="p-1">
      {chats.map((item, index) => (
        <ConversationItem
          key={index}
          chatId={item.id}
          participants={item.participants}
          active={false}
        />
      ))}
    </div>
  );
};

export default Conversation;

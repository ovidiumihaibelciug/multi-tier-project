import { auth } from "@/auth";
import RealChat from "@/components/ui/chat/RealChat";
import axios from "axios";

export default async function Component({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const session = await auth();
  const user = session?.user;

  const resChats = await axios.get(`http://localhost:3001/chats`, {
    headers: {
      "X-User-ID": user?.id,
    },
  });

  const chats = resChats.data;

  const res = await axios.get(`http://localhost:3001/chats/${chatId}`, {
    headers: {
      "X-User-ID": user?.id,
    },
  });

  const activeChat = res.data;

  console.log("chats", chats);

  return (
    <div>
      <RealChat
        chats={chats}
        activeChat={activeChat}
        currentUserId={user?.id}
      />
    </div>
  );
}

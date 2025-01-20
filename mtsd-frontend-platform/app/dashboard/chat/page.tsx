import { auth } from "@/auth";
import RealChat from "@/components/ui/chat/RealChat";
import axios from "axios";

export default async function Component() {
  const session = await auth();
  const user = session?.user;

  const res = await axios.get("http://localhost:3001/chats", {
    headers: {
      "X-User-ID": user?.id,
    },
  });

  const chats = res.data;

  console.log("chats: ", chats);

  return (
    <div>
      <RealChat chats={chats} />
    </div>
  );
}

import Link from "next/link";

const ConversationItem = ({ chatId, participants = [], active }) => {
  const _class = active ? "bg-gray-200" : "bg-white";

  return (
    <Link href={`/dashboard/chat/${chatId}`}>
      <div
        className={
          "conversation-item p-1 dark:bg-gray-700 hover:bg-gray-200 m-1 rounded-md " +
          _class
        }
      >
        <div className={"flex items-center p-2  cursor-pointer  "}>
          <div className="w-7 h-7 m-1">
            <img
              className="rounded-full"
              src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            {participants.map((participant) => {
              return (
                <div
                  className="flex justify-between text-md "
                  key={participant?.id}
                >
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {participant?.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;

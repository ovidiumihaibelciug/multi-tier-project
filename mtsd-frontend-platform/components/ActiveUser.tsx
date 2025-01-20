import { logout } from "@/actions/auth";
import { auth } from "@/auth";

import { Button } from "@/components/ui/button";

const ActiveUser = async () => {
  const session = await auth();

  return (
    <form action={logout}>
      <div>
        <p>{session?.user?.name}</p>
      </div>
      <Button type="submit" className="w-40" variant="secondary">
        logout
      </Button>
    </form>
  );
};

export default ActiveUser;

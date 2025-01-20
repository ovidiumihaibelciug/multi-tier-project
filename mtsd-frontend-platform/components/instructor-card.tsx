import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function InstructorCard({ instructor }) {
  console.log("instructor", instructor);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src="/placeholder.svg?height=64&width=64"
            alt="Dr. Jane Smith"
          />
          <AvatarFallback>
            {instructor?.name?.split(" ")[0][0] +
              instructor?.name?.split(" ")[1][0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">Dr. {instructor?.name}</h3>
          <p className="text-sm text-muted-foreground">{instructor?.email}</p>
          <Link
            href={`/dashboard/user/${instructor.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

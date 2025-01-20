import React from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

async function fetchAnnouncements() {
  try {
    const res = await axios.get("http://localhost:3001/announcements");
    return res?.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;
  const userRole = user?.type;
  const announcements = await fetchAnnouncements();

  console.log("user", user);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        {userRole === "TEACHER" && (
          <Link href="/dashboard/announcement/create">
            <Button>Create Announcement</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        {announcements?.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDescription>
                {announcement.course
                  ? `Course: ${announcement.course.title}`
                  : "General Announcement"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{announcement.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={`/dashboard/announcement/${announcement.id}`}>
                Read More
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

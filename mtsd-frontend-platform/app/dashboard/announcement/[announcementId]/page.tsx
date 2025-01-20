import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getAnnouncement(id: string) {
  const res = await fetch(`http://localhost:3001/announcements/${id}`, {
    cache: "no-store",
  });

  console.log("res: ", res);

  if (!res.ok) {
    throw new Error("Failed to fetch the announcement");
  }

  return res.json();
}

const AnnouncementPage = async ({
  params,
}: {
  params: { announcementId: string };
}) => {
  const announcement = await getAnnouncement(params.announcementId);

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>{announcement.title}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{announcement.content}</p>
          {announcement.course && (
            <p className="mt-4 text-sm">
              Associated Course:{" "}
              <span className="font-bold">{announcement.course.title}</span>
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Created At: {new Date(announcement.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Link href={`/dashboard/announcement/${announcement.id}/edit`}>
          <Button>Edit Announcement</Button>
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementPage;

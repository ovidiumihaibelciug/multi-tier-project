import React from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

async function getUser(userId: string) {
  const res = await axios.get(`http://localhost:3001/users/${userId}`);
  if (!res.data) {
    throw new Error("Failed to fetch the user.");
  }
  return res.data;
}

async function getUserRelatedData(userId: string) {
  const [coursesRes, announcementsRes] = await Promise.all([
    axios.get(`http://localhost:3001/courses?userId=${userId}`),
    axios.get(`http://localhost:3001/announcements?userId=${userId}`),
  ]);

  return {
    courses: coursesRes.data || [],
    announcements: announcementsRes.data || [],
  };
}

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await getUser(params.userId);
  const { courses, announcements } = await getUserRelatedData(params.userId);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {user.name} ({user.type})
          </CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Type:</strong> {user.type}
          </p>
          <p>
            <strong>Registered At:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Credits:</strong> {course.credits || "N/A"}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {course.schedule || "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No courses associated with this user.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Announcements</h2>
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement: any) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle>{announcement.title}</CardTitle>
                  {announcement.course && (
                    <CardDescription>
                      Course: {announcement.course.title}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No announcements found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

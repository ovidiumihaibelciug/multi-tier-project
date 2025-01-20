import React from "react";
import axios from "axios";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

const Courses = async () => {
  const res = await axios.get("http://localhost:3001/courses");
  const courses = res?.data;

  const session = await auth();
  const isTeacher = session?.user?.type === "TEACHER";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {isTeacher && (
          <Link href="/dashboard/courses/create">
            <Button>Add Course</Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(
          (course: { id: number; title: string; description: string }) => (
            <Link
              href={`/dashboard/course/${course.id}`}
              key={course.id}
              className="p-4 border rounded-md shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.description}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Courses;

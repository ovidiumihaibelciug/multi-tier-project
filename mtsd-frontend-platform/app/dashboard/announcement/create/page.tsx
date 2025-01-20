"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const announcementSchema = z.object({
  title: z.string().nonempty("Title is required"),
  content: z.string().nonempty("Content is required"),
  courseId: z.string().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function CreateAnnouncement() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
  });

  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("http://localhost:3001/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }

    fetchCourses();
  }, []);

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      await axios.post("http://localhost:3001/announcements", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Announcement</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Announcement Title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Announcement Content"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="course">Associate with Course (Optional)</Label>
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => {
              console.log("field", field);

              console.log("courses", courses);

              console.log(
                "courses?.find((item) => item.id === field?.value)?.title",
                courses?.find((item) => item.id === field?.value)?.title
              );
              return (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={parseInt(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.courseId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.courseId.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Announcement
        </Button>
      </form>
    </div>
  );
}

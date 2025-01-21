"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function EditAnnouncementPage({
  params,
}: {
  params: { announcementId: string };
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
  });

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const res = await axios.get(
          `http://localhost:3001/announcements/${params.announcementId}`
        );
        const { title, content, course } = res.data;

        setValue("title", title);
        setValue("content", content);
        setValue("courseId", course?.id || "");
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    }

    fetchAnnouncement();
  }, [params.announcementId, setValue]);

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      await axios.patch(
        `http://localhost:3001/announcements/${params.announcementId}`,
        data
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update announcement:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>
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

        <Button type="submit" className="w-full">
          Update Announcement
        </Button>
      </form>
    </div>
  );
}

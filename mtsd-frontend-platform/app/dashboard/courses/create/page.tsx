"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  credits: z.coerce.number().positive("Credits must be greater than zero"),
  schedule: z.string().optional(),
  location: z.string().optional(),
  maxStudents: z.coerce.number().positive("Must be greater than zero"),
  resources: z.array(z.string()).optional(),
  syllabus: z.array(
    z.object({
      week: z.coerce.number().positive("Week must be greater than zero"),
      topic: z.string().min(1, "Topic is required"),
      content: z.string().min(1, "Content is required"),
    })
  ),
  teacherId: z.string().min(1, "Teacher is required"),
  studentIds: z.array(z.string()).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CoursesCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      resources: [""],
      syllabus: [{ week: 1, topic: "", content: "" }],
      studentIds: [],
      maxStudents: 15,
      credits: 3,
    },
  });

  const {
    fields: resourceFields,
    append: addResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: "resources",
  });

  const {
    fields: syllabusFields,
    append: addSyllabus,
    remove: removeSyllabus,
  } = useFieldArray({
    control,
    name: "syllabus",
  });

  const [teachers, setTeachers] = React.useState([]);
  const [students, setStudents] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const teacherResponse = await axios.get(
          "http://localhost:3001/users?type=TEACHER"
        );
        const studentResponse = await axios.get(
          "http://localhost:3001/users?type=STUDENT"
        );

        setTeachers(teacherResponse.data);
        setStudents(studentResponse.data);
      } catch (error) {
        console.error("Failed to fetch teachers or students:", error);
        setSubmitError("Failed to load teachers and students");
      }
    }

    fetchData();
  }, []);

  React.useEffect(() => {
    console.log("Current form errors:", errors);
  }, [errors]);

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log("Submitting form data:", data);
      const response = await axios.post("http://localhost:3001/courses", data);
      console.log("Course created successfully:", response.data);
      router.push("/dashboard/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to create course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Course</h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Course Title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Course Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Credits */}
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            placeholder="Credits"
            {...register("credits")}
          />
          {errors.credits && (
            <p className="text-red-500 text-sm mt-1">
              {errors.credits.message}
            </p>
          )}
        </div>

        {/* Max Students */}
        <div>
          <Label htmlFor="maxStudents">Max Students</Label>
          <Input
            id="maxStudents"
            type="number"
            placeholder="Max number of students"
            {...register("maxStudents")}
          />
          {errors.maxStudents && (
            <p className="text-red-500 text-sm mt-1">
              {errors.maxStudents.message}
            </p>
          )}
        </div>

        {/* Teacher */}
        <div>
          <Label>Teacher</Label>
          <Select onValueChange={(value) => setValue("teacherId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher: { id: string; name: string }) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teacherId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.teacherId.message}
            </p>
          )}
        </div>

        {/* Students */}
        <div>
          <Label>Students</Label>
          <div className="relative">
            <Select
              onValueChange={(value) => {
                const currentValues = watch("studentIds") || [];
                if (!currentValues.includes(value)) {
                  setValue("studentIds", [...currentValues, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select students (optional)" />
              </SelectTrigger>
              <SelectContent>
                {students
                  .filter(
                    (student) =>
                      !(watch("studentIds") || []).includes(student.id)
                  )
                  .map((student: { id: string; name: string }) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Display selected students */}
            <div className="mt-2 flex flex-wrap gap-2">
              {watch("studentIds")?.map((studentId: string) => {
                const student = students.find((s) => s.id === studentId);
                return student ? (
                  <div
                    key={studentId}
                    className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"
                  >
                    <span>{student.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValues = watch("studentIds") || [];
                        setValue(
                          "studentIds",
                          currentValues.filter((id) => id !== studentId)
                        );
                      }}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div>
          <Label>Resources</Label>
          {resourceFields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 mt-2">
              <Input
                placeholder="Resource URL or name"
                {...register(`resources.${index}`)}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeResource(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addResource("")}
            className="mt-2"
          >
            Add Resource
          </Button>
        </div>

        {/* Syllabus */}
        <div>
          <Label>Syllabus</Label>
          {syllabusFields.map((field, index) => (
            <div key={field.id} className="space-y-2 mt-4 p-4 border rounded">
              <div className="flex space-x-2">
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Week"
                    {...register(`syllabus.${index}.week`)}
                  />
                </div>
                <Input
                  placeholder="Topic"
                  {...register(`syllabus.${index}.topic`)}
                />
              </div>
              <Textarea
                placeholder="Content"
                {...register(`syllabus.${index}.content`)}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeSyllabus(index)}
              >
                Remove Week
              </Button>
              {errors.syllabus?.[index] && (
                <div className="text-red-500 text-sm">
                  {errors.syllabus[index]?.week?.message ||
                    errors.syllabus[index]?.topic?.message ||
                    errors.syllabus[index]?.content?.message}
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addSyllabus({
                week: syllabusFields.length + 1,
                topic: "",
                content: "",
              })
            }
            className="mt-2"
          >
            Add Week
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Course..." : "Create Course"}
        </Button>
      </form>
    </div>
  );
}

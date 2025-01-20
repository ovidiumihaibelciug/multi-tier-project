import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import EnrollButton from "@/components/enroll-button";
import InstructorCard from "@/components/instructor-card";
import ReviewsSection from "@/components/reviews-section";
import SyllabusAccordion from "@/components/syllabus-accordion";
import axios from "axios";
import Link from "next/link";

export default async function EnhancedCoursePage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;
  const res = await axios.get(`http://localhost:3001/courses/${id}`);
  const course = res.data;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-[300px] bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-4">
            {course.title}
          </h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {course.state}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {course.credits} Credits
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{course.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Max {course.maxStudents} students</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="syllabus" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              <TabsContent value="syllabus">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SyllabusAccordion items={course.syllabus || []} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.resources ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {course.resources.map(
                          (resource: string, index: number) => (
                            <li key={index}>{resource}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No resources available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      {course.students.map(
                        (student: { id: string; name: string }) => {
                          return <div key={student.id}>- {student.name}</div>;
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Course Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col">
                <Link
                  href={`/dashboard/course/${id}/quizzes`}
                  className="w-full"
                >
                  View quizzes
                </Link>
                <Link href={`/dashboard/course/${id}/learn`} className="w-full">
                  Learn
                </Link>
              </CardContent>
            </Card>

            <InstructorCard instructor={course.teacher} />
          </div>
        </div>
      </main>
    </div>
  );
}

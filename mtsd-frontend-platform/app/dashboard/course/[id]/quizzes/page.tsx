import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";

export default async function CourseQuizzesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const res = await axios.get(`http://localhost:3001/quizzes`);
  const quizzes = res.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Course Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(
          (quiz: { id: string; title: string; description: string }) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <div className="p-4">
                <Link
                  href={`/dashboard/course/${id}/quizzes/${quiz.id}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Start Quiz
                </Link>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

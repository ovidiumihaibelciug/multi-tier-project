"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Question from "./Question";
import Link from "next/link";
import axios from "axios";

interface QuizQuestion {
  id: string;
  content: string;
  type: string;
  choices: string[];
  correctAnswers: string[];
}

interface QuizProps {
  id: string;
  quizId?: string;
  questions: QuizQuestion[];
}

export default function Quiz({ id, quizId, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerSelect = (selectedAnswer: string) => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      axios
        .post("http://localhost:3001/quizzes/submit", {
          answers: newAnswers,
          studentId: "9059dfda-ac8e-4b52-8efc-1c7e49b45609",
          quizId: quizId,
          score: 0,
        })
        .then((data) => {
          console.log("data", data);
        })
        .catch((err) => {
          console.error(err);
        });

      setShowScore(true);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      const correctAnswers = questions[index].correctAnswers;

      return score + (correctAnswers.includes(answer.toString()) ? 1 : 0);
    }, 0);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Quiz App
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Quiz Completed!</h2>
            <p className="text-lg">
              Your score: {calculateScore()} out of {questions.length}
            </p>
          </div>
        ) : (
          <Question
            question={questions[currentQuestion].content}
            options={questions[currentQuestion].choices}
            onAnswerSelect={handleAnswerSelect}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {showScore && (
          <Link href={`/dashboard/course/${id}/quizzes`}>Go back</Link>
        )}
      </CardFooter>
    </Card>
  );
}

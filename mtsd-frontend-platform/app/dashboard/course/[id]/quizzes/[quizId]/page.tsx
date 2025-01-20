import Quiz from "@/components/Quiz";
import axios from "axios";
import React from "react";

const QuizPage = async ({
  params,
}: {
  params: {
    id: string;
    quizId: string;
  };
}) => {
  const { id, quizId } = await params;
  const res = await axios.get(`http://localhost:3001/quizzes/${quizId}`);
  const quiz = res.data;

  return (
    <div>
      <Quiz id={id} quizId={quizId} questions={quiz.questions} />
    </div>
  );
};

export default QuizPage;

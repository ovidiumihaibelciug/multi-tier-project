import Chat from "@/components/Chat";
import axios from "axios";
import React from "react";

const LearnPage = async ({ params }: { params: { id: string } }) => {
  const res = await axios.get(`http://localhost:3001/courses/${params.id}`);
  const course = res.data;

  return <Chat course={course} />;
};

export default LearnPage;

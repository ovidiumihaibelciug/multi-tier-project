import { Button } from "@/components/ui/button";

interface QuestionProps {
  question: string;
  options: string[];
  onAnswerSelect: (selectedAnswer: string) => void;
}

export default function Question({
  question,
  options,
  onAnswerSelect,
}: QuestionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <div className="grid gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(option.toString())}
            variant="outline"
            className="w-full text-left justify-start h-auto py-3 px-4"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

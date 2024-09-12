import Touch from "./usabilityMethods/Touch";

function BroodPattern({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default BroodPattern;

import Touch from "./usabilityMethods/Touch";

function Symptoms({ answerQuestion }: { answerQuestion: (answer: string[]) => void }) {
  return <Touch answerQuestion={(answer: string[]) => answerQuestion(answer)} />;
}

export default Symptoms;

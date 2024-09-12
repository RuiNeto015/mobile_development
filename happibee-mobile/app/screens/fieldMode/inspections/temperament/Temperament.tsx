import Touch from "./usabilityMethods/Touch";

function Temperament({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default Temperament;

import Touch from "./usabilityMethods/Touch";

function Diseases({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default Diseases;

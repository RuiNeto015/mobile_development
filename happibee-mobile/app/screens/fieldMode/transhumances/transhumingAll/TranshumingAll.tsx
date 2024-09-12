import Touch from "./usabilityMethods/Touch";

function TranshumingAll({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default TranshumingAll;

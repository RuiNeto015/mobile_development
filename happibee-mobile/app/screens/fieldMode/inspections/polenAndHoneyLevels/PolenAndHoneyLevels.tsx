import Touch from "./usabilityMethods/Touch";

function PolenAndHoneyLevels({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default PolenAndHoneyLevels;

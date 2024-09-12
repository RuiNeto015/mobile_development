import Touch from "./usabilityMethods/Touch";

function AdditionalNotes({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default AdditionalNotes;

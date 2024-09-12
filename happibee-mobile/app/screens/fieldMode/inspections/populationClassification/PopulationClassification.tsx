import Touch from "./usabilityMethods/Touch";

function PopulationClassification({
  answerQuestion,
}: {
  answerQuestion: (answer: string) => void;
}) {
  return <Touch answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default PopulationClassification;

import Touch from "./usabilityMethods/Touch";

function SelectAnotherHive({
  answerQuestion,
  indetifiedHive,
}: {
  answerQuestion: (answer: string) => void;
  indetifiedHive: string;
}) {
  return (
    <Touch
      indetifiedHive={indetifiedHive}
      answerQuestion={(answer: string) => answerQuestion(answer)}
    />
  );
}

export default SelectAnotherHive;

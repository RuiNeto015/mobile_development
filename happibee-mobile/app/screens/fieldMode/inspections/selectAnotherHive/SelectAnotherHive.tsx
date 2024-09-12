import Touch from "./usabilityMethods/Touch";

function SelectAnotherHive({
  answerQuestion,
  allHivesDone,
}: {
  answerQuestion: (answer: string) => void;
  allHivesDone: boolean;
}) {
  return <Touch allHivesDone={allHivesDone} answerQuestion={(answer: string) => answerQuestion(answer)} />;
}

export default SelectAnotherHive;

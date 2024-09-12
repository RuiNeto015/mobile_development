import { Button } from "native-base";
import { Text, View } from "react-native";

function Touch({
  answerQuestion,
  allHivesDone,
}: {
  answerQuestion: (answer: string) => void;
  allHivesDone: boolean;
}) {
  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">
        Como pretende prosseguir?
      </Text>

      <View className="flex-col justify-center items-center w-full space-y-4">
        <Button
          disabled={allHivesDone}
          _text={{ fontSize: "2xl" }}
          className={`h-32 w-full bg-tertiary rounded-full ${allHivesDone ? "opacity-50" : ""}`}
          onPress={() => answerQuestion("Não")}
        >
          Inspecionar outra colmeia
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-tertiary rounded-full"
          onPress={() => answerQuestion("end")}
        >
          Terminar inspeção
        </Button>
      </View>
    </View>
  );
}

export default Touch;

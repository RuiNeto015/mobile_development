import { Button } from "native-base";
import { Text, View } from "react-native";

function Touch({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">
        Pretende transumar todas as colmeias?
      </Text>

      <View className="flex-col justify-center items-center w-full space-y-4">
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-tertiary rounded-full"
          onPress={() => answerQuestion("Sim")}
        >
          Sim
        </Button>
        <Button
          disabled={true}
          _text={{ fontSize: "2xl" }}
          className={`h-32 w-full bg-tertiary opacity-50 rounded-full`}
          onPress={() => answerQuestion("Não")}
        >
          Não
        </Button>
      </View>
    </View>
  );
}

export default Touch;

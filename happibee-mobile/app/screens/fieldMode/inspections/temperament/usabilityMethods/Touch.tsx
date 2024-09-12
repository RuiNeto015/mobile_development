import { Button } from "native-base";
import { Text, View } from "react-native";

function Touch({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">
        Como classifica o temperamento da colmeia?
      </Text>

      <View className="flex-col justify-center items-center w-full space-y-4">
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-green-800 rounded-full"
          onPress={() => answerQuestion("Calmo")}
        >
          Calmo
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-red-800 rounded-full"
          onPress={() => answerQuestion("Agressivo")}
        >
          Agressivo
        </Button>
      </View>
    </View>
  );
}

export default Touch;

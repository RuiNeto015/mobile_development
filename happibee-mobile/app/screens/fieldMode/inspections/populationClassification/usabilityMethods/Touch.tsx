import { Button } from "native-base";
import { Text, View } from "react-native";

function Touch({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-6">
      <Text className="font-light text-4xl text-on_background text-center">
        Como classifica a população da colmeia?
      </Text>

      <View className="flex-col justify-center items-center w-full space-y-4">
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-green-800 rounded-full"
          onPress={() => answerQuestion("Muito boa")}
        >
          Muito boa
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-green-600 rounded-full"
          onPress={() => answerQuestion("Normal")}
        >
          Normal
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-red-600 rounded-full"
          onPress={() => answerQuestion("Baixa")}
        >
          Baixa
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-red-800 rounded-full"
          onPress={() => answerQuestion("Muito baixa")}
        >
          Muito baixa
        </Button>
      </View>
    </View>
  );
}

export default Touch;

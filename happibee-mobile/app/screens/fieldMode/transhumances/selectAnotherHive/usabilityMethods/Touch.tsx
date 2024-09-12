import { Button } from "native-base";
import { Text, View } from "react-native";

function Touch({
  answerQuestion,
  indetifiedHive,
}: {
  answerQuestion: (answer: string) => void;
  indetifiedHive: string;
}) {
  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">
        Colmeia {`"${indetifiedHive}"`} indentificada
      </Text>

      <View className="flex-col justify-center items-center w-full space-y-4">
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-tertiary rounded-full"
          onPress={() => answerQuestion("continuar")}
        >
          Continuar leitura
        </Button>
        <Button
          _text={{ fontSize: "2xl" }}
          className="h-32 w-full bg-tertiary rounded-full"
          onPress={() => answerQuestion("terminar")}
        >
          Terminar
        </Button>
      </View>
    </View>
  );
}

export default Touch;

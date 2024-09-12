import { Button, TextArea } from "native-base";
import React, { useState } from "react";
import { Text, View } from "react-native";

function Touch({ answerQuestion }: { answerQuestion: (answer: string) => void }) {
  const [text, setText] = useState<string>("");

  return (
    <View className="flex-col justify-center items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">Notas adicionais</Text>

      <View className="flex-col justify-center items-center w-full space-y-4 h-3/4">
        <TextArea
          value={text}
          fontSize={"2xl"}
          autoCompleteType={false}
          placeholder="Escreva aqui..."
          h={"70%"}
          bgColor={"white"}
          focusOutlineColor={"black"}
          onChangeText={(text:string) => setText(text)}
        />
        <Button
          _text={{ fontSize: "2xl" }}
          className="rounded-full bg-tertiary h-1/6 w-2/3"
          onPress={() => answerQuestion(text)}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}

export default Touch;

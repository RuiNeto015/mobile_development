import { Button, Input } from "native-base";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IconA from "react-native-vector-icons/Fontisto";

const Tag = ({ text, deleteTag }: { text: string; deleteTag: () => void }) => {
  return (
    <View className="flex flex-row items-center rounded-lg bg-secondary p-1 w-28 mx-1 border border-black">
      <Pressable className="justify-self-start mr-1" onPress={() => deleteTag()}>
        <Icon name="close" size={25} color={"#ffffff"} />
      </Pressable>
      <Text className="text-on_primary text-lg">{text}</Text>
    </View>
  );
};

function Touch({ answerQuestion }: { answerQuestion: (answer: string[]) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  const handleChange = (text: string) => {
    setInputText(text);
  };

  const deleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
  };

  const addTag = (tag: string) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    setInputText(""); // Clear the input text after adding a tag
  };

  return (
    <View className="flex-col justify-around items-center h-full w-full bg-background px-2 space-y-16">
      <Text className="font-light text-4xl text-on_background text-center">
        Indique os sintomas da colmeia?
      </Text>
      <View className="flex flex-col justify-center items-center w-full space-y-4">
        <View className="flex flex-row">
          {tags.map((value, index) =>
            index < 3 ? <Tag deleteTag={() => deleteTag(value)} text={value} /> : null
          )}
        </View>
        {tags.length > 3 ? (
          <View className="flex flex-row">
            {tags.map((value, index) =>
              index >= 3 ? <Tag deleteTag={() => deleteTag(value)} text={value} /> : null
            )}
          </View>
        ) : null}
      </View>
      <View className="flex flex-row justify-center items-center space-x-4">
        <View className="w-2/3">
          <Input
            size={"2xl"}
            value={inputText}
            onChangeText={handleChange}
            variant="rounded"
            isDisabled={tags.length > 5}
            bgColor={"white"}
            focusOutlineColor={"black"}
            placeholder="Varrose"
          />
        </View>
        <Button
          disabled={inputText.length == 0}
          className={`rounded-full bg-tertiary ${inputText.length == 0 ? "opacity-50" : ""}`}
          onPress={() => addTag(inputText)}
        >
          <IconA name="plus-a" size={25} color={"#ffffff"} />
        </Button>
      </View>
      <Button
        _text={{ fontSize: "2xl" }}
        className="rounded-full bg-tertiary h-1/6 w-2/3"
        onPress={() => answerQuestion(tags)}
      >
        Continuar
      </Button>
    </View>
  );
}

export default Touch;

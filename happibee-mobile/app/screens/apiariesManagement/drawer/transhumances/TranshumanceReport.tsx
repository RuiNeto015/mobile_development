import { FlatList, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Divider } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import { ITranshumanceDraft } from "../../../../schemas/interfaces/ITranshumance";

const Item = ({
  name,
  onDelete,
  canDelete,
}: {
  name: string;
  onDelete: () => void;
  canDelete: boolean;
}) => (
  <View className="flex flex-col space-y-3">
    <View className=" flex flex-row justify-between rounded-full items-center py-2">
      <Text className="text-lg text-black text-start">{name}</Text>
      {/* <Button
        disabled={!canDelete}
        onPress={() => onDelete()}
        className={`bg-red-800 p-1 rounded-2xl ${canDelete == false ? "bg-red-100" : ""}`}
      >
        <Icon name="delete" size={20} color={"white"} />
      </Button> */}
    </View>
    <Divider />
  </View>
);

function TranshumanceReport({ navigation, route }: NativeStackScreenProps<any>) {
  const [draft, setDraft] = useState<ITranshumanceDraft>({ ...route.params?.draft });

  const handleDelete = (hiveName: string) => {
    const updatedHives = draft.hives.filter((hive) => hive !== hiveName);
    const updatedDraft = { ...draft, hives: updatedHives };
    setDraft(updatedDraft);
    //DatabaseInspectionsService.update(inspection?.id || "", updatedHives);
  };

  const handleRegister = () => {
    console.log("click");
  };

  return (
    <View className="flex flex-col h-full w-full bg-white items-center pt-5 pb-5 px-4 space-y-5">
      <View className="flex flex-col items-center space-y-2">
        <Text className="text-2xl font-bold text-gray-800">Rascunho de transumância</Text>
        <Text className="text-xl font-bold text-gray-800">{draft.apiaryName}</Text>
        <Text className="text-md  text-gray-800">{draft.date}</Text>
      </View>
      <Text className="text-lg font-md font-light text-gray-800 self-start">
        Colmeias a transumar
      </Text>
      <FlatList
        className="w-full"
        data={draft.hives}
        renderItem={({ item }) => (
          <Item
            canDelete={draft.hives.length > 1}
            name={item || ""}
            onDelete={() => handleDelete(item || "")}
          />
        )}
        keyExtractor={(item) => item || ""}
      />
      <Button
        className="bg-tertiary"
        onPress={() => (handleRegister(), navigation.navigate("register_form_1", { draft: draft }))}
      >
        <Text className="text-3xl text-on_tertiary">Registar</Text>
      </Button>
    </View>
  );
}

export default TranshumanceReport;

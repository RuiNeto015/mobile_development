import { FlatList, Pressable, Text, View } from "react-native";
import { IInspection } from "../../../../schemas/interfaces/IInspection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Divider } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import { DatabaseInspectionsService } from "../../../../services/db";

const Item = ({
  name,
  onDelete,
  canDelete,
  navigate,
}: {
  name: string;
  onDelete: () => void;
  canDelete: boolean;
  navigate: () => void;
}) => (
  <View className="flex flex-col space-y-3">
    <View className=" flex flex-row justify-between rounded-full items-center py-2">
      <Pressable className="w-2/3" onPress={() => navigate()}>
        <Text className="text-lg text-black text-start">{name}</Text>
      </Pressable>
      <Button
        disabled={!canDelete}
        onPress={() => onDelete()}
        className={`bg-red-800 p-1 rounded-2xl ${canDelete == false ? "bg-red-100" : ""}`}
      >
        <Icon name="delete" size={20} color={"white"} />
      </Button>
    </View>
    <Divider />
  </View>
);

function InspectionReport({ navigation, route }: NativeStackScreenProps<any>) {
  const [inspection, setInspection] = useState<IInspection>({ ...route.params?.inspection });

  const handleDelete = (hiveId: string) => {
    const updatedHives = inspection.hives.filter((hive) => hive.hiveId !== hiveId);
    const updatedInspection = { ...inspection, hives: updatedHives };
    setInspection(updatedInspection);
    DatabaseInspectionsService.update(inspection?.id || "", updatedHives);
  };

  const handleRegister = () => {
    DatabaseInspectionsService.convertDraft(inspection?.id || "");
    navigation.navigate("inspections_draft");
  };

  return (
    <View className="flex flex-col h-full w-full bg-white items-center pt-5 pb-5 px-4 space-y-5">
      <View className="flex flex-col items-center space-y-2">
        <Text className="text-3xl font-bold text-gray-800">Relatório de inspeção</Text>
        <Text className="text-xl font-bold text-gray-800">{inspection.apiaryName}</Text>
        <Text className="text-md  text-gray-800">{inspection.date}</Text>
      </View>
      <View className="flex flex-row justify-center w-full items-center">
        <View className="flex flex-col items-center">
          <Text className="text-md font-bold text-gray-800">Iniciada às</Text>
          <Text className="text-md text-gray-800">{inspection.startTime}</Text>
        </View>
        <Divider className="w-2/4 mx-3 bg-black" />
        <View className="flex flex-col items-center">
          <Text className="text-md font-bold text-gray-800">Terminada às</Text>
          <Text className="text-md text-gray-800">{inspection.endTime}</Text>
        </View>
      </View>
      <Text className="text-lg font-md text-gray-800">Colmeias inspecionadas</Text>
      <FlatList
        className="w-full"
        data={inspection.hives}
        renderItem={({ item }) => (
          <Item
            canDelete={inspection.hives.length > 1}
            name={item.hiveName || ""}
            onDelete={() => handleDelete(item.hiveId || "")}
            navigate={() =>
              navigation.navigate("hive_inspection_report", {
                inspectionId: inspection.id,
                hiveId: item.hiveId,
                inspectionData: item,
                date: inspection.date,
              })
            }
          />
        )}
        keyExtractor={(item) => item.hiveId || ""}
      />
      <Button className="bg-tertiary" onPress={() => handleRegister()}>
        <Text className="text-3xl text-on_tertiary">Registar</Text>
      </Button>
    </View>
  );
}

export default InspectionReport;

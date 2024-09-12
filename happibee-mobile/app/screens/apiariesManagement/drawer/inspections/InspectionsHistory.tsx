import { Button, Divider, FlatList } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { DatabaseInspectionsService } from "../../../../services/db";
import { IInspection } from "../../../../schemas/interfaces/IInspection";
import { useFocusEffect } from "@react-navigation/native";

const Item = ({ date, hour }: { date: string; hour: string }) => (
  <View className="flex flex-col space-y-3 mx-6">
    <View className=" flex flex-row justify-center rounded-full items-center py-2">
      <Pressable>
        <View className="flex flex-row justify-between w-2/3">
          <Text className="text-lg text-black text-center">{date}</Text>
          <Text className="text-lg text-black text-center">{hour}</Text>
        </View>
      </Pressable>
      <Button className="bg-red-800 p-1 rounded-2xl">
        <Icon name="delete" size={20} color={"white"} />
      </Button>
    </View>
    <Divider />
  </View>
);

function InspectionsHistory() {
  const [inspections, setInspections] = useState<IInspection[]>([]);

  useFocusEffect(
    useCallback(() => {
      DatabaseInspectionsService.getAll("registered").then((inspections) =>
      setInspections(inspections)
    );
    console.log(inspections);
    }, [])
  );

  return (
    <View className="bg-white h-full">
      <View className="flex flex-col space-y-3 mx-6">
        <View className=" flex flex-row justify-start rounded-full items-center pt-4">
          <View className="flex flex-row space-x-32 w-2/3">
            <Text className="text-md font-light text-gray-400 text-center">Data</Text>
            <Text className="text-md font-light text-gray-400 text-center">Hora</Text>
          </View>
        </View>
        <Divider />
      </View>
      <FlatList
        className="w-full"
        data={inspections}
        renderItem={({ item }) => <Item date={item.date} hour={item.startTime} />}
        keyExtractor={(item) => item.id || ""}
      />
    </View>
  );
}

export default InspectionsHistory;

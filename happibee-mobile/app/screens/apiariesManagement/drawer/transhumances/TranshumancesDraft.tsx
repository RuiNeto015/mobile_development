import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DatabaseTranshumanceService } from "../../../../services/db";
import { ITranshumanceDraft } from "../../../../schemas/interfaces/ITranshumance";
import { Button, Divider, FlatList } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Item = ({
  date,
  hour,
  onDelete,
  navigate,
}: {
  date: string;
  hour: string;
  onDelete: () => void;
  navigate: () => void;
}) => (
  <View className="flex flex-col space-y-3 mx-6">
    <View className=" flex flex-row justify-center rounded-full items-center py-2">
      <Pressable onPress={() => navigate()}>
        <View className="flex flex-row justify-between w-2/3">
          <Text className="text-lg text-black text-center">{date}</Text>
          <Text className="text-lg text-black text-center">{hour}</Text>
        </View>
      </Pressable>
      <Button onPress={() => onDelete()} className="bg-red-800 p-1 rounded-2xl">
        <Icon name="delete" size={20} color={"white"} />
      </Button>
    </View>
    <Divider />
  </View>
);

function TranshumancesDraft({ navigation }: NativeStackScreenProps<any>) {
  const [drafts, setDrafts] = useState<ITranshumanceDraft[]>([]);

  useFocusEffect(
    useCallback(() => {
      DatabaseTranshumanceService.getDrafts().then((drafts) => setDrafts(drafts));
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await DatabaseTranshumanceService.deleteDraft(id);
    } catch (err) {
      console.log(err);
    }

    const updatedDrafts = await DatabaseTranshumanceService.getDrafts();
    setDrafts(updatedDrafts);
  };

  return (
    <View className="bg-white h-full">
      {drafts.length == 0 ? (
        <View className="w-full mt-6 items-center">
          <Text>A lista de transumâncias está vazia</Text>
        </View>
      ) : (
        <>
          <View className="flex flex-col space-y-3 mx-6 items-center">
            <Text className="text-2xl font-bold my-2 text-black">Rascunhos de Transumância</Text>
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
            data={drafts}
            renderItem={({ item }) => (
              <Item
                date={item.date}
                hour={item.hour}
                onDelete={() => handleDelete(item.id || "")}
                navigate={() => navigation.navigate("transhumance_report", { draft: item })}
              />
            )}
            keyExtractor={(item) => item.id || ""}
          />
        </>
      )}
    </View>
  );
}

export default TranshumancesDraft;

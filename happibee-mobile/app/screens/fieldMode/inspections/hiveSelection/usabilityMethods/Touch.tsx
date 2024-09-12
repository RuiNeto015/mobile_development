import { FlatList, Text } from "native-base";
import { Pressable, View } from "react-native";
import { IBeehive } from "../../../../../schemas/interfaces/IApiary";

const Item = ({ title, selectHive }: { title: string; selectHive: () => void }) => (
  <Pressable onPress={() => selectHive()}>
    <View className=" flex flex-col space-y-3 bg-tertiary py-20 rounded-full mx-2 my-5 items-center ">
      <Text className="text-3xl text-on_primary text-center">{title}</Text>
    </View>
  </Pressable>
);

function Touch({
  hives,
  selectHive,
}: {
  hives: IBeehive[];
  selectHive: (hiveId: string, hiveName: string) => void;
}) {
  return (
    <View className="flex-col justify-center items-center pt-10 pb-2 space-y-10 h-full w-full bg-background">
      <Text className="font-light text-4xl text-on_background">Escolha a colmeia</Text>
      <FlatList
        className="w-full"
        data={hives}
        renderItem={({ item }) => (
          <Item title={item.name} selectHive={() => selectHive(item.name, item.name)} />
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}

export default Touch;

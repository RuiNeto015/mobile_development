import {FlatList, Image} from "native-base";
import {Pressable, Text, View} from "react-native";
import {IApiary} from "../../../../../schemas/interfaces/IApiary";

const Item = ({title, selectApiary}: { title: string; selectApiary: () => void }) => (
    <Pressable onPress={() => selectApiary()}>
        <View className=" flex flex-col space-y-3 bg-tertiary py-20 rounded-full mx-2 my-5 items-center ">
            <Text className="text-3xl text-on_primary text-center">{title}</Text>
            <View className="flex flex-row justify-center items-center">
                <Image
                    size={7}
                    source={require("../../../../../../img/location.png")}
                    alt="location marker"
                />
                <Text className="text-lg text-on_primary text-center">Moreira de Cónegos</Text>
            </View>
        </View>
    </Pressable>
);

function Touch({
                   selectApiary,
                   apiaries,
               }: {
    selectApiary: (apiary: { apiaryId: string; apiaryName: string }) => void;
    apiaries: IApiary[];
}) {
    return (
        <>
            {apiaries.length === 0 ?
                <View className="m-5 text-center">
                    <Text className="font-light text-yellow text-4xl text-center text-on_background">Sem apiários ativos
                        para escolha</Text>
                </View>
                :
                <View
                    className="flex-col justify-center items-center pt-10 pb-2 space-y-10 h-full w-full bg-background">
                    <Text className="font-light text-4xl text-on_background">Escolha o apiário</Text>
                    <FlatList
                        className="w-full"
                        data={apiaries}
                        renderItem={({item}) => (
                            <Item
                                title={item.name}
                                selectApiary={() => selectApiary({apiaryId: item.id, apiaryName: item.name})}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            }
        </>
    );
}

export default Touch;

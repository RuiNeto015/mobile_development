import {Text, TouchableOpacity, View} from "react-native";
import {ScrollView} from "native-base";
import {IApiary, IBeehive} from "../../../../../../schemas/interfaces/IApiary";
import {writeBeehiveType} from "../../ApiariesListUtils";
import {formatDateToYYYYMMDD} from "../../../../../../utils/DateUtils";
import React, {useState} from "react";
import BeehiveDetails from "./BeehiveDetails";
import {NativeStackScreenProps} from "@react-navigation/native-stack";


const BeehiveItem = ({beehive, selectBeehive}: {
    beehive: IBeehive,
    selectBeehive: () => void,
    navigation: NativeStackScreenProps<any>
}) => (
    <TouchableOpacity
        className="bg-background rounded-lg p-4 mb-5 border"
        onPress={selectBeehive}
    >
        <View className="flex-row w-full justify-center mb-3">
            <Text className="text-center text-xl font-bold text-on_background m-auto">
                {beehive.name}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className={`text-center text-md text-on_background`}>
                Tipo: {beehive.type}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Estrutura da colmeia: {writeBeehiveType(beehive.structureType)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Cor: {beehive.color.trim()}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Fonte: {beehive.source.trim()}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Nº de quadros: {beehive.frames}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Raça da rainha: {beehive.queenRace}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Data da aceitação da rainha: {formatDateToYYYYMMDD(beehive.queenAcceptAt)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Alças de criação: {beehive.hiveBodiesOfCreation}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className="text-center text-md text-on_background">
                Alças de mel: {beehive.hiveBodiesOfHoney}
            </Text>
        </View>
    </TouchableOpacity>
);

const BeehivesList: React.FC<{
    beehives: IBeehive[],
    apiary: IApiary,
    navigation: NativeStackScreenProps<any>
}> = ({beehives, apiary, navigation}) => {
    const [showInspections, setShowInspections] = useState(false);
    const [beehiveToDetail, setBeehiveToDetail] = useState<IBeehive | null>(null);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>

            {!showInspections &&
                <>
                    <Text
                        className="text-lg font-bold w-fit text-on_background mb-3">
                        Total colmeias/cortiços: {beehives.length}
                    </Text>

                    {beehives.map((beehive) =>
                        <BeehiveItem beehive={beehive} key={beehive.name} navigation={navigation} selectBeehive={() => {
                            setBeehiveToDetail(beehive)
                            setShowInspections(true)
                        }}/>
                    )}
                </>
            }

            {showInspections && beehiveToDetail != null &&
                <BeehiveDetails apiary={apiary} navigation={navigation} beehive={beehiveToDetail} goBack={() => {
                    setShowInspections(false)
                }}/>
            }

        </ScrollView>
    );
}

export default BeehivesList;

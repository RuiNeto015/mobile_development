import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import {Divider, ScrollView} from "native-base";
import {IApiary, IBeehive} from "../../../../../../schemas/interfaces/IApiary";
import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {DatabaseInspectionsService} from "../../../../../../services/db";
import {IInspection} from "../../../../../../schemas/interfaces/IInspection";
import {NativeStackScreenProps} from "@react-navigation/native-stack";


const BeehiveDetails: React.FC<{
    beehive: IBeehive,
    apiary: IApiary,
    navigation: NativeStackScreenProps<any>,
    goBack: () => void
}> = ({beehive, apiary, navigation, goBack}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [inspectionList, setInspectionList] = useState<IInspection[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true)
                try {
                    const dbInspectionList = await DatabaseInspectionsService.getAllByTypeAndBeehiveIdAndApiaryId('registered', beehive.name, apiary.id);
                    setInspectionList(dbInspectionList);
                    console.log('inspection of beehive:', JSON.stringify(dbInspectionList))
                } catch (error) {
                    console.error("Error fetching apiaries:", error);
                }
            };
            fetchData()
            setIsLoading(false)
        }, []),
    );


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>

            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" className="bg-red-600"/>
                    <Text className="mt-2 text-on_background">A carregar histórico de colmeia</Text>
                </View>
            )}
            {!isLoading &&
                <>
                    <Text className="font-medium text-center text-2xl text-on_background mb-4 ">{beehive.name}</Text>
                    <View className="w-full flex-row justify-between items-end">
                        <TouchableOpacity
                            className="w-5/12  text-sm bg-background rounded-lg border"
                            onPress={goBack}>
                            <Text className="font-light text-center text-md m-3 text-on_background">
                                Voltar para apiário
                            </Text>
                        </TouchableOpacity>


                        {/*<TouchableOpacity*/}
                        {/*    className="w-4/12  text-sm bg-background rounded-lg text-on_background border"*/}
                        {/*    onPress={() => {*/}
                        {/*    }}>*/}
                        {/*    <Text className="font-light text-center text-md m-3 text-on_background">*/}
                        {/*        Gerar QR*/}
                        {/*    </Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>

                    {inspectionList.length == 0
                        ?
                        <Text
                            className="text-lg font-bold w-fit text-on_background mb-3 mt-3">
                            Sem inspeções associadas
                        </Text>
                        : <>
                            <Text
                                className="text-lg font-bold w-fit text-on_background mb-3 mt-3">
                                Total inspeções: {inspectionList?.length}
                            </Text>

                            {inspectionList.map((inspection) => (
                                <TouchableOpacity
                                    key={inspection.id}
                                    onPress={() => {
                                        navigation.navigate("inspection_details", {
                                                inspection: inspection,
                                                beehive: beehive,
                                                apiary: apiary,
                                                navigation: navigation
                                            }
                                        )
                                    }}>
                                    <View className="bg-background rounded-lg p-4 mb-4 border">
                                        <View className="flex flex-col items-center">
                                            <Text className="text-xl font-bold text-gray-800">Relatório de
                                                inspeção</Text>
                                            <Text className="text-xs text-gray-800">Id: {inspection.id}</Text>
                                            <Text className="text-lg text-gray-800">{inspection.date}</Text>
                                        </View>
                                        <View className="flex flex-row justify-center w-full items-center">
                                            <View className="flex flex-col items-center">
                                                <Text className="text-md font-bold text-gray-800">Iniciada às</Text>
                                                <Text className="text-md text-gray-800">{inspection.startTime}</Text>
                                            </View>
                                            <Divider className="w-2/4 mx-3 bg-black"/>
                                            <View className="flex flex-col items-center">
                                                <Text className="text-md font-bold text-gray-800">Terminada às</Text>
                                                <Text className="text-md text-gray-800">{inspection.endTime}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row w-full justify-between mt-3">
                                            <Text className={`text-center text-md text-on_background`}>
                                                Nº de colmeias inspecionadas: {inspection.hives.length}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>}
                </>
            }
        </ScrollView>
    );
}

export default BeehiveDetails;

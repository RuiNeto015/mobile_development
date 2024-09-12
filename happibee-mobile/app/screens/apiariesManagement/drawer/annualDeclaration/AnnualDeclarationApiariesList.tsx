import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import React, { useState } from "react";


function AnnualDeclarationApiariesList({ route }: any) {

    const { annualDeclaration } = route.params;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <View>
            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2 text-on_background">A carregar</Text>
                </View>
            )}
            {!isLoading && (
                <ScrollView>
                    <View className="bg-background">
                        <View className="bg-background h-full m-3">
                            {annualDeclaration.apiariesList.map((apiary: any, index: any) => (
                                <View className="bg-background rounded-lg mx-2 my-3 border p-3" key={index}>
                                    <View className="flex-row w-full justify-between">
                                        <Text
                                            className={`font-bold text-center text-md`}>
                                            Estado: {apiary.state}
                                        </Text>
                                    </View>
                                    <View className="flex-row w-full justify-between">
                                        <Text className=" text-center text-md text-on_background">
                                            Número de colmeias: {apiary.beehivesCount}
                                        </Text>
                                    </View>
                                    <View className="flex-row w-full justify-between">
                                        <Text className=" text-center text-md text-on_background">
                                            Número de núcleos: {apiary.coresCount}
                                        </Text>
                                    </View>
                                    <View className="flex-row w-full justify-between">
                                        <Text className="text-center text-md text-on_background">
                                            Freguesia: {apiary.town.trim()}
                                        </Text>
                                    </View>
                                    <View className="flex-row w-full justify-between">
                                        <Text className="text-center text-md text-on_background">
                                            Nome do Local: {apiary.nameOfLocal}
                                        </Text>
                                    </View>
                                    <View className="flex-row w-full justify-between">
                                        <Text className="text-center text-md text-on_background">
                                            Zona Controlada {apiary.inControlledZone == true ? "Sim" : "Não"}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>

    );
}

export default AnnualDeclarationApiariesList;
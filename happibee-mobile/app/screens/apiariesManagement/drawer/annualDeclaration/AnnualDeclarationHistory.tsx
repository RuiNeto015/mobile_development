import { useFocusEffect } from "@react-navigation/native";
import { Image } from "native-base";
import { Text, View, ScrollView, ToastAndroid, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { API_BASE_URL } from "../../../../../config";
import { getUser } from "../../../../utils/JwtTokenUtil";
import React from "react";
import { EmitAnnualDeclarationDto } from "../../../../schemas/dtos/EmitAnnualDeclaration";
import { getAnnualDeclarationStatusClass, giveAnnualDeclarationStateName, giveAnnualDeclarationTypeName } from "./AnnualDeclarationListUtils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ItemProps = {
    annualDeclaration: EmitAnnualDeclarationDto;
    selectAnnualDeclaration: () => void
};

const AnnualDeclarationItem = ({ annualDeclaration, selectAnnualDeclaration }: ItemProps) => (

    <View className="bg-background rounded-lg mx-2 my-3  border">
        <TouchableOpacity
            className="w-fit text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
            onPress={selectAnnualDeclaration}
        >
            <View
                className="w-fit text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
            >
                <View className="flex-row w-full justify-center">
                    <Text className="text-center text-xl font-bold text-on_background m-auto">{annualDeclaration.activityStartDate.toString()}</Text>
                </View>
                <View className="flex-row w-full justify-between">
                    <Text
                        className={`font-bold text-center text-md mt-4 ${getAnnualDeclarationStatusClass(annualDeclaration.state)}`}>
                        Estado: {giveAnnualDeclarationStateName(annualDeclaration.state)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    </View>
);

function AnnualDeclarationHistory({ navigation }: NativeStackScreenProps<any>) {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [annualDeclarations, setAnnualDeclarations] = useState<EmitAnnualDeclarationDto[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true)

                try {
                    const userData = JSON.parse((await getUser() || ""));

                    const response = await fetch(`${API_BASE_URL}/annualDeclaration/all/${userData?.tenantId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const responseData = await response.json();
                    if (response.status === 200) {
                        if (responseData.length > 0) {
                            setAnnualDeclarations(responseData)
                        }
                    } else if (response.status == 400) {
                        showToast(responseData.message)
                    } else {
                        showToast("Algum problema ocorreu.");
                    }
                } catch (error: any) {
                    showToast(error.message);
                } finally {
                    setIsLoading(false)
                }
            };
            fetchData()
        }, []),
    );

    const showToast = (message: string) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2 text-on_background">A carregar</Text>
                </View>
            )}
            {!isLoading && (
                <View className="bg-background h-full">
                    <View className="items-center m-3">
                        <Text className="text-xl text-center text-on_background">Histórico de Declarações</Text>
                    </View>
                    {annualDeclarations && (
                        <View className="w-fit flex justify-end">
                            {
                                annualDeclarations.reverse().map((item, index) => (
                                    <AnnualDeclarationItem key={index} annualDeclaration={item} selectAnnualDeclaration={() => {
                                        navigation.navigate("details_annualDeclaration", {
                                            annualDeclaration: item
                                        })
                                    }} />
                                ))
                            }
                        </View>
                    )}
                    {(annualDeclarations.length == 0 || annualDeclarations == undefined) && (
                        <>
                            <View className="items-center justify-center mt-32">
                                <Image source={require("../../../../../img/bekeeper_image.png")} style={{ width: 105, height: 175 }} alt="beekeeper image" />
                                <Text className="text-xl text-center text-red-500 mt-10">Não tem declarações anuais...</Text>
                            </View>
                        </>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

export default AnnualDeclarationHistory;
import { Divider, Button, Image } from "native-base";
import { Text, View, Alert, ScrollView, ActivityIndicator, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { IApiary } from "../../../../schemas/interfaces/IApiary";
import DatabaseApiaryService from "../../../../services/db/DatabaseApiaryService";
import { useFocusEffect } from "@react-navigation/native";
import { getStatusClass, giveApiaryStatusName } from "../../base/apiariesList/ApiariesListUtils";
import { API_BASE_URL } from "../../../../../config";
import { AnnualDeclarationApiary, AnnualDeclarationState, AnnualDeclarationType, EmitAnnualDeclarationDto, UserDto } from "../../../../schemas/dtos/EmitAnnualDeclaration";
import { getUser } from "../../../../utils/JwtTokenUtil";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAnnualDeclarationStatusClass, giveAnnualDeclarationStateName } from "./AnnualDeclarationListUtils";

type ItemProps = {
    apiary: IApiary;
};

const ApiaryItem = ({ apiary }: ItemProps) => (

    <View className="bg-background rounded-lg mx-2 my-3  border">
        <View
            className="w-fit text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
        >
            <View className="flex-row w-full justify-center">
                <Text className="text-center text-xl font-bold text-on_background m-auto">{apiary.name}</Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text
                    className={`font-bold text-center text-md mt-4" + ${getStatusClass(apiary.status)}`}>
                    Estado: {giveApiaryStatusName(apiary.status)}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Freguesia: {apiary.town.trim()}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Processos registados: {apiary.apiaryHistory.length}
                </Text>
            </View>
        </View>
    </View>
);

function AnnualDeclaration({ navigation }: NativeStackScreenProps<any>) {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [user, setUser] = useState<UserDto | null>();

    const [isEmited, setIsEmited] = useState<boolean>(false);
    const [canEmit, setCanEmit] = useState<boolean>(true);
    const [numPendentApiaries, setNumPendentApiaries] = useState(0);

    const [apiaries, setApiaries] = useState<IApiary[]>([]);
    const [annualDeclarations, setAnnualDeclarations] = useState<EmitAnnualDeclarationDto[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true)
                try {

                    const apiaries = await DatabaseApiaryService.getAll()
                    let numPendentApiariesHelper = 0
                    setApiaries(apiaries);
                    await Promise.all(apiaries.map(async (apiary) => {
                        if (apiary.status == "WAITING_CZ" || apiary.status == "WAITING_DGADR") {
                            numPendentApiariesHelper++
                            setCanEmit(false)
                        }
                    }));
                    setNumPendentApiaries(numPendentApiariesHelper)
                } catch (error) {
                    console.error("Error fetching: ", error);
                }

                try {
                    const userData = JSON.parse(await getUser() || "");
                    setUser(userData)

                    const response = await fetch(`${API_BASE_URL}/annualDeclaration/all/${userData?.tenantId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const responseData = await response.json();
                    setAnnualDeclarations(responseData)
                    if (response.status === 200) {
                        if (responseData.length > 0) {
                            const lastItem = responseData[responseData.length - 1];
                            if (lastItem && lastItem.activityStartDate) {
                                const lastItemStartDate = new Date(lastItem.activityStartDate);
                                if (isDateBetween(lastItemStartDate)) {
                                    setIsEmited(true);
                                }
                            } else {
                                setIsEmited(false);
                            }
                        } else {
                            setIsEmited(false);
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

    function isDateBetween(target: Date) {
        return target >= new Date('2022-09-01') && target <= new Date('2023-09-01');
    }

    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    const handleEmissionButton = () => {
        Alert.alert(
            "Emitir Declaração Anual",
            "Deseja emitir a sua Declaração Anual de Existência de Apiários?",
            [
                {
                    text: "Cancelar",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "Confirmar",
                    onPress: () => submit(),
                },
            ],
            { cancelable: false }
        );
        return true; // Prevent default behavior
    };

    const showToast = (message: string) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
    };

    const submit = async () => {
        setIsLoading(true);

        if (apiaries.length === 0) {
            showToast("Não existem apiários para emitir.");
            return;
        }

        if (user != null && apiaries.length != 0) {
            const apiariesToSend: AnnualDeclarationApiary[] = [];
            await Promise.all(
                apiaries.map(async (apiary) => {
                    const transformedApiary: AnnualDeclarationApiary = {
                        id: apiary.id,
                        town: apiary.town,
                        geoLocation: apiary.geoLocation,
                        nameOfLocal: apiary.nameOfLocal,
                        intensiveCultivation: apiary.intensiveCultivation,
                        beehivesCount: apiary.beehives.length,
                        coresCount: apiary.coresCount,
                        inTranshumance: false,
                        inControlledZone: apiary.inControlledZone,
                        state: apiary.status
                    };
                    apiariesToSend.push(transformedApiary);
                })
            );

            const annualDeclarationDto: EmitAnnualDeclarationDto = {
                tenantId: user.tenantId,
                type: AnnualDeclarationType.BEEKEEPER_INITIAL_REGISTRY,
                activityStartDate: new Date('2023-01-01'),
                activityEndDate: new Date('2023-12-31'),
                user: user,
                apiariesList: apiariesToSend,
                annualDeclarationHistory: [],
                state: AnnualDeclarationState.PENDENT
            };

            try {
                const response = await fetch(`${API_BASE_URL}/annualDeclaration`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(annualDeclarationDto),
                });

                const responseData = await response.json();

                if (response.status == 200) {
                    setIsEmited(true)
                    showToast("Declaração Anual enviada com sucesso");
                    navigation.navigate('Histórico')
                } else if (response.status == 400) {
                    showToast(responseData.message);
                } else {
                    showToast("Algum problema occoreu");
                }
            } catch (error: any) {
                showToast(error.message);
            } finally {
                setIsLoading(false);
            }
        }
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
                <View className="pt-5 pb-2 h-full w-full bg-background">
                    <View className="bg-yellow-500 p-2 rounded-md relative mr-2 ml-2">
                        <Text className="text-md text-center text-black">Abertura da nova época de atividade:</Text>
                        <Text className="text-md text-center text-black font-bold">1 de Setembro de {getCurrentYear()}</Text>
                    </View>

                    {!isEmited && (
                        <>
                            <View className="items-center m-3">
                                <Text className="text-xl text-center text-on_background">Lista de apiários</Text>
                            </View>
                            <View className="items-end mr-3">
                                <Button
                                    onPress={handleEmissionButton}
                                    isDisabled={!canEmit || apiaries.length == 0}
                                    className="bg-amber-600 text-white rounded-md mt-5 mb-5 w-40"
                                >
                                    Emitir Declaração
                                </Button>
                            </View>
                            <View className="w-fit flex justify-end">
                                <Text className="ml-3 mt-2 text-left text-md text-on_background">
                                    Total de {numPendentApiaries} apiários pendentes{" "}
                                </Text>
                                {
                                    apiaries.map((item) => (
                                        <ApiaryItem key={item.id} apiary={item} />
                                    ))
                                }
                            </View>
                        </>
                    )}
                    {isEmited && (
                        <>
                            <View className="items-center justify-center mt-10">
                                <Image source={require("../../../../../img/bekeeper_image.png")} style={{ width: 105, height: 175 }} alt="beekeeper image" />
                                <Text className="mt-7 text-center text-xl font-bold text-on_background">A sua declaração anual foi enviada com sucesso!</Text>
                                <Text className={`mt-7 text-center text-xl font-bold ${annualDeclarations.length > 0 ? getAnnualDeclarationStatusClass(annualDeclarations[annualDeclarations.length - 1].state) : ''}`}>
                                    {annualDeclarations.length > 0 ? giveAnnualDeclarationStateName(annualDeclarations[annualDeclarations.length - 1].state)?.toUpperCase() : 'Estado indisponível'}
                                </Text>
                                <Text className="mt-5 text-center text-lg text-on_background">Visite o histórico para mais detalhes.</Text>
                            </View>
                        </>
                    )}
                </View >

            )}
        </ScrollView >
    );
}

export default AnnualDeclaration;
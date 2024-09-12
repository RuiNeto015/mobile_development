import { Text, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Timeline from 'react-native-timeline-flatlist'
import { getAnnualDeclarationStatusClass, giveAnnualDeclarationStateName, giveAnnualDeclarationTypeName } from "./AnnualDeclarationListUtils";
import { Button } from "native-base";


function AnnualDeclarationDetails({ route, navigation }: any) {

    const { annualDeclaration } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const castDateToSimplerDate = (dateWithDateType: string) => {
        const newDate = new Date(dateWithDateType);
        const date = newDate.toLocaleString(undefined, {
            day: '2-digit', month: '2-digit', year: '2-digit'
        });
        return date
    }

    const castDateToSimpleTime = (dateWithDateType: string) => {
        const newDate = new Date(dateWithDateType);
        const time = newDate.toLocaleString(undefined, {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
        return time
    }

    const data = annualDeclaration.annualDeclarationHistory.map((event: any) => {

        let time
        let titleTime

        if (event.processedAt == null) {
            time = castDateToSimplerDate(event.requestAt)
            titleTime = castDateToSimpleTime(event.requestAt)
        } else {
            time = castDateToSimplerDate(event.processedAt)
            titleTime = castDateToSimpleTime(event.processedAt)
        }

        const title = titleTime + " - " + giveAnnualDeclarationStateName(event.state);
        const description = event.observations && event.processedBy ? "Observações:\n" + event.observations + "\nProcessado por:\n" + event.processedBy : "Sem informações adicionais";

        return {
            time,
            title,
            description
        };
    });


    return (
        <View>
            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2 text-on_background">A carregar</Text>
                </View>
            )}
            {!isLoading && (
                <View className="bg-background">
                    <View className="bg-background h-full m-3">
                        <View className="items-center m-3 bg-background">
                            <Text className="text-xl text-center text-on_background">Detalhes da Declaração Anual</Text>
                        </View>
                        <Text
                            className={`text-center text-lg font-bold ${getAnnualDeclarationStatusClass(annualDeclaration.state)}`}>
                            {giveAnnualDeclarationStateName(annualDeclaration.state).toUpperCase()}
                        </Text>
                        <Text className="text-xl text-on_background mt-3">{annualDeclaration.activityStartDate.toString()}</Text>
                        <Text
                            className={`text-lg my-3 text-on_background`}>
                            {giveAnnualDeclarationTypeName(annualDeclaration.type)}
                        </Text>

                        <View className="items-center">
                            <Text
                                className={`text-lg text-on_background`}>
                                Total de {annualDeclaration.apiariesList.length} apiários
                            </Text>
                            {annualDeclaration.apiariesList.length > 0 && (
                                <Button
                                    onPress={() => {
                                        navigation.navigate("annualDeclaration_apiaries", {
                                            annualDeclaration: annualDeclaration
                                        })
                                    }}
                                    className="bg-amber-600 text-white hover:bg-amber-200 my-3"
                                    style={{ maxWidth: 100 }}
                                >
                                    Ver apiários
                                </Button>
                            )}
                        </View>

                        <View className="bg-background my-2">
                            <Text className="text-xl mb-3 text-on_background underline">Linha temporal</Text>
                        </View>
                        <Timeline
                            data={data}
                            circleColor={"#785900"}
                            lineColor={"#785900"}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

export default AnnualDeclarationDetails;
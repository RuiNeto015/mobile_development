import {Text, View} from "react-native";
import {Divider, ScrollView} from "native-base";
import React, {useEffect, useState} from "react";
import {IHiveInspection} from "../../../../../../schemas/interfaces/IInspection";
import {
    getBroodPatternsClass,
    getDiseasesClass, getHoneyPolenClass,
    getPopulationClass,
    getTemperamentClass
} from "../../../../drawer/inspections/InspectionsUtils";

function BeehiveInspectionDetails({route}: any) {
    const {inspection, beehive, apiary, navigation} = route.params;

    const [report, setReport] = useState<IHiveInspection | null>(null);


    useEffect(() => {
        const filteredInspections = inspection.hives.filter((report: IHiveInspection) =>
            report.hiveName === beehive.name
        );
        console.log('filteredInspections: ', JSON.stringify(filteredInspections))
        if (filteredInspections.length > 0) {
            setReport(filteredInspections[0])
        }
    }, []);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {report != null &&
                <View className="flex-1 bg-background rounded-lg p-4 mb-4 ">
                    <View className="flex flex-col items-center">
                        <Text className="text-3xl font-bold text-gray-800">Relatório de inspeção</Text>
                        <Text className="text-xs text-gray-800 mb-3">Id: {inspection.id}</Text>
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
                    <View className="flex flex-col items-center mt-2">
                        <Text className="text-md font-bold text-gray-800">Apiário: {apiary.name}</Text>
                        <Text className="text-md font-bold text-gray-800">Colmeia: {beehive.name}</Text>
                    </View>

                    <Divider className="w-full my-4 bg-on_background"/>

                    <View className="flex-row w-full justify-between mb-3">
                        <Text className="text-lg font-bold text-on_background">Detalhes da inspeção</Text>
                    </View>

                    {/*LINHA 1*/}
                    <View className="w-full flex-row justify-between">
                        <View className="w-fit">
                            <View className="w-full">
                                <Text
                                    className={`my-1 font-medium text-center text-md text-on_background`}>
                                    Populaçao da colmeia
                                </Text>
                            </View>
                        </View>
                        <View className="w-5/12 ">
                            <View className={`border w-full rounded-lg ${getPopulationClass(report.population)}`}>
                                <Text
                                    className={`m-2 font-medium  text-center text-white`}>
                                    {report.population}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/*LINHA 2*/}
                    <View className="w-full flex-row justify-between mt-5">
                        <View className="w-fit">
                            <View className="w-full">
                                <Text className="my-1 font-medium text-center text-md text-on_background">
                                    Níveis de mel e pólen
                                </Text>
                            </View>
                        </View>
                        <View className="w-5/12">
                            <View
                                className={`border w-full rounded-lg ${getHoneyPolenClass(report.polenAndHoneyLevels)}`}>
                                <Text className="m-2 font-medium text-center text-md text-white">
                                    {report.polenAndHoneyLevels}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/*LINHA 3*/}
                    <View className="w-full flex-row justify-between mt-5">
                        <View className="w-fit">
                            <View className="w-full">
                                <Text className="my-1 font-medium text-center text-md text-on_background">
                                    Padrão de ninho
                                </Text>
                            </View>
                        </View>
                        <View className="w-5/12">
                            <View className={`border w-full rounded-lg ${getBroodPatternsClass(report.broodPattern)}`}>
                                <Text className="m-2 font-medium text-center text-md text-white">
                                    {report.broodPattern}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/*LINHA 3*/}
                    <View className="w-full flex-row justify-between mt-5">
                        <View className="w-fit">
                            <View className="w-full">
                                <Text className="my-1 font-medium text-center text-md text-on_background">
                                    Foram encontrada doenças?
                                </Text>
                            </View>
                        </View>
                        <View className="w-5/12">
                            <View className={`border w-full rounded-lg  ${getDiseasesClass(report.diseaseOrPests)}`}>
                                <Text className="m-2 font-medium text-center text-md text-white">
                                    {report.diseaseOrPests}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {report.diseaseOrPests === "Sim" &&
                        <>
                            {/*LINHA 3*/}
                            <View className="w-full flex-row justify-between mt-5">
                                <View className="w-fit">
                                    <View className="w-full">
                                        <Text className="my-1 font-medium text-center text-md text-on_background">
                                            Qual o temperamento?
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-5/12">
                                    <View
                                        className={`border w-full rounded-lg ${getTemperamentClass(report.temperament)}`}>
                                        <Text className="m-2 font-medium text-center text-md text-white">
                                            {report.temperament}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {/*LINHA 3*/}
                            <View className="w-full flex-row justify-between mt-5">
                                <View className="w-fit">
                                    <View className="w-full justify-start flex-row">
                                        <Text className="my-auto font-medium text-start text-md text-on_background">
                                            Sintomas observados
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-5/12">
                                    <View className="border w-full rounded-lg">
                                        {report.symptoms?.length !== 0 ? <>
                                                {report.symptoms.map((symptom, index) => (
                                                    <Text key={index}
                                                          className="m-2 font-medium text-center text-md text-on_background">
                                                        {symptom}
                                                    </Text>
                                                ))}
                                            </> :
                                            <Text className="m-2 font-medium text-center text-md text-on_background">
                                                Sem dados
                                            </Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </>
                    }


                    <View className="mt-3 w-full">
                        <Text className="font-medium text-md text-on_background mb-1">
                            Notas adicionais
                        </Text>
                        {report.additionalNotes.length > 1 ?
                            <Text className="p-2  text-md text-on_background border rounded-lg mt-1">
                                {report.additionalNotes}
                            </Text>
                            :
                            <Text className="p-2  text-md text-on_background border rounded-lg mt-1">
                                Sem notas.
                            </Text>
                        }
                    </View>


                </View>
            }

        </ScrollView>
    )
        ;
}

export default BeehiveInspectionDetails;

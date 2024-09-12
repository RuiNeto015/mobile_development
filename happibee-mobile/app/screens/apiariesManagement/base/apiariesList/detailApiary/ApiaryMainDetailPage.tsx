import {Text, TouchableOpacity, View} from "react-native";
import {Image, ScrollView} from "native-base";
import React, {useEffect, useState} from "react";
import {ApiaryStatus, IApiary} from "../../../../../schemas/interfaces/IApiary";
import ApiaryInformation from "./generalInfo/ApiaryInformation";
import BeehivesList from "./beehives/BeehivesList";
import ApiaryHistoric from "./historic/ApiaryHistoric";

type DetailItem = { icon1: any, text1: string, icon2: any, text2: string };


const DetailItem = ({icon1, text1, icon2, text2}: DetailItem) => (
    <View className="w-full flex-row justify-between">
        <View className="w-5/12">
            <View className="w-full flex-row justify-center">
                <Image
                    className="w-git"
                    source={icon1}
                    alt="Trash Bin"
                    style={{width: 50, height: 50}}
                />
            </View>
            <View className="w-full flex-row justify-center mt-4">
                <View className="border w-full rounded-lg">
                    <Text className="m-2 font-medium text-center text-md text-on_background">
                        {text1}
                    </Text>
                </View>
            </View>
        </View>

        <View className="w-5/12">
            <View className="w-full flex-row justify-center">
                <Image
                    className="w-git"
                    source={icon2}
                    alt="Trash Bin"
                    style={{width: 50, height: 50}}
                />
            </View>
            <View className="w-full flex-row justify-center mt-4">
                <View className="border w-full rounded-lg">
                    <Text className="m-2  font-medium text-center text-md text-on_background">
                        {text2}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);


function getStatusClass(status: ApiaryStatus) {
    switch (status) {
        case ApiaryStatus.ACTIVE:
            return 'text-green';
        case ApiaryStatus.WAITING_DGADR:
            return 'text-yellow';
        case ApiaryStatus.WAITING_CZ:
            return 'text-yellow';
        case ApiaryStatus.REJECTED:
            return 'text-red';
        default:
            return 'text-black';
    }
}

enum PAGE_ENUM {
    INFO, BEEHIVES, HISTORIC
}

function ApiaryMainDetailPage({route}: any) {
    const {apiary, navigation} = route.params;

    console.log("apiary", apiary)

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<PAGE_ENUM>(PAGE_ENUM.INFO);

    //flags to screen management
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [apiaries, setApiaries] = useState<IApiary[]>([]);

    //filter data
    const [apiaryName, setApiaryName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [apiaryStatus, setApiaryStatus] = useState<string>("");
    const [isFocusDropDown, setIsFocusDropDown] = useState(false);

    function getStringZonaControlada(): string {
        if (apiary.inControlledZone) {
            return "Zona controlada (Bragança)"
        } else {
            return "Apiário instalado em zona da DGADR"
        }
    }

    function getStringCulturaIntensiva(): String {
        if (apiary.intensiveCultivation) {
            return "Marcado como cultura intensiva"
        } else {
            return "Sem prática de cultura intensiva"
        }
    }

    useEffect(() => {

    }, []);

    return (

        <ScrollView contentContainerStyle={{flexGrow: 1}}>

            <View className="pt-5 pb-2 h-full w-full bg-background">
                <Text className="font-bold text-center text-4xl text-on_background">{apiary.name}</Text>

                <View className="w-full flex-row justify-center my-4 px-2">
                    <TouchableOpacity
                        className={`w-4/12 text-sm bg-primary border rounded-l-lg ${page === PAGE_ENUM.INFO ? `bg-primary` : `bg-background`}`}
                        onPress={() => setPage(PAGE_ENUM.INFO)}>
                        <Text
                            className={`font-light text-center text-md m-3 ${page === PAGE_ENUM.INFO ? `text-on_primary` : `text-on_background`}`}>
                            Informação
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`w-4/12 text-sm bg-primary border ${page === PAGE_ENUM.BEEHIVES ? `bg-primary` : `bg-background`}`}
                        onPress={() => setPage(PAGE_ENUM.BEEHIVES)}>
                        <Text
                            className={`font-light text-center text-md m-3 ${page === PAGE_ENUM.BEEHIVES ? `text-on_primary` : `text-on_background`}`}>
                            Colmeias
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`w-4/12 text-sm bg-primary border rounded-r-lg ${page === PAGE_ENUM.HISTORIC ? `bg-primary` : `bg-background`}`}
                        onPress={() => setPage(PAGE_ENUM.HISTORIC)}>
                        <Text
                            className={`font-light text-center text-md m-3 ${page === PAGE_ENUM.HISTORIC ? `text-on_primary` : `text-on_background`}`}>
                            Histórico
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="h-px mb-3 accent-on_background border"/>
                {/*BODY*/}

                <View className="mx-1 p-2 space-y-2">

                    {page === PAGE_ENUM.INFO && (
                        <ApiaryInformation apiary={apiary}/>
                    )}

                    {page === PAGE_ENUM.BEEHIVES && (
                        <BeehivesList beehives={apiary.beehives} apiary={apiary} navigation={navigation}/>
                    )}

                    {page === PAGE_ENUM.HISTORIC && (
                        <ApiaryHistoric apiary={apiary}/>
                    )}

                </View>
            </View>

        </ScrollView>
    );
}

export default ApiaryMainDetailPage;

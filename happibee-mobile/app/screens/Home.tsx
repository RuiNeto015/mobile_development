import * as React from "react";
import {useEffect, useState} from "react";
import {Text, ToastAndroid, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Button, Image, Spinner} from "native-base";
import {API_BASE_URL} from "../../config";
import {IApiary} from "../schemas/interfaces/IApiary";
import {DatabaseApiaryService} from "../services/db";
import {getToken, getUser} from "../utils/JwtTokenUtil";
import DatabaseInspectionsService from "../services/db/DatabaseInspectionsService";
import {IInspection} from "../schemas/interfaces/IInspection";
import {useFocusEffect} from "@react-navigation/native";

const showToast = (message: string) => {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
};

function Home({navigation}: NativeStackScreenProps<any>) {
    const [isSyncing, setIsSyncing] = useState(false);

    // async function syncData() {
    //     const user = JSON.parse(await getUser())
    //     try {
    //         setIsSyncing(true);
    //         const response = await fetch(`${API_BASE_URL}/apiary/all/${user.tenantId}`);
    //
    //         const apiaries = await response.json();
    //         console.log(apiaries)
    //         if (response.status != 200) {
    //             showToast(apiaries.message.toString());
    //         }
    //
    //         for (let i = 0; i < apiaries.length; i++) {
    //             const apiaryData: IApiary = apiaries[i];
    //             DatabaseApiaryService.save(apiaryData);
    //         }
    //         console.log("inserted");
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setIsSyncing(false);\
    //     }
    // }

    async function syncData() {
        const user = JSON.parse(await getUser())
        const token = await getToken()
        try {
            setIsSyncing(true);

            const apiariesDb = await DatabaseApiaryService.getAll()
            const inspectionsDb = await DatabaseInspectionsService.getAll('registered')

            const request = {
                tenantId: user.tenantId,
                apiaries: apiariesDb,
                inspections: inspectionsDb
            }
            console.log('request to sync: ', JSON.stringify(request))
            const response = await fetch(`${API_BASE_URL}/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(request)
            });

            const responseJson = await response.json();
            console.log('response of sync: ', JSON.stringify(responseJson))
            if (response.status != 200) {
                showToast(responseJson.message.toString());
            } else {
                //if it was 200
                await DatabaseApiaryService.deleteAll();
                await DatabaseInspectionsService.deleteAll('registered');
                //saves the apiaries
                for (let i = 0; i < responseJson.apiaries.length; i++) {
                    const apiaryData: IApiary = responseJson.apiaries[i];
                    console.log('apiary single data', apiaryData)
                    await DatabaseApiaryService.save(apiaryData);
                }
                //saves the inspections
                for (let i = 0; i < responseJson.inspections.length; i++) {
                    const inspectionData: IInspection = responseJson.inspections[i];
                    await DatabaseInspectionsService.save(inspectionData);
                }
                showToast('Sincronização efetuada');
                console.log("inserted");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSyncing(false);
        }
    }

    async function syncDataAutomatic() {
        const user = JSON.parse(await getUser())
        const token = await getToken()
        try {
            if (isSyncing) {
                return
            }
            const apiariesDb = await DatabaseApiaryService.getAll()
            const inspectionsDb = await DatabaseInspectionsService.getAll('registered')

            const request = {
                tenantId: user.tenantId,
                apiaries: apiariesDb,
                inspections: inspectionsDb
            }
            console.log('request to sync auto: ', JSON.stringify(request))
            const response = await fetch(`${API_BASE_URL}/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(request)
            });

            const responseJson = await response.json();
            console.log('response of sync: ', JSON.stringify(responseJson))
            if (response.status != 200) {
            } else {
                //if it was 200
                await DatabaseApiaryService.deleteAll();
                await DatabaseInspectionsService.deleteAll('registered');
                //saves the apiaries
                for (let i = 0; i < responseJson.apiaries.length; i++) {
                    const apiaryData: IApiary = responseJson.apiaries[i];
                    console.log('apiary single data', apiaryData)
                    await DatabaseApiaryService.save(apiaryData);
                }
                //saves the inspections
                for (let i = 0; i < responseJson.inspections.length; i++) {
                    const inspectionData: IInspection = responseJson.inspections[i];
                    await DatabaseInspectionsService.save(inspectionData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            syncDataAutomatic();
        }, []),
    );

    return (
        <View className="flex-col justify-center items-center h-full w-full bg-background">
            {isSyncing ? (
                <View
                    className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
                    <Spinner size="lg" color="#785900"/>
                </View>
            ) : null}

            <Image source={require("../../img/bee.png")} alt="bee image"/>
            <Text className="font-light text-6xl text-on_background">HapiBee</Text>

            <View className="flex-col justify-center items-center w-full h-1/2 space-y-4">
                <Button
                    _text={{fontSize: "2xl"}}
                    className="h-1/6 w-2/3 bg-tertiary rounded-full"
                    onPress={() => navigation.navigate("apiaries_management")}
                >
                    Gerir Apiários
                </Button>
                <Button
                    _text={{fontSize: "2xl"}}
                    className="h-1/6 w-2/3 bg-tertiary rounded-full"
                    onPress={() => navigation.navigate("field_mode")}
                >
                    Modo Campo
                </Button>
                <Button
                    _text={{fontSize: "2xl"}}
                    className="h-1/6 w-2/3 mt-4 bg-tertiary rounded-full"
                    onPress={() => syncData()}>
                    Sincronizar
                </Button>
            </View>
            {/*<Button onPress={() => syncData()} className="bg-gray-200">*/}
            {/*    <Icon name="sync" size={40} color={""}/>*/}
            {/*    <Text className="font-light text-6xl text-on_background">Sincronizar</Text>*/}
            {/*</Button>*/}
            {/*<Button onPress={() => {*/}
            {/*    DatabaseInspectionsService.getAll('registered').then(result => {*/}
            {/*        console.log(result)*/}
            {/*    })*/}
            {/*}}*/}
            {/*        className="bg-gray-200">*/}
            {/*    <Text className="font-light text-6xl text-on_background">HapiBee</Text>*/}
            {/*</Button>*/}
        </View>
    );
}

export default Home;

import {Text, TouchableOpacity, View,} from "react-native";
import {Image, ScrollView, Spinner} from "native-base";
import React, {useState} from "react";
import {ApiaryStatus, IApiary} from "../../../../schemas/interfaces/IApiary";
import PlusIcon from "../../../../../img/plus.png";
import ApiarySearchFilters from "./createApiary/ApiarySearchFilters";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import DatabaseApiaryService from "../../../../services/db/DatabaseApiaryService";
import {getStatusClass, giveApiaryStatusName} from "./ApiariesListUtils";
import {formatDateStringToYYYYMMDD} from "../../../../utils/DateUtils";
import {Divider} from "react-native-paper";
import {useFocusEffect} from "@react-navigation/native";
import {showToast} from "../../../../utils/ComponentsUtils";
import {getToken, getUser} from "../../../../utils/JwtTokenUtil";
import DatabaseInspectionsService from "../../../../services/db/DatabaseInspectionsService";
import {API_BASE_URL} from "../../../../../config";
import {IInspection} from "../../../../schemas/interfaces/IInspection";

type ItemProps = {
    apiary: IApiary;
    selectApiary: () => void;
};

const ApiaryItem = ({apiary, selectApiary}: ItemProps) => (
    <View className="bg-background rounded-lg mx-2 my-3  border">
        <TouchableOpacity
            className="w-fit text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
            onPress={selectApiary}
        >
            <View className="flex-row w-full justify-center">
                <Text className="text-center text-xl font-bold text-on_background m-auto">
                    {apiary.name}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className={`font-bold text-center text-md mt-4" + ${getStatusClass(apiary.status)}`}>
                    Estado: {giveApiaryStatusName(apiary.status)}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Colmeias: {apiary.beehives.length}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Data registo: {formatDateStringToYYYYMMDD(apiary.creationDate.toString())}
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
        </TouchableOpacity>
    </View>
);

function ApiariesList({navigation}: NativeStackScreenProps<any>) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>();

    //flags to screen management
    const [showFilters, setShowFilters] = useState(false);
    const [filterApplied, setFilterApplied] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [apiaries, setApiaries] = useState<IApiary[]>([]);
    const [originalApiaries, setOriginalApiaries] = useState<IApiary[]>([]);

    //filter data
    const [apiaryName, setApiaryName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [apiaryStatus, setApiaryStatus] = useState<ApiaryStatus>(null);
    const [isFocusDropDown, setIsFocusDropDown] = useState(false);

    // useEffect(() => {
    //     setIsLoading(true)
    //     const fetchData = async () => {
    //         try {
    //             const apiaries = await DatabaseApiaryService.getAll();
    //             setApiaries(apiaries);
    //         } catch (error) {
    //             console.error("Error fetching apiaries:", error);
    //         }
    //     };
    //     fetchData()
    //     console.log(apiaries)
    //     setIsLoading(false)
    // }, []);

    async function syncDataAutomatic() {
        const user = JSON.parse(await getUser())
        const token = await getToken()
        try {
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
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true);
                setUser(JSON.parse((await getUser()) || ""));
                try {
                    const apiaries = await DatabaseApiaryService.getAll();
                    if (filterApplied) {
                        const filteredApiaries = apiaries.filter((apiary) => {
                            // Apply your filter criteria here
                            const matchesApiaryName =
                                apiaryName === "" || apiary.name.toLowerCase().includes(apiaryName.toLowerCase());
                            const matchesLocationName =
                                locationName === "" ||
                                apiary.town.toLowerCase().includes(locationName.toLowerCase());
                            const matchesApiaryStatus = apiaryStatus === null || apiary.status === apiaryStatus;

                            return matchesApiaryName && matchesLocationName && matchesApiaryStatus;
                        });
                        setApiaries(filteredApiaries);
                    } else {
                        setApiaries(apiaries);
                    }
                    setOriginalApiaries(apiaries);
                } catch (error) {
                    console.error("Error fetching apiaries:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
            console.log(apiaries);
        }, [])
    );

    const removeFilters = (): void => {
        setApiaries(originalApiaries);
        setApiaryName("");
        setLocationName("");
        setApiaryStatus(null);
        setFilterApplied(false);
        setShowFilters(false);
    };

    const applyFilters = (
        apiaryName: string,
        locationName: string,
        apiaryStatus: ApiaryStatus
    ): void => {
        setFilterApplied(true);
        setShowFilters(false);

        const filteredApiaries = apiaries.filter((apiary) => {
            // Apply your filter criteria here
            const matchesApiaryName =
                apiaryName === "" || apiary.name.toLowerCase().includes(apiaryName.toLowerCase());
            const matchesLocationName =
                locationName === "" || apiary.town.toLowerCase().includes(locationName.toLowerCase());
            const matchesApiaryStatus = apiaryStatus === null || apiary.status === apiaryStatus;
            // const matchesApiaryStatus =
            //     apiaryStatus === "" || giveApiaryStatusName(apiary.status).toLowerCase().includes(apiaryStatus.toLowerCase());

            return matchesApiaryName && matchesLocationName && matchesApiaryStatus;
        });
        setApiaries(filteredApiaries);
        showToast(`Filtros aplicados - ${filteredApiaries.length} resultados`);
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {isLoading && (
                <View
                    className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
                    <Spinner size="lg" color="#785900"/>
                </View>
            )}

            {!isLoading && (
                <View className="pt-5 pb-2 h-full w-full bg-background">
                    <Text className="font-light text-center text-4xl text-on_background">
                        Lista de apiários
                    </Text>

                    <View>
                        <View className="w-full flex-row justify-between items-end mr-5 my-3">
                            <View className="flex-row justify-start">
                                <TouchableOpacity
                                    className="w-fit  text-sm bg-primary m-2 rounded-lg text-on_primary border"
                                    onPress={() => setShowFilters(!showFilters)}
                                >
                                    <Text className="font-light text-center text-md m-3 text-on_primary">
                                        {" "}
                                        {showFilters ? "Fechar filtros" : "Mostrar filtros"}
                                    </Text>
                                </TouchableOpacity>

                                {filterApplied && (
                                    <TouchableOpacity
                                        className="w-fit  text-sm bg-error m-2 rounded-lg text-on_primary border"
                                        onPress={() => removeFilters()}
                                    >
                                        <Text className="font-light text-center text-md m-3 text-on_primary">
                                            Remover filtros
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {user && user.role !== "EMPLOYEE" && (
                                <TouchableOpacity
                                    className="w-fit text-sm m-2 mr-5 rounded-lg text-on_primary"
                                    onPress={() => {
                                        navigation.navigate("create_apiary");
                                    }}
                                >
                                    <Image source={PlusIcon} alt="img" style={{width: 50, height: 50}}/>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Divider className="mb-4 border-opacity-40 border-1"/>

                        {showFilters && (
                            <ApiarySearchFilters
                                apiaryName={apiaryName}
                                setApiaryName={setApiaryName}
                                locationName={locationName}
                                setLocationName={setLocationName}
                                apiaryStatus={apiaryStatus}
                                setApiaryStatus={setApiaryStatus}
                                applyFilters={applyFilters}
                                removeFilter={removeFilters}
                                filterApplied={filterApplied}
                            />
                        )}

                        {!showFilters && (
                            //TO SHOW THE APIARIES
                            <View className="w-fit flex justify-end">
                                <Text className="font-light ml-3 text-left text-md text-on_background">
                                    Total de {apiaries?.length} apiários{" "}
                                </Text>
                                {apiaries.map((item) => (
                                    <ApiaryItem
                                        key={item.name}
                                        apiary={item}
                                        selectApiary={() => {
                                            navigation.navigate("details_apiary", {
                                                apiary: item,
                                                navigation: navigation,
                                            });
                                        }}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

export default ApiariesList;

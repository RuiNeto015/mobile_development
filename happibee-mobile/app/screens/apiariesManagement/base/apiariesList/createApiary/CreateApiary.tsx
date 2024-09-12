import React, {useState} from "react";
import {ActivityIndicator, Text, TextInput, ToastAndroid, TouchableOpacity, View,} from "react-native";
import {RadioButton} from "react-native-paper";
import {Image, ScrollView} from "native-base";
import {BeehiveStructureType, IBeehive} from "../../../../../schemas/interfaces/IApiary";
import AddBeehive from "./AddBeehive";
import TrashBin from "../../../../../../img/trash-bin.png";
import {CreateApiaryDto, mapBeehiveToDto} from "../../../../../schemas/dtos/CreateApiaryDto";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {API_BASE_URL} from "../../../../../../config";
import {formatDateToYYYYMMDD} from "../../../../../utils/DateUtils";
import mapResponseToApiaryModel from "../../../../../schemas/mappers/ApiaryMapper";
import LocationMap from "./LocationMap";
import {writeBeehiveType} from "../ApiariesListUtils";
import DatabaseApiaryService from "../../../../../services/db/DatabaseApiaryService";
import {getToken, getUser, storeToken} from "../../../../../utils/JwtTokenUtil";

type BeehivePropsItem = { beehive: IBeehive; removeBeehive: (beehiveName: string) => void };

const BeehiveItem = ({beehive, removeBeehive}: BeehivePropsItem) => (
    <View className="bg-background rounded-lg my-3 border p-3">
        <View className="flex-row w-full justify-center">
            <Text className="text-center text-xl font-bold text-on_background m-auto">
                {beehive.name}
            </Text>
        </View>
        <View className="flex w-full justify-start space-y-1">
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Tipo:</Text> {beehive.type}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Estrutura da colmeia:</Text> {writeBeehiveType(beehive.structureType)}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Cor:</Text> {beehive.color.trim()}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Fonte:</Text> {beehive.source.trim()}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Nº de quadros:</Text> {beehive.frames}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Raça da rainha:</Text> {beehive.queenRace}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Data da aceitação da rainha:</Text>{" "}
                {formatDateToYYYYMMDD(beehive.queenAcceptAt)}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Alças de criação:</Text> {beehive.hiveBodiesOfCreation}
            </Text>
            <Text className=" text-md text-on_background">
                <Text className="font-bold">Alças de mel:</Text> {beehive.hiveBodiesOfHoney}
            </Text>
        </View>
        <TouchableOpacity
            className="flex-row justify-center w-full text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
            onPress={() => removeBeehive(beehive.name)}>
            <Image
                className="w-fit"
                source={TrashBin}
                alt="Trash Bin"
                style={{width: 50, height: 50}}
            />
        </TouchableOpacity>
    </View>
);

const showToast = (message: string) => {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
};

const mockBeehives: IBeehive[] = [
    {
        name: "Colmeia 1",
        type: "Lusitana",
        structureType: BeehiveStructureType.CORE,
        color: "Amarela",
        source: "Roubada",
        frames: 10,
        queenRace: "Abelha Rainha",
        queenAcceptAt: new Date(),
        hiveBodiesOfCreation: 2,
        hiveBodiesOfHoney: 3,
    },
    {
        name: "Colmeia 2",
        type: "Lusitana",
        structureType: BeehiveStructureType.NORMAL,
        color: "Laranja",
        source: "Roubada",
        frames: 8,
        queenRace: "Abelha Italiana",
        queenAcceptAt: new Date(),
        hiveBodiesOfCreation: 3,
        hiveBodiesOfHoney: 5,
    },
];

function CreateApiary({navigation}: NativeStackScreenProps<any>) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showingMap, setShowingMap] = useState<boolean>(false);

    const [apiaryName, setApiaryName] = useState<string>("");
    const [locationName, setLocationName] = useState<string>("");
    const [nameOfPlace, setNameOfPlace] = useState<string>("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [intensiveCultivation, setIntensiveCultivation] = useState<boolean>(false);
    const [inControlledZone, setInControlledZone] = useState<boolean>(false);
    const [beehives, setBeehives] = useState<IBeehive[]>(mockBeehives);
    const [showBeehiveForm, setShowBeehiveForm] = useState<boolean>(false);

    const addBeehive = (beehive: IBeehive): boolean => {
        // Validate if the beehive with the same name already exists
        const isBeehiveExists = beehives.some(
            (existingBeehive) => existingBeehive.name === beehive.name
        );
        if (isBeehiveExists) {
            showToast("Já existe uma colmeia com esse nome");
            return false;
        }

        // Update the state with the new beehive
        setBeehives([...beehives, beehive]);
        return true;
    };

    const removeBeehiveFunc = (beehiveName: string): void => {
        // Remove the beehive with the given name from the state
        setBeehives(beehives.filter((beehive) => beehive.name !== beehiveName));
    };

    const closeMap = (): void => {
        setShowingMap(false);
    };

    const applySubmission = async () => {
        if (!apiaryName || !locationName || !nameOfPlace || !latitude || !longitude) {
            showToast("Todos os campos devem estar inseridos");
        } else if (beehives.length === 0) {
            showToast("Não existem colmeias associadas");
            return;
        } else {
            setIsLoading(true);
            const user = JSON.parse(await getUser())

            // Create the apiary DTO
            const apiaryDto: CreateApiaryDto = {
                name: apiaryName,
                tenantId: user.tenantId,
                beehives: beehives.map(mapBeehiveToDto),
                town: locationName,
                geoLocation: {
                    latitude,
                    longitude,
                },
                nameOfLocal: nameOfPlace,
                intensiveCultivation,
                inControlledZone,
            };

            try {
                const token = await getToken()
                console.log('token to create apiary', token)
                const response = await fetch(`${API_BASE_URL}/apiary`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(apiaryDto),
                });
                console.log('create apiary dto', JSON.stringify(apiaryDto))
                const responseData = await response.json();

                if (response.status == 200) {
                    //transform the received message into the Apiary Model
                    console.log('response', responseData);
                    const apiaryModel = mapResponseToApiaryModel(responseData);
                    await DatabaseApiaryService.save(apiaryModel);
                    showToast("Apiário submetido com sucesso");
                    navigation.navigate("apiaries_list")
                } else if (response.status == 400) {
                    showToast(responseData.message);
                } else if (response.status == 401) {
                    showToast("A sua sessão expirou!");
                } else {
                    showToast("Algum problema occoreu. Contacte a equipa de suport Hapibee.");
                }
            } catch (error: any) {
                console.error("Error submitting APIary:", error);
                showToast(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text className="mt-2 text-on_background">A enviar pedido...</Text>
                </View>
            )}

            {showingMap && (
                <LocationMap setLongitude={setLongitude} setLatitude={setLatitude} closeMap={closeMap}/>
            )}

            {showBeehiveForm && !isLoading && !showingMap && (
                <AddBeehive addBeehiveFunc={addBeehive} setShowBeehiveForm={setShowBeehiveForm}/>
            )}

            {!showBeehiveForm && !isLoading && !showingMap && (
                <View className="pt-5 pb-2 h-full w-full bg-background">
                    <Text className="font-light text-center text-4xl text-on_background">
                        Registo de um apiário
                    </Text>
                    <Text className="font-bold text-xl text-center text-on_background mt-5">
                        Informação geral
                    </Text>
                    <View className="p-2 w-full bg-background">
                        {/* ... Nome do apiário  ... */}
                        <Text className="font-light text-xl text-on_background mb-2 mt-4">Nome do apiário</Text>
                        <TextInput
                            className="border dark:border-on_background-dark text-on_background w-full rounded-lg mb-4"
                            placeholder="Exemplo: Apiário X"
                            value={apiaryName}
                            onChangeText={(text: string) => setApiaryName(text)}
                        />
                        {/* ... Freguesia do apiário ... */}
                        <Text className="font-light text-xl text-on_background mb-2">Freguesia do apiário</Text>
                        <TextInput
                            className="border w-full rounded-lg mb-5 text-on_background"
                            placeholder="Exemplo: Guimarães"
                            value={locationName}
                            onChangeText={(text: string) => setLocationName(text)}
                        />
                        {/* ... Nome do local ... */}
                        <Text className="font-light text-xl text-on_background mb-2">Nome do local</Text>
                        <TextInput
                            className="border w-full rounded-lg mb-5"
                            placeholder="Exemplo: Lugar"
                            value={nameOfPlace}
                            onChangeText={(text: string) => setNameOfPlace(text)}
                        />
                        {/* ... Geolocalização do apiário ... */}
                        <Text className="font-light text-xl text-on_background mb-2">
                            Geolocalização do apiário
                        </Text>
                        {latitude != 0 && longitude != 0 && (
                            <View className="w-full flex-row justify-between bg-background">
                                <View className="w-5/12">
                                    <Text className="my-auto text-on_background">Latitude</Text>
                                    <TextInput
                                        className="border w-full  rounded-lg mb-5"
                                        editable={false}
                                        value={latitude.toString()}
                                        onChangeText={(text: string) => setLatitude(parseInt(text) || 0)}
                                    />
                                </View>
                                <View className="w-5/12">
                                    <Text className="my-auto mb-2 text-on_background">Longitude</Text>
                                    <TextInput
                                        className="border w-full rounded-lg mb-5"
                                        editable={false}
                                        value={longitude.toString()}
                                        onChangeText={(text: string) => setLongitude(parseInt(text) || 0)}
                                    />
                                </View>
                            </View>
                        )}
                        <View className="w-full">
                            <TouchableOpacity
                                className="text-sm bg-on_background dark:bg-on_background-dark rounded-lg text-on_background border"
                                onPress={() => setShowingMap(true)}>
                                <Text className="font-bold text-center w-fit text-md m-3 text-on_primary">
                                    Abrir mapa
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* ... Zona controlada ... */}
                        <Text className="font-light text-xl w-full mt-4 text-on_background">
                            Pertence a uma Zona Controlada?
                        </Text>
                        <View className="flex-row justify-start w-5/12 ml-0 mb-5">
                            <View className="flex-row mr-10">
                                <RadioButton
                                    value="inControlledZone"
                                    status={inControlledZone ? "checked" : "unchecked"}
                                    onPress={() => setInControlledZone(true)}
                                />
                                <Text className="my-auto text-on_background">Sim</Text>
                            </View>
                            <View className="flex-row">
                                <RadioButton
                                    value="inControlledZone"
                                    status={!inControlledZone ? "checked" : "unchecked"}
                                    onPress={() => setInControlledZone(false)}
                                />
                                <Text className="my-auto text-on_background">Não</Text>
                            </View>
                        </View>
                        {/* ... Zona controlada ... */}
                        <Text className="font-light text-xl w-full text-on_background">Cultura intensiva?</Text>
                        <View className="flex-row justify-start w-5/12 mb-5">
                            <View className="flex-row mr-10">
                                <RadioButton
                                    value="true"
                                    status={intensiveCultivation ? "checked" : "unchecked"}
                                    onPress={() => setIntensiveCultivation(true)}
                                />
                                <Text className="my-auto text-on_background">Sim</Text>
                            </View>
                            <View className="flex-row">
                                <RadioButton
                                    value="false"
                                    status={!intensiveCultivation ? "checked" : "unchecked"}
                                    onPress={() => setIntensiveCultivation(false)}
                                />
                                <Text className="my-auto text-on_background">Não</Text>
                            </View>
                        </View>

                        {/* ... Colmeias ... */}
                        <Text className="font-bold text-xl text-center text-on_background mb-5">Colmeias</Text>
                        <View className="flex-row justify-between mb-4">
                            <Text className="font-light text-md text-on_background mb-2 my-auto">
                                Total colmeias: {beehives.length}
                            </Text>
                            <TouchableOpacity
                                className="text-sm bg-on_background dark:bg-on_background-dark w-6/12 rounded-lg text-on_primary border"
                                onPress={() => {
                                    // setShowBeehiveForm(!showBeehiveForm)
                                    navigation.navigate("add_behive", {
                                        navigation: navigation,
                                        addBeehiveFunc: addBeehive,
                                    });
                                }}>
                                <Text className="font-bold text-center w-fit text-md m-3 text-on_primary">
                                    Adicionar colmeia
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {
                            beehives.map((item) => (
                                <BeehiveItem key={item.name} beehive={item} removeBeehive={removeBeehiveFunc}/>
                            ))
                        }

                        {/* ... Submeter ... */}
                        <TouchableOpacity
                            className="w-full text-sm bg-success mt-5 rounded-lg text-on_primary border"
                            onPress={applySubmission}>
                            <Text className="text-center font-bold text-md m-3 text-on_primary">
                                Submeter registo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

export default CreateApiary;

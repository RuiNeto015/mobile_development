import {Select, Input, Button, Spinner} from "native-base";
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {ITranshumance, ITranshumanceDraft} from "../../../../schemas/interfaces/ITranshumance";
import React, {useCallback, useEffect, useState} from "react";
import {ApiaryStatus, IApiary} from "../../../../schemas/interfaces/IApiary";
import {useFocusEffect} from "@react-navigation/native";
import {DatabaseApiaryService, DatabaseTranshumanceService} from "../../../../services/db";
import DatePicker from "react-native-date-picker";
import {formatDateToYYYYMMDD} from "../../../../utils/DateUtils";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {API_BASE_URL} from "../../../../../config";
import {getToken} from "../../../../utils/JwtTokenUtil";
import LocationMap from "../../base/apiariesList/createApiary/LocationMap";

const Dropdown = ({
                      values,
                      selected,
                      onChange,
                  }: {
    values: string[];
    selected: string;
    onChange: (val: string) => void;
    placeholder: string;
}) => (
    <Select
        onValueChange={(val) => onChange(val)}
        minWidth="200"
        selectedValue={selected}
        accessibilityLabel="Escolher apiário"
        placeholder="Escolher apiário"
        mt={1}
    >
        {values.map((val) => (
            <Select.Item label={val} value={val}/>
        ))}
    </Select>
);

function RegisterForm1({navigation, route}: NativeStackScreenProps<any>) {
    const [transhumance, setTranshumance] = useState<ITranshumance>({
        apiaryId: route.params?.draft.apiaryId,
    });
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [plateIsValid, setPlateIsValid] = useState(false);
    const [durationIsValid, setDurationIsValid] = useState(false);
    const [latIsValid, setLatIsValid] = useState(false);
    const [countyIsValid, setCountyIsValid] = useState(false);
    const [districtIsValid, setDistrictIsValid] = useState(false);
    const [parishIsValid, setParishIsValid] = useState(false);
    const [apiaryIsValid, setApiaryIsValid] = useState(false);
    const [apiaries, setApiaries] = useState<IApiary[]>([]);
    const [apiary, setApiary] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const [showingMap, setShowingMap] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

    const updateField = <K extends keyof ITranshumance>(field: K, value: ITranshumance[K]) => {
        setTranshumance((prevTranshumance) => ({
            ...prevTranshumance,
            [field]: value,
        }));
    };

    const closeMap = (): void => {
        setShowingMap(false);
    };

    useEffect(() => {
        DatabaseApiaryService.getAll()
            .then((apiaries: IApiary[]) =>
                apiaries.filter((apiary) => apiary.status === ApiaryStatus.ACTIVE)
            )
            .then((activeApiaries: IApiary[]) => setApiaries(activeApiaries));
    }, []);

    const makeHTTPRequest = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();

            transhumance.destLat = latitude.toString();
            transhumance.destLong = longitude.toString();

            //controlled zone
            if (latitude > 40.82 && latitude < 42.200 && longitude > -8 && longitude < -6) {
                transhumance.district = "1";
                transhumance.parish = "1";
                transhumance.county = "1";
            } else {
                const getRandomNumber = () => Math.floor(Math.random() * (20 - 2 + 1)) + 2;

                transhumance.district = getRandomNumber().toString();
                transhumance.parish = getRandomNumber().toString();
                transhumance.county = getRandomNumber().toString();
            }

            const response = await fetch(`${API_BASE_URL}/apiary/transhumance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(transhumance),
            });

            setIsLoading(false);
            if (!response.ok) {
                //navigation.navigate("transhumances_draft");
                return;
            }
            //navigation.navigate("transhumances_draft");
            Alert.alert("Transumância registada", "Consulte a transumância no histórico do apiário");
            const data = await response.json();
        } catch (error) {
            Alert.alert("Erro!", "Falha na comunicação com o servidor");
            //navigation.navigate("transhumances_draft");
        }
    };

    useEffect(() => {
        const isValid = apiaries.some((a) => a.name === apiary);
        setApiaryIsValid(isValid || false);
    }, [apiary]);

    useEffect(() => {
        const isValid = /^\d{1,2}h$/.test(transhumance.travelDuration || "");
        setDurationIsValid(isValid);
    }, [transhumance.travelDuration]);

    useEffect(() => {
        const isValid = transhumance.carPlate && !/\s/.test(transhumance.carPlate || "");
        setPlateIsValid(isValid || false);
    }, [transhumance.carPlate]);

    useEffect(() => {
        updateField("destLong", longitude.toString())
    }, [longitude]);


    useEffect(() => {
        updateField("destLat", latitude.toString())
    }, [latitude]);

    useEffect(() => {
        const isValid = /^\d+$/.test(transhumance.county || "");
        setCountyIsValid(isValid || false);
    }, [transhumance.county]);

    useEffect(() => {
        const isValid = /^\d+$/.test(transhumance.district || "");
        setDistrictIsValid(isValid || false);
    }, [transhumance.district]);

    useEffect(() => {
        const isValid = /^\d+$/.test(transhumance.parish || "");
        setParishIsValid(isValid || false);
    }, [transhumance.parish]);

    function isGeoLocationValid() {
        return !(longitude == 0 || latitude === 0);
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {isLoading ? (
                <View
                    className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
                    <Spinner size="lg" color="#785900"/>
                </View>
            ) : null}

            {showingMap && (
                <LocationMap setLongitude={setLongitude} setLatitude={setLatitude} closeMap={closeMap}/>
            )}

            {!showingMap && (
                <View className="flex flex-col items-center space-y-10 bg-white h-full w-full pt-5 px-4">
                    <Text className="text-2xl font-bold text-gray-800">Comunicar Transumância</Text>
                    <View className="flex flex-col w-full space-y-4">
                        <View className="mt-1 w-full">
                            <Dropdown
                                onChange={(val: string) => {
                                    setApiary(val);
                                    updateField("apiaryId", apiaries.find((a) => a.name === val)?.id || "");
                                }}
                                values={apiaries.map((apiary) => apiary.name)}
                                selected={apiary}
                            />
                        </View>

                        <View className="w-full">
                            <TouchableOpacity
                                className="text-sm bg-on_background dark:bg-on_background-dark rounded-lg text-on_background border"
                                onPress={() => setShowingMap(true)}>
                                <Text className="font-bold text-center w-fit text-md m-3 text-on_primary">
                                    Abrir mapa
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {latitude != 0 && longitude != 0 && (
                            <View className="w-full flex-row justify-between bg-background">
                                <View className="w-5/12">
                                    <Text className="my-auto text-on_background">Latitude</Text>
                                    <TextInput
                                        className="border w-full  rounded-lg"
                                        editable={false}
                                        value={latitude.toString()}
                                        onChangeText={(text: string) => setLatitude(parseInt(text) || 0)}
                                    />
                                </View>
                                <View className="w-5/12">
                                    <Text className="my-auto mb-2 text-on_background">Longitude</Text>
                                    <TextInput
                                        className="border w-full rounded-lg"
                                        editable={false}
                                        value={longitude.toString()}
                                        onChangeText={(text: string) => setLongitude(parseInt(text) || 0)}
                                    />
                                </View>
                            </View>
                        )}

                        {latitude == 0 && longitude == 0 && (
                            <View className="w-full flex-row justify-center bg-background">
                                <Text className="my-auto text-on_background text-red-800 ">Sem localização
                                    definida</Text>
                            </View>
                        )}

                        <View className="flex flex-col w-full">
                            <Text
                                className={`text-md font text-gray-800 mb-2 ${
                                    plateIsValid ? "text-gray-800" : "text-red-800"
                                }`}
                            >
                                Matrícula
                            </Text>
                            <Input
                                value={transhumance.carPlate}
                                variant="outline"
                                backgroundColor={"white"}
                                focusOutlineColor={"#785900"}
                                placeholder={"52-12-LG"}
                                onChangeText={(val: string) => updateField("carPlate", val)}
                            />
                        </View>

                        <View className="flex flex-col w-full">
                            <TouchableOpacity
                                className="w-full text-sm bg-background mt-3 rounded-lg text-on_primary border"
                                onPress={() => setDatePickerOpen(true)}>
                                <Text className="text-center font-bold text-md m-3 text-on_background">
                                    {transhumance.travelDate == undefined
                                        ? "Data prevista para a deslocação"
                                        : formatDateToYYYYMMDD(transhumance.travelDate)}
                                </Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode="date"
                                minimumDate={new Date()}
                                open={datePickerOpen}
                                date={transhumance.travelDate || new Date()}
                                onConfirm={(date) => {
                                    setDatePickerOpen(false);
                                    updateField("travelDate", date);
                                }}
                                onCancel={() => {
                                    setDatePickerOpen(false);
                                }}
                            />
                        </View>

                        <View className="flex flex-col w-full">
                            <Text
                                className={`text-md font mb-2 ${durationIsValid ? "text-gray-800" : "text-red-800"}`}
                            >
                                Duração estimada do transporte
                            </Text>
                            <Input
                                value={transhumance.travelDuration}
                                variant="outline"
                                backgroundColor={"white"}
                                focusOutlineColor={"#785900"}
                                placeholder={"1h"}
                                onChangeText={(val: string) => updateField("travelDuration", val)}
                            />
                        </View>

                        <Button
                            onPress={() => makeHTTPRequest()}
                            disabled={
                                !plateIsValid ||
                                !isGeoLocationValid() ||
                                !durationIsValid ||
                                !apiaryIsValid ||
                                transhumance.travelDate == undefined
                            }
                            className={`bg-tertiary ${
                                !plateIsValid ||
                                !durationIsValid ||
                                !isGeoLocationValid() ||
                                !apiaryIsValid ||
                                transhumance.travelDate == undefined
                                    ? "bg-gray-100"
                                    : ""
                            }`}
                        >
                            <Text className="text-3xl text-on_tertiary">Submeter</Text>
                        </Button>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}


export default RegisterForm1;

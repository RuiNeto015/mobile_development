import {Button, Input, Select, Spinner, Text} from "native-base";
import {useEffect, useState} from "react";
import {Alert, View} from "react-native";
import DatabaseApiaryService from "../../../../services/db/DatabaseApiaryService";
import {
    ApiaryEventType,
    ApiaryStatus,
    IApiary,
    IApiaryHistory,
} from "../../../../schemas/interfaces/IApiary";
import {getToken, getUser} from "../../../../utils/JwtTokenUtil";
import {API_BASE_URL} from "../../../../../config";
import {DatabaseInspectionsService} from "../../../../services/db";
import {IInspection} from "../../../../schemas/interfaces/IInspection";
import {formatDateToYYYYMMDD, formatLocalDateTime} from "../../../../utils/DateUtils";

const Dropdown = ({
                      values,
                      selected,
                      onChange,
                  }: {
    values: string[];
    selected: string;
    onChange: (val: string) => void;
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

function Diseases() {
    const [text, setText] = useState("");
    const [apiary, setApiary] = useState("");
    const [apiaries, setApiaries] = useState<IApiary[]>([]);
    const [diseaseIsValid, setDiseaseIsValid] = useState(true);
    const [apiaryIsValid, setApiaryIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        DatabaseApiaryService.getAll()
            .then((apiaries: IApiary[]) =>
                apiaries.filter((apiary) => apiary.status === ApiaryStatus.ACTIVE)
            )
            .then((activeApiaries: IApiary[]) => setApiaries(activeApiaries));
    }, []);

    useEffect(() => {
        const isValid = text && !/\s/.test(text || "");
        setDiseaseIsValid(isValid || false);
    }, [text]);

    useEffect(() => {
        const isValid = apiaries.some((a) => a.name === apiary);
        setApiaryIsValid(isValid || false);
    }, [apiary]);

    const makeHTTPRequest = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const userData = JSON.parse((await getUser()) || "");
            const response = await fetch(`${API_BASE_URL}/apiary/disease`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({apiary: apiary, disease: text, tenantId: userData.tenantId}),
            });

            const entry: IApiaryHistory = {
                apiaryId: apiaries.find((a) => a.name === apiary)?.id || "",
                requestAt: new Date(),
                type: ApiaryEventType.DISEASE,
                disease: text,
            };
            await DatabaseApiaryService.addHistory(entry);
            setIsLoading(false);
            if (!response.ok) {
                Alert.alert("Erro!", "Falha na comunicação com o servidor");
                return;
            }

            Alert.alert("Doença registada", "Histórico do apiário atualizado");
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Erro!", "Falha na comunicação com o servidor");
        }
    };

    return (
        <>
            {isLoading ? (
                <View
                    className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
                    <Spinner size="lg" color="#785900"/>
                </View>
            ) : null}
            <View className="flex-col items-center py-5 h-full w-full bg-background px-2 space-y-5">
                <Text className="text-2xl font-bold text-gray-800">Registar doença</Text>
                <View className="mt-1 w-full">
                    <Dropdown
                        onChange={(val: string) => setApiary(val)}
                        values={apiaries.map((apiary) => apiary.name)}
                        selected={apiary}
                    />
                </View>
                <View className="mt-1 w-full">
                    <Input
                        bgColor={"white"}
                        focusOutlineColor={"black"}
                        value={text}
                        variant="outline"
                        placeholder={"Ex: varrose"}
                        onChangeText={(text) => setText(text)}
                    />
                </View>
                <Button
                    onPress={() => makeHTTPRequest()}
                    disabled={!diseaseIsValid || !apiaryIsValid}
                    className={`bg-tertiary ${!diseaseIsValid || !apiaryIsValid ? "bg-gray-100" : ""}`}
                >
                    <Text className="text-xl text-on_primary text-center">Submeter</Text>
                </Button>
            </View>
        </>
    );
}

export default Diseases;

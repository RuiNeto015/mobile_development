import React, {useState} from "react";
import {Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {ScrollView} from "native-base";
import {BeehiveStructureType, IBeehive} from "../../../../../schemas/interfaces/IApiary";
import {StackActions} from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import {formatDateToYYYYMMDD} from "../../../../../utils/DateUtils";
import {Dropdown} from "react-native-element-dropdown";

const showToast = (message: string) => {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
};

const beehiveTypeDrop = [
    {label: "Núcleo", value: BeehiveStructureType.CORE},
    {label: "Colmeia", value: BeehiveStructureType.NORMAL},
];

function AddBeehive({route}: any) {
    const {addBeehiveFunc, navigation} = route.params;

    const [beehiveName, setBeehiveName] = useState<string>("");
    const [beehiveType, setBeehiveType] = useState<string>("");
    const [structureType, setStructureType] = useState<BeehiveStructureType>(BeehiveStructureType.NORMAL);
    const [color, setColor] = useState<string>("");
    const [source, setSource] = useState<string>("");
    const [frames, setFrames] = useState<number>(0);
    const [queenRace, setQueenRace] = useState<string>("");
    const [hiveBodiesOfCreation, setHiveBodiesOfCreation] = useState<number>(0);
    const [hiveBodiesOfHoney, setHiveBodiesOfHoney] = useState<number>(0);

    const [queenAcceptAt, setQueenAcceptAt] = useState<Date>(new Date());
    const [open, setOpen] = useState<boolean>(false);
    const [dateChosen, setDateChosen] = useState<boolean>(false);
    const maximumDate = new Date();

    const [apiaryStatus, setApiaryStatus] = useState<string>("");
    const [isFocusDropDown, setIsFocusDropDown] = useState(false);

    const submitBeehive = () => {
        const emptyFields = [];

        // Check each field individually
        if (!beehiveType) {
            emptyFields.push('Tipo da colmeia');
        }
        if (!structureType) {
            emptyFields.push('Tipo de estrutura');
        }
        if (!beehiveName) {
            emptyFields.push('Nome da colmeia');
        }
        if (!beehiveType) {
            emptyFields.push('Tipo da colmeia');
        }
        if (!structureType) {
            emptyFields.push('Tipo de estrutura');
        }
        if (!color) {
            emptyFields.push('Cor');
        }
        if (!source) {
            emptyFields.push('Fonte');
        }
        if (!frames) {
            emptyFields.push('Quadros');
        }
        if (!queenRace) {
            emptyFields.push('Raça da rainha');
        }
        if (queenAcceptAt == null) {
            emptyFields.push('Data de aceitação da rainha');
        }
        if (!hiveBodiesOfCreation) {
            emptyFields.push('Corpos da colmeia de criação');
        }
        if (!hiveBodiesOfHoney) {
            emptyFields.push('Corpos da colmeia de mel');
        }

        if (emptyFields.length > 0) {
            const message = `Campos vazios:\n${emptyFields.map(field => `- ${field}`).join('\n')}`;
            Alert.alert(
                'Erro no formulário',
                message,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'), // Handle the OK button press
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () =>
                        Alert.alert(
                            'This alert was dismissed by tapping outside of the alert dialog.',
                        ),
                },
            );
            return;
        }
        const newBeehive: IBeehive = {
            name: beehiveName.trim(),
            type: beehiveType.trim(),
            structureType: structureType,
            color: color.trim(),
            source: source.trim(),
            frames: frames,
            queenRace: queenRace.trim(),
            queenAcceptAt: queenAcceptAt,
            hiveBodiesOfCreation: hiveBodiesOfCreation,
            hiveBodiesOfHoney: hiveBodiesOfHoney,
        };

        const isSuccess = addBeehiveFunc(newBeehive);

        if (isSuccess) {
            showToast("Colmeia inserida com sucesso");
            const popAction = StackActions.pop(1);
            navigation.dispatch(popAction);
        }
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View className="pt-5 pb-2 h-full w-full bg-background">
                <Text className="font-light text-center text-4xl text-on_background">
                    Registo de um apiário
                </Text>
                <Text className="font-bold text-xl text-center text-on_background mt-5">
                    Criação de uma colmeia
                </Text>
                <View className="p-2 w-full bg-background">
                    {/* ... Nome da colmeia  ... */}
                    <Text className="font-light text-xl text-on_background mb-2 mt-4">Nome da colmeia</Text>
                    <TextInput
                        className="border dark:border-on_background-dark w-full rounded-lg mb-4"
                        placeholder="Exemplo: Colmeia A"
                        value={beehiveName}
                        onChangeText={(text: string) => setBeehiveName(text)}
                    />

                    {/* ... Tipo de colmeia  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Tipo de colmeia</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: Tipo X"
                        value={beehiveType}
                        onChangeText={(text: string) => setBeehiveType(text)}
                    />

                    {/* ... Estrutura da colmeia  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Estrutura da colmeia</Text>

                    <Dropdown
                        className="border rounded-lg text-md mb-3 p-2 text-gray-200"
                        data={beehiveTypeDrop}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder=""
                        value={beehiveType}
                        onFocus={() => setIsFocusDropDown(true)}
                        onBlur={() => setIsFocusDropDown(false)}
                        onChange={(item) => {
                            setApiaryStatus(item.label);
                            setIsFocusDropDown(false);
                        }}
                    />

                    {/* ... Cor da colmeia  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Cor da colmeia</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: Azul"
                        value={color}
                        onChangeText={(text: string) => setColor(text)}
                    />

                    {/* ... Fonte da colmeia  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Fonte da colmeia</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: Fonte Z"
                        value={source}
                        onChangeText={(text: string) => setSource(text)}
                    />

                    {/* ... Número de quadros  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Número de quadros</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: 10"
                        value={frames.toString()}
                        onChangeText={(text: string) => setFrames(parseInt(text) || 0)}
                    />

                    {/* ... Raça da rainha  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Raça da rainha</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: Raça Italiana"
                        value={queenRace}
                        onChangeText={(text: string) => setQueenRace(text)}
                    />

                    {/* ... Aceitação da rainha  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Aceitação da rainha</Text>
                    {dateChosen && (
                        <Text className="font-bold text-mg  text-on_background">
                            Data escolhida: {formatDateToYYYYMMDD(queenAcceptAt)}
                        </Text>
                    )}
                    {!dateChosen && (
                        <Text className="font-light text-md text-on_background">Sem data associada</Text>
                    )}
                    <TouchableOpacity
                        className="w-full text-sm bg-background mt-3 rounded-lg text-on_primary border"
                        onPress={() => setOpen(true)}
                    >
                        <Text className="text-center font-bold text-md m-3 text-on_background">
                            Escolher data
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode="date"
                        open={open}
                        maximumDate={maximumDate}
                        date={queenAcceptAt}
                        onConfirm={(date) => {
                            setOpen(false);
                            setQueenAcceptAt(date);
                            setDateChosen(true);
                        }}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />

                    {/* ... Corpos da criação  ... */}
                    <Text className="font-light text-xl text-on_background mb-2 mt-3">Alças de criação</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: 2"
                        value={hiveBodiesOfCreation.toString()}
                        onChangeText={(text: string) => setHiveBodiesOfCreation(parseInt(text) || 0)}
                    />

                    {/* ... Corpos de mel  ... */}
                    <Text className="font-light text-xl text-on_background mb-2">Alças de mel</Text>
                    <TextInput
                        className="border w-full rounded-lg mb-5"
                        placeholder="Exemplo: 3"
                        value={hiveBodiesOfHoney.toString()}
                        onChangeText={(text: string) => setHiveBodiesOfHoney(parseInt(text) || 0)}
                    />

                    {/* ... Submeter ... */}
                    <TouchableOpacity
                        className="w-full text-sm bg-success mt-5 rounded-lg text-on_primary border"
                        onPress={() => submitBeehive()}>
                        <Text className="text-center font-bold text-md m-3 text-on_primary">
                            Adicionar colmeia
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default AddBeehive;

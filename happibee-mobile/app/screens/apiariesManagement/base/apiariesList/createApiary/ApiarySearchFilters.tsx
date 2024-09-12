import React, {useState} from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {ApiaryStatus, IApiary} from "../../../../../schemas/interfaces/IApiary";

interface ApiaryFiltersProps {
    apiaryName: string,
    setApiaryName: React.Dispatch<React.SetStateAction<string>>,
    locationName: string,
    setLocationName: React.Dispatch<React.SetStateAction<string>>,
    apiaryStatus: ApiaryStatus,
    setApiaryStatus: React.Dispatch<React.SetStateAction<ApiaryStatus>>,
    applyFilters: (apiaryName: string, locationName: string, apiaryStatus: ApiaryStatus) => void,
    filterApplied: boolean,
    removeFilter: () => void
}

const ApiarySearchFilters: React.FC<ApiaryFiltersProps> = ({
                                                               apiaryName,
                                                               setApiaryName,
                                                               locationName,
                                                               setLocationName,
                                                               apiaryStatus,
                                                               setApiaryStatus,
                                                               applyFilters,
                                                               filterApplied,
                                                               removeFilter
                                                           }) => {
    // const [apiaryName, setApiaryName] = useState('');
    // const [locationName, setLocationName] = useState('');
    // const [apiaryStatus, setApiaryStatus] = useState<string>('');
    const [isFocusDropDown, setIsFocusDropDown] = useState(false);

    const apiaryStatusData = [
        {label: 'Ativado', value: ApiaryStatus.ACTIVE},
        {label: 'Reprovado', value: ApiaryStatus.REJECTED},
        {label: 'Em espera - Zona Controlada', value: ApiaryStatus.WAITING_CZ},
        {label: 'Em espera - DGADR', value: ApiaryStatus.WAITING_DGADR},
    ];

    return (
        <View className="w-fit flex justify-end mx-3">
            {/* ... Nome do apiário ... */}
            <Text className="font-light text-xl text-on_background mb-2">Nome do apiário</Text>
            <TextInput
                className="border dark:border-on_background-dark w-full rounded-lg mb-4"
                placeholder="Exemplo: Apiário X"
                value={apiaryName}
                onChangeText={(text: string) => setApiaryName(text)}
            />
            {/* ... Localidade do apiário ... */}
            <Text className="font-light text-xl text-on_background mb-2">Localidade do apiário</Text>
            <TextInput
                className="border w-full rounded-lg mb-4"
                placeholder="Exemplo: Apiário X"
                value={locationName}
                onChangeText={(text: string) => setLocationName(text)}
            />
            {/* ... Estado do apiário ... */}
            <Text className="font-light text-xl text-on_background mb-2">Estado do apiário</Text>
            <Dropdown
                className="border rounded-lg text-md mb-3 p-2 text-gray-200"
                data={apiaryStatusData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder=""
                value={apiaryStatus}
                onFocus={() => setIsFocusDropDown(true)}
                onBlur={() => setIsFocusDropDown(false)}
                onChange={(item) => {
                    setApiaryStatus(item.value);
                    setIsFocusDropDown(false);
                }}
            />

            {/* ... Aplicar filtros ... */}
            <TouchableOpacity
                className="w-full text-sm bg-primary mt-5 rounded-lg text-on_primary border"
                onPress={() => applyFilters(apiaryName, locationName, apiaryStatus)}
            >
                <Text className="text-center font-bold text-md m-3 text-on_primary">Aplicar filtros </Text>
            </TouchableOpacity>

            {filterApplied &&
                <TouchableOpacity
                    className="w-full text-sm bg-error mt-5 rounded-lg text-on_primary border"
                    onPress={() => removeFilter()}
                >
                    <Text className="text-center font-bold text-md m-3 text-on_primary">Eliminar filtros </Text>
                </TouchableOpacity>
            }
        </View>
    );
};

export default ApiarySearchFilters;

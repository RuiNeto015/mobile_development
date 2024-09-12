import MapView, {Marker} from 'react-native-maps';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {API_GOOGLE} from "../../../../../../config";
import {showToast} from "../../../../../utils/ComponentsUtils";

interface LocationMapProps {
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
    closeMap: () => void;
}

function LocationMap({setLatitude, setLongitude, closeMap}: LocationMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [placeName, setPlaceName] = useState('');
    const [inputLocation, setInputLocation] = useState('');

    useEffect(() => {
        if (selectedLocation) {
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.latitude},${selectedLocation.longitude}&key=${API_GOOGLE}`;

            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data.results && data.results.length > 0) {
                        setPlaceName(data.results[0].formatted_address);
                    }
                })
                .catch((error) => console.error('Error fetching place name:', error));
        }
    }, [selectedLocation]);

    const handleMapPress = (event: any) => {
        const {coordinate} = event.nativeEvent;
        setSelectedLocation(coordinate);
    };

    const handleChooseLocationPress = () => {
        if (!selectedLocation || selectedLocation.latitude == null || selectedLocation.longitude == null) {
            showToast("Deve selecionar uma localização")
        } else {
            setLatitude(selectedLocation.latitude)
            setLongitude(selectedLocation.longitude)
            closeMap()
            showToast("Localização associada")
        }
    };

    const handleInputChange = (text: any) => {
        setInputLocation(text);
    };

    const handleSearchLocation = () => {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            inputLocation
        )}&key=${API_GOOGLE}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results.length > 0) {
                    const {location} = data.results[0].geometry;
                    setSelectedLocation({
                        latitude: location.lat,
                        longitude: location.lng,
                    });
                }
            })
            .catch((error) => console.error('Erro na pesquisa:', error));
    };

    return (
        <View className="flex-1">

            <View className="mt-16 mb-3 w-full ml-5 on bg-lightgray z-1">
                {selectedLocation ? (
                    <Text>
                        <Text style={{fontWeight: 'bold'}}>Localização
                            selecionada:</Text> {placeName || 'A carregar...'}
                        {'\n'}
                        {'\n'}
                        <Text style={{fontWeight: 'bold'}}>Latitude:</Text> {selectedLocation.latitude} {'\n'}
                        <Text style={{fontWeight: 'bold'}}>Longitude:</Text>{selectedLocation.longitude}
                    </Text>
                ) : (
                    <Text>
                        <Text style={{fontWeight: 'bold'}}>Localização ainda não selecionada</Text>
                    </Text>
                )}
            </View>

            <MapView
                className="flex-1"
                initialRegion={{
                    // lisboa
                    latitude: 41.1496100,
                    longitude: -8.6109900,
                    latitudeDelta: 0.9922,
                    longitudeDelta: 0.9421,
                }}
                region={selectedLocation ? {
                    ...selectedLocation,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                } : undefined}
                onPress={handleMapPress}>
                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        title={'Selected Location'}
                        description={`Lat: ${selectedLocation.latitude}, Long: ${selectedLocation.longitude}`}
                        image={require('../../../../../../img/bee-marker.png')}
                    />
                )}
            </MapView>

            <View className="absolute bg-lightgray top-4 left-4 right-4 flex-row">
                <TextInput
                    className="flex-1 h-10 border border-gray-500 mr-2 p-2"
                    placeholder="Localização"
                    value={inputLocation}
                    onChangeText={handleInputChange}
                />
                <Button title="Pesquisar" onPress={handleSearchLocation}/>
            </View>

            <View className="items-center justify-between">
                <TouchableOpacity
                    className="absolute bg-success w-fit bottom-5 items-center border rounded-lg px-10"
                    onPress={handleChooseLocationPress}
                >
                    <Text className="text-center font-bold text-md m-3 text-on_primary">
                        Escolher localização
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    className="absolute bg-primary bottom-20 items-center border rounded-lg px-10"
                    onPress={closeMap}
                >
                    <Text className="text-center font-bold text-md m-3 text-on_primary">
                        Voltar
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

export default LocationMap;
import {Text, View} from "react-native";
import {Image, ScrollView} from "native-base";
import {IApiary} from "../../../../../../schemas/interfaces/IApiary";
import {getStatusClass, giveApiaryStatusName} from "../../ApiariesListUtils";
import Beehive from '../../../../../../../img/beehive.png';
import Calendar from "../../../../../../../img/calendar.png";
import {formatDateStringToYYYYMMDD} from "../../../../../../utils/DateUtils";
import Beekeping from "../../../../../../../img/beekeeping.png";
import Freguesia from "../../../../../../../img/freguesia.png";
import Observation from "../../../../../../../img/observation.png";
import Factory from "../../../../../../../img/factory.png";
import MapView, {Marker} from "react-native-maps";

type DetailItem = {
    icon1: any,
    text1: string,
    icon2: any,
    text2: string
};

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

function ApiaryInformation({apiary}: { apiary: IApiary }) {

    function getStringZonaControlada(): string {
        if (apiary.inControlledZone) {
            return `Zona controlada de ${apiary.controlledZoneName}`
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

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View className="w-fit flex justify-end">
                <Text
                    className="text-center text-md font-bold text-on_background m-auto">Estado</Text>
                <View className="flex-row w-full justify-center">
                    <Text
                        className={`text-center text-2xl font-bold text-on_background m-auto ${getStatusClass(apiary.status)}`}>
                        {giveApiaryStatusName(apiary.status)}
                    </Text>
                </View>

                <View className="my-3 border-0"/>

                {/*COLMEIAS*/}
                <DetailItem
                    icon2={Beekeping}
                    text1={`Nº de cortiços: ${apiary.beehives.length - apiary.beehivesCount}`}
                    icon1={Beehive}
                    text2={`Nº de colmeias: ${apiary.beehivesCount}`}
                />

                <View className="my-3 border-0"/>

                {/*LINHA 2 */}
                <DetailItem
                    icon1={Calendar}
                    text1={`Registado a ${formatDateStringToYYYYMMDD(apiary.creationDate.toString())}`}
                    icon2={Freguesia}
                    text2={`Freguesia de ${apiary.town}`}
                />

                <View className="my-3 border-0"/>


                {/*LINHA 3*/}
                <DetailItem
                    icon1={Observation}
                    text1={`${getStringZonaControlada()}`}
                    icon2={Factory}
                    text2={`${getStringCulturaIntensiva()}`}
                />

                <View className="my-3 border-0"/>

                {/*GEOLOCALIZAÇÃO*/}
                <View className="w-full flex-row justify-start">
                    <View className="w-full flex-row justify-start">
                        <Text className="font-bold text-start text-on_background text-lg">
                            Geolocalização do apiário
                        </Text>
                    </View>
                </View>

                <View className="w-full flex-row justify-between bg-background mt-2 mb-2">
                    <View className="w-5/12">
                        <Text className="my-auto text-on_background mb-1">Latitude</Text>
                        <View className="border w-full rounded-lg">
                            <Text className="m-2 font-medium text-center text-md text-on_background">
                                {apiary.geoLocation.latitude}
                            </Text>
                        </View>
                    </View>
                    <View className="w-5/12">
                        <Text className="my-auto text-on_background mb-1">Longitude</Text>
                        <View className="border w-full rounded-lg">
                            <Text className="m-2 font-medium text-center text-md text-on_background">
                                {apiary.geoLocation.longitude}
                            </Text>
                        </View>
                    </View>
                </View>

                <MapView
                    className="flex-1 w-full h-72 mt-4"
                    initialRegion={{
                        latitude: apiary.geoLocation.latitude,
                        longitude: apiary.geoLocation.longitude,
                        latitudeDelta: 0.0622,
                        longitudeDelta: 0.0421,
                    }}
                    scrollEnabled={false}>
                    <Marker
                        coordinate={{
                            latitude: apiary.geoLocation.latitude,
                            longitude: apiary.geoLocation.longitude,
                        }}
                        title={'Apiary Location'}
                    />
                </MapView>
            </View>
        </ScrollView>
    );
}

export default ApiaryInformation;

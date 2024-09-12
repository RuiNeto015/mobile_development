import {Text, View} from "react-native";
import {Button} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import * as React from "react";
import {getUser} from "../../../../utils/JwtTokenUtil";
import {useState} from "react";

function Touch({
                   navigate,
                   apiary,
               }: {
    navigate: (dest: string, apiary: { apiaryId: string; apiaryName: string }) => void;
    apiary: { apiaryId: string; apiaryName: string };
}) {

    const [user, setUser] = useState<any>();


    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setUser(JSON.parse(await getUser() || ""))
            };
            fetchData()
        }, []),
    );

    return (
        <View className="flex-col space-y-24  items-center h-full w-full py-12 bg-background">
            <Text className="font-light text-5xl text-on_background">Modo Campo</Text>
            <View className="flex-col justify-center items-center space-y-5 w-full px-2">
                <Button
                    _text={{fontSize: "4xl"}}
                    className="bg-tertiary w-full h-32 text-on_tertiary rounded-full"
                    onPress={() => navigate("inspections", apiary)}
                >
                    Inspeções
                </Button>
                {/* {user && user.role !== 'EMPLOYEE' &&
                    <Button
                        _text={{fontSize: "4xl"}}
                        className="bg-tertiary w-full h-32 text-on_tertiary rounded-full"
                        onPress={() => navigate("transhumances", apiary)}>
                        Transumâncias
                    </Button>
                } */}
                <Button
                    _text={{fontSize: "4xl"}}
                    className="bg-tertiary w-full h-32 text-on_tertiary rounded-full"
                    onPress={() =>
                        navigate("home", {
                            apiaryId: "",
                            apiaryName: "",
                        })
                    }
                >
                    Sair
                </Button>
            </View>
        </View>
    );
}

export default Touch;

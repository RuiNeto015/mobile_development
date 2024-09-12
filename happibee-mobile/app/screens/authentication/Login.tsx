import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Image, Spinner } from "native-base";
import axios from "axios";
import { storeToken, storeUser } from "../../utils/JwtTokenUtil";
import { API_BASE_URL } from "../../../config";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Login = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isSyncing, setIsSyncing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterButton = () => {
        navigation.navigate('register');
    }

    const handleBackButton = () => {
        Alert.alert(
            "Sair",
            "Tem a certeza que deseja sair da aplicação?",
            [
                {
                    text: "Cancelar",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "Sair",
                    onPress: () => BackHandler.exitApp(),
                },
            ],
            { cancelable: false }
        );
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButton);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
        };
    }, []);

    const handleLoginButton = async () => {

        if (email == "" || password == "") {
            Alert.alert("Erro", "Preencha todos os campos.");
        } else {
            try {
                setIsSyncing(true);

                const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                    email: email,
                    password: password,
                });

                if (response.status === 200) {
                    await storeToken(response.headers['authorization'])
                    console.log(response.headers['authorization']);
                    await storeUser(response.data)
                    setEmail("")
                    setPassword("")
                    navigation.navigate('home')
                } else {
                    console.log("Login failed");
                }
            } catch (error) {
                Alert.alert("Erro", "Erro inesperado! Tente novamente.");
            } finally {
                setIsSyncing(false);
            }
        }
    }

    return (
        <View className="flex-col justify-center items-center h-full w-full bg-gray-100">
            {isSyncing ? (
                <View
                    className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
                    <Spinner size="lg" color="#785900" />
                </View>
            ) : null}

            <View className="flex-1 w-full items-center mt-20 bg-gray-100">
                <Image source={require("../../../img/bee.png")} alt="bee image" />
                <View className="mt-5 px-4 w-full max-w-sm ">
                    <Text className="text-3xl text-center font-bold mb-10 text-black">
                        Login
                    </Text>

                    <View className="flex flex-col gap-4 mb-7">
                        <TextInput
                            className="border-2 border-b-gray-500 rounded-xl bg-white p-3"
                            placeholder="Introduza email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            className="border-2 border-b-gray-500 rounded-xl bg-white p-3"
                            placeholder="Introduza password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>

                    <Button
                        onPress={handleLoginButton}
                        className="bg-amber-600 text-white hover:bg-amber-200 mb-10"
                    >
                        Entrar
                    </Button>
                    <Text className="text-lg text-center mb-5 text-black">
                        Não tem uma conta?
                    </Text>
                    <TouchableOpacity onPress={handleRegisterButton}>
                        <Text className="text-lg text-center mb-5 text-black underline">
                            Registe-se
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default Login;

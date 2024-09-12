import React, { useState } from "react";
import { Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Button, Image, Spinner } from "native-base";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Register = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isSyncing, setIsSyncing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [nif, setNif] = useState("");
    const [address, setAddress] = useState("");

    const showToast = (message: string) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
      };
      
    const handleLoginButton = () => {
        navigation.navigate('login');
    }

    const handleRegisterButton = async () => {

        if (email == "" || password == "" || name == "" || nif == "" || address == "") {
            Alert.alert("Erro", "Preencha todos os campos.");
        } else {
            setIsSyncing(true);

            try {
                const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                    email: email,
                    password: password,
                    name: name,
                    role: "ADMIN",
                    nif: nif,
                    address: address,
                });

                if (response.status === 200) {
                    setEmail("")
                    setPassword("")
                    setName("")
                    setNif("")
                    setAddress("")
                    showToast("Registado com sucesso! Faça Login.");
                    navigation.navigate('login')
                } else {
                    console.log("Register failed");
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

            <View className="flex-1 w-full items-center mt-10 bg-gray-100">
                <Image source={require("../../../img/bee.png")} alt="bee image" />
                <View className="mt-5 px-4 w-full max-w-sm ">
                    <Text className="text-3xl text-center font-bold mb-10 text-black">
                        Registar
                    </Text>
                    <View className="flex flex-col gap-4 mb-7">
                        <TextInput
                            className="border-2 border-b-gray-500 rounded-xl bg-white p-3"
                            placeholder="Introduza nome"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
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
                        <TextInput
                            className="border-2 border-b-gray-500 rounded-xl bg-white p-3"
                            placeholder="Introduza NIF"
                            value={nif}
                            onChangeText={(text) => setNif(text)}
                        />
                        <TextInput
                            className="border-2 border-b-gray-500 rounded-xl bg-white p-3"
                            placeholder="Introduza morada"
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                        />
                    </View>

                    <Button
                        onPress={handleRegisterButton}
                        className="bg-amber-600 text-white hover:bg-amber-200 mb-5"
                    >
                        Registar
                    </Button>
                    <TouchableOpacity onPress={handleLoginButton}>
                        <Text className="text-lg text-center mb-5 text-black underline">
                            Voltar ao Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default Register;

import React, { useState } from "react";
import { Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Button, Image, Select, Spinner } from "native-base";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RadioButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { getUser } from "../../../../utils/JwtTokenUtil";

const RegisterMember = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [nif, setNif] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState<string>("ADMIN");
    const [user, setUser] = useState<any>();

    const showToast = (message: string) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true)
                setUser(JSON.parse(await getUser()))
            };
            fetchData()
            setIsLoading(false)
        }, []),
    );

    const handleRegisterButton = async () => {

        if (email == "" || password == "" || name == "" || nif == "" || address == "") {
            Alert.alert("Erro", "Preencha todos os campos.");
        } else {
            setIsSyncing(true);

            try {
                const response = await axios.post(`${API_BASE_URL}/auth/registerMember`, {
                    tenantId: user.tenantId,
                    email: email,
                    password: password,
                    name: name,
                    role: role,
                    nif: nif,
                    address: address,
                });

                if (response.status === 200) {
                    setEmail("")
                    setPassword("")
                    setName("")
                    setNif("")
                    setAddress("")
                    setRole("ADMIN")
                    showToast("Membro registado com sucesso!")
                    navigation.navigate('Membros')
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

            <View className="flex-1 w-full items-center mt-5 bg-gray-100">
                <View className="mt-5 px-4 w-full max-w-sm">
                    <Text className="text-3xl text-center font-bold mb-5 text-black">
                        Registar Membro
                    </Text>
                    <View className="flex flex-col gap-4 mb-5">
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
                        <View className="flex-row justify-start w-5/12 ml-0">
                            <View className="flex-row mr-10">
                                <RadioButton
                                    value="role"
                                    status={role == "ADMIN" ? "checked" : "unchecked"}
                                    onPress={() => setRole("ADMIN")}
                                />
                                <Text className="my-auto text-on_background">Administrador</Text>
                            </View>
                            <View className="flex-row">
                                <RadioButton
                                    value="role"
                                    status={role == "EMPLOYEE" ? "checked" : "unchecked"}
                                    onPress={() => setRole("EMPLOYEE")}
                                />
                                <Text className="my-auto text-on_background">Empregado</Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        onPress={handleRegisterButton}
                        className="bg-amber-600 text-white hover:bg-amber-200 mb-5"
                    >
                        Registar
                    </Button>
                </View>
            </View>
        </View>
    );
}


export default RegisterMember;

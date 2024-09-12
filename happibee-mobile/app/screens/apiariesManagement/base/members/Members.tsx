import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { UserDto } from "../../../../schemas/dtos/EmitAnnualDeclaration";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { getToken, getUser } from "../../../../utils/JwtTokenUtil";
import { API_BASE_URL } from "../../../../../config";
import { showToast } from "../../../../utils/ComponentsUtils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Divider, Image, ScrollView } from "native-base";

type ItemProps = {
    member: UserDto;
    selectMember: () => void
    user: UserDto
};

const MemberItem = ({ member, selectMember, user }: ItemProps) => (

    <View className="bg-background rounded-lg mx-2 my-3 border">
        <View
            className="w-fit text-sm py-2 mx-3 mr-5 rounded-lg text-on_background"
        >
            <View className="flex-row w-full justify-between">
                <Text className="text-center text-md font-bold text-on_background m-auto">{member.name}</Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className="text-center text-md text-on_background">
                    Email: {member.email}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className="text-center text-md text-on_background">
                    Função: {member.role}
                </Text>
            </View>
            <View className="flex-row w-full justify-between">
                <Text className="text-center text-md text-on_background">
                    Morada: {member.address}
                </Text>
            </View>
            {user.role == "ADMIN" && (
                <>
                    <Button onPress={selectMember} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-red-500">
                        Remover
                    </Button>
                </>
            )}
        </View>
    </View>
);

function Members({ navigation }: NativeStackScreenProps<any>) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [user, setUser] = useState<any>();

    const [members, setMembers] = useState<UserDto[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true)

                try {
                    const userData = JSON.parse((await getUser() || ""));
                    setUser(userData)
                    const response = await fetch(`${API_BASE_URL}/users/getAll/${userData.tenantId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const responseData = await response.json();
                    if (response.status == 200) {
                        setMembers(responseData)
                    } else if (response.status == 400) {
                        showToast(responseData.message)
                    } else {
                        showToast("Ocorreu algum problema.");
                    }
                } catch (error: any) {
                    showToast(error.message);
                }
            };
            fetchData()
            setIsLoading(false)
        }, [members]),
    );

    const handleRemoveButton = (name: string, email: string) => {
        Alert.alert(
            "Remover",
            `Tem a certeza que deseja remover ${name}?`,
            [
                {
                    text: "Cancelar",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "Confirmar",
                    onPress: () => confirmRemoveButton(email),
                },
            ],
            { cancelable: false }
        );
        return true;
    };

    const confirmRemoveButton = async (email: any) => {
        const token = await getToken()

        try {
            const response = await fetch(`${API_BASE_URL}/users/delete/${user.tenantId}/${email}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                navigation.navigate("Membros")
            } else {
                console.log(response.status)
                showToast("Ocorreu algum problema.");
            }
        } catch (error) {
            console.log(error)
        }


    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2 text-on_background">A carregar Membros</Text>
                </View>
            )}

            {!isLoading && (
                <View className="pt-10 pb-2 h-full w-full bg-background">
                    {members.length > 1 && (
                        <>
                            <Text className="text-3xl text-center font-bold mb-5 text-black">
                                Lista de membros
                            </Text>
                            <View>
                                <Divider className="mb-4 border-opacity-40 border-1" />
                                <View className="w-fit flex justify-end">
                                    <Text className="ml-3 text-left text-md text-on_background">
                                        Total de {members?.length} membros a contar consigo.
                                    </Text>
                                    {
                                        members
                                            .filter(item => item.email !== user.email) // Exclude the current user
                                            .map(item => (
                                                <MemberItem key={item.name} member={item} user={user} selectMember={() => {
                                                    handleRemoveButton(item.name, item.email)
                                                }} />
                                            ))
                                    }
                                </View>
                            </View>
                        </>
                    )}
                    {members.length <= 1 && (
                        <>
                            <View>
                                <View className="h-full flex items-center mt-32">
                                    <Image
                                        source={require("../../../../../img/memberspng.png")}
                                        alt="bee image"
                                        style={{ width: 200, height: 120 }}
                                    />
                                    <Text className="font-bold mt-5 text-left text-xl text-on_background">
                                        Parece que está sozinho...
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

export default Members;
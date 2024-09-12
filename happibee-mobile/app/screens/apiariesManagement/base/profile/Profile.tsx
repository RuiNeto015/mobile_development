import { Text, View, Alert } from "react-native";
import { Button, Image } from "native-base";
import React, { useEffect, useState } from "react";
import { getUser, removeToken, removeUser } from "../../../../utils/JwtTokenUtil";

function Profile({ navigateToRoot }: { navigateToRoot: () => void }) {

  const [user, setUser] = useState<{ name: string, email: string, nif: string, address: string, role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error retrieving user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogoutButton = () => {
    Alert.alert(
      "Terminar sessão",
      "Tem a certeza que deseja terminar sessão?",
      [
        {
          text: "Cancelar",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => endSession()
        },
      ],
      { cancelable: false }
    );
    return true; // Prevent default behavior
  };

  const endSession = async () => {
    await removeToken()
    await removeUser()
    navigateToRoot()
  };

  return (
    <View className="pt-5 pb-2 h-full w-full bg-background">
      {user != null ?
        <>
          <Text className="font-light text-center text-4xl text-on_background mb-3">Perfil</Text>
          <Text className="text-center text-lg text-on_background mb-5">Conta de {user.role}</Text>

          <View className="h-px mb-1 accent-on_background border mt-1 w-full" />

          <View className="items-center">
            <Image
              source={require("../../../../../img/beekeeper_icon.png")}
              alt="bee image"
              style={{ width: 150, height: 150 }}
            />
            <Text className="font-light text-center text-lg text-on_background mb-5">{user.name}</Text>
          </View>

          <Text className="pl-5 text-lg text-on_background mb-1 font-bold">NIF:</Text>
          <Text className="pl-5 font-light text-lg text-on_background mb-3">{user.nif}</Text>
          <Text className="pl-5 text-lg text-on_background mb-1 font-bold">Email:</Text>
          <Text className="pl-5 font-light text-lg text-on_background mb-3">{user.email}</Text>
          <Text className="pl-5 text-lg text-on_background mb-1 font-bold">Morada:</Text>
          <Text className="pl-5 font-light text-lg text-on_background mb-3">{user.address}</Text>

          <View className="items-center mt-5">
            <Button
              onPress={handleLogoutButton}
              className="bg-red-800 text-white rounded-md"
            >
              Terminar Sessão
            </Button>
          </View>
        </>
        : <></>}
    </View>
  );
}

export default Profile;

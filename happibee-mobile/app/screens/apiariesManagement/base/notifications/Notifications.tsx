import { Divider, FlatList, Spinner } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { API_BASE_URL } from "../../../../../config";
import { getToken, getUser } from "../../../../utils/JwtTokenUtil";
import { getRandomString } from "native-base/lib/typescript/theme/tools";
import { useFocusEffect } from "@react-navigation/native";

const Item = ({
  notification,
}: {
  notification: { body: string; date: string; tenantId: string; title: string; hour: string };
}) => {
  return (
    <View className="flex flex-col w-[90%] self-center space-y-5">
      <Divider></Divider>
      <View className="flex fle-col space-y-2">
        <Text className="text-xs self-center text-center font-bold">{notification.title}</Text>
        <Text className="text-lg">{notification.body}</Text>
        <View className="flex flex-row justify-between">
          <Text className="text-sm self-start">{notification.hour}</Text>
          <Text className="text-sm self-end">{notification.date}</Text>
        </View>
      </View>
      <Divider></Divider>
    </View>
  );
};

function Notifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<
    { body: string; date: string; tenantId: string; title: string; hour: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      makeHTTPRequest();
    }, [])
  );

  const makeHTTPRequest = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const userData = JSON.parse((await getUser()) || "");
      const response = await fetch(`${API_BASE_URL}/apiary/notifications/${userData.tenantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseJson = await response.json();

        setData(responseJson.reverse());
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-white h-full">
      {isLoading ? (
        <View className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
          <Spinner size="lg" color="#785900" />
        </View>
      ) : null}
      {data.length == 0 ? (
        <Text className="self-center mt-10">Sem notificações</Text>
      ) : (
        <FlatList
          className="w-full mt-2"
          data={data}
          renderItem={({ item }) => <Item notification={item} />}
          keyExtractor={(item) => ""}
        />
      )}
    </View>
  );
}

export default Notifications;

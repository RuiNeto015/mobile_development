import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { getToken, getUser } from "../utils/JwtTokenUtil";
import { Drawer, FieldMode, Home, Login, Register } from "../screens";

function RootNavigation() {
  const Stack = createNativeStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    const retrievedToken = await getToken()
    if (retrievedToken) {
      setIsLoggedIn(true)
    }
    setIsLoaded(true)
  };

  return (
    <>
      {isLoaded ?
        <NavigationContainer independent={true}>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "home" : "login"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="field_mode" component={FieldMode} />
            <Stack.Screen name="apiaries_management" component={Drawer} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
          </Stack.Navigator>
        </NavigationContainer>
        :
        <></>
      }
    </>
  );
}

export default RootNavigation;

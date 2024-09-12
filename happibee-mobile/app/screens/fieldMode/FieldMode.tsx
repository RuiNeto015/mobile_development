import * as React from "react";
import {useState} from "react";
import Menu from "./menu/Menu";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import ApiarySelection from "./menu/apiraySelection/ApiarySelection";
import {NavigationContainer} from "@react-navigation/native";
import Inspections from "./inspections/Inspections";
import Transhumances from "./transhumances/Transhumances";

function FieldMode({ navigation }: NativeStackScreenProps<any>) {
  const [apiary, setApiary] = useState<{ apiaryId: string; apiaryName: string }>({
    apiaryId: "",
    apiaryName: "",
  });
  const Stack = createNativeStackNavigator();
  const rootNavigation = navigation;


  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="apiary_selection" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="apiary_selection">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <ApiarySelection
              selectApiary={(apiary: { apiaryId: string; apiaryName: string }) => {
                setApiary(apiary);
                navigation.navigate("menu");
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="menu">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <Menu
              apiary={apiary}
              navigate={(dest: string, apiary: { apiaryId: string; apiaryName: string }) => {
                dest == "home" ? rootNavigation.navigate(dest) : navigation.navigate(dest, apiary);
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="inspections" component={Inspections} />
        <Stack.Screen name="transhumances" component={Transhumances} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default FieldMode;

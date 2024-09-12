import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegisterForm1, RegisterForm2, TranshumanceReport, TranshumancesDraft } from "../../screens";


function TranshumancesNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={"transhumances_draft"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="transhumances_draft" component={TranshumancesDraft} />
        <Stack.Screen name="transhumance_report" component={TranshumanceReport} />
        <Stack.Screen name="register_form_1" component={RegisterForm1} />
        <Stack.Screen name="register_form_2" component={RegisterForm2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default TranshumancesNavigation;

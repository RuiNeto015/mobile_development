import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HiveInspectionReport, InspectionReport, InspectionsDraft } from "../../screens";

function InspectionsNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={"inspections_draft"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="inspections_draft" component={InspectionsDraft} />
        <Stack.Screen name="inspection_report" component={InspectionReport} />
        <Stack.Screen name="hive_inspection_report" component={HiveInspectionReport} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InspectionsNavigation;

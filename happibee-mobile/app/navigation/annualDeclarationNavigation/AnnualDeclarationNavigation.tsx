import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AnnualDeclaration, AnnualDeclarationApiariesList, AnnualDeclarationDetails, AnnualDeclarationHistory } from "../../screens/apiariesManagement";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function AnnualDeclarationHistoryStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="AnnualDeclarationHistory"
        component={AnnualDeclarationHistory}
        options={{ title: 'Annual Declaration History' }}
      />
      <Stack.Screen name="details_annualDeclaration" component={AnnualDeclarationDetails} />
      <Stack.Screen name="annualDeclaration_apiaries" component={AnnualDeclarationApiariesList} />
    </Stack.Navigator>
  );
}

function AnnualDeclarationNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#785900' },
        tabBarActiveTintColor: '#785900',
        tabBarStyle: { backgroundColor: '#ECEBE1' },
      }}
    >
      <Tab.Screen name="Declaração Anual" component={AnnualDeclaration} />
      <Tab.Screen name="Histórico" component={AnnualDeclarationHistoryStack} />
    </Tab.Navigator>
  );
}

export default AnnualDeclarationNavigation;
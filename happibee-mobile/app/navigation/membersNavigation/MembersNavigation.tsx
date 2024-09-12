import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Members from "../../screens/apiariesManagement/base/members/Members";
import RegisterMember from "../../screens/apiariesManagement/base/members/RegisterMember";

function MembersNavigation() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#785900" },
        tabBarActiveTintColor: "#785900",
        tabBarStyle: { backgroundColor: "#ECEBE1" },
      }}
    >
      <Tab.Screen name="Membros" component={Members} />
      <Tab.Screen name="Registar Membro" component={RegisterMember} />
    </Tab.Navigator>
  );
}

export default MembersNavigation;
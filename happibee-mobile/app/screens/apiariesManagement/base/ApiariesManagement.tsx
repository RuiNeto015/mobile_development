import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import Notifications from "./notifications/Notifications";
import Calendar from "./calendar/Calendar";
import Profile from "./profile/Profile";
import MembersNavigation from "../../../navigation/membersNavigation/MembersNavigation";
import { ApiariesListNavigation } from "../../../navigation";

function ApiariesManagement({ navigateToRoot }: { navigateToRoot: () => void }) {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="apiaries_list"
      activeColor="#383000"
      inactiveColor="#ffffff"
      barStyle={{ backgroundColor: "#6c5e00" }}
      labeled={false}
      backBehavior={"initialRoute"}
    >
      <Tab.Screen
        name="apiaries_list"
        component={ApiariesListNavigation}
        options={{
          tabBarIcon: ({ color }) => <Icon name="forumbee" size={25} color={color} />,
        }}
      />
      <Tab.Screen
        name="notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ color }) => <Icon name="bell" size={25} color={color} />,
        }}
      />
      <Tab.Screen
        name="members"
        component={MembersNavigation}
        options={{
          tabBarIcon: ({ color }) => <Icon name="group" size={25} color={color} />,
        }}
      />
      <Tab.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" size={25} color={color} />,
        }}
      >
        {() => <Profile navigateToRoot={() => navigateToRoot()} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default ApiariesManagement;

import {createDrawerNavigator} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import ApiariesManagement from "../base/ApiariesManagement";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InspectionsNavigation, TranshumancesNavigation } from "../../../navigation";
import AnnualDeclarationNavigation from "../../../navigation/annualDeclarationNavigation/AnnualDeclarationNavigation";
import React, {useState} from "react";
import {getUser} from "../../../utils/JwtTokenUtil";
import {useFocusEffect} from "@react-navigation/native";
import Diseases from "./diseases/Diseases";
import RegisterForm1 from "./transhumances/RegisterForm1";

function Drawer({navigation}: NativeStackScreenProps<any>) {
    const Drawer = createDrawerNavigator();
    const rootNavigation = navigation;

    const [user, setUser] = useState<any>();

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setUser(JSON.parse(await getUser()))
            };
            fetchData()
        }, []),
    );

    return (
        <Drawer.Navigator screenOptions={{title: "", drawerActiveTintColor: "#6c5e00"}}>
            <Drawer.Screen
                name="bottom_bar"
                options={{
                    drawerLabel: "Início",
                    drawerIcon: ({color}) => <Icon name="forumbee" size={25} color={color}/>,
                }}
            >
                {() => <ApiariesManagement navigateToRoot={() => rootNavigation.navigate("login")}/>}
            </Drawer.Screen>
            {user && user.role !== 'EMPLOYEE' &&
                <Drawer.Screen
                    name="annual_declaration"
                    component={AnnualDeclarationNavigation}
                    options={{
                        drawerLabel: "Declaração Anual",
                        drawerIcon: ({color}) => <Icon name="forumbee" size={25} color={color}/>,
                    }}
                />
            }
            <Drawer.Screen
                name="inspections_navigation"
                component={InspectionsNavigation}
                options={{
                    drawerLabel: "Inspeções",
                    drawerIcon: ({color}) => <Icon name="forumbee" size={25} color={color}/>,
                }}
            />
            <Drawer.Screen
                name="diseases"
                component={Diseases}
                options={{
                    drawerLabel: "Registar doenças",
                    drawerIcon: ({color}) => <Icon name="forumbee" size={25} color={color}/>,
                }}
            />
            {user && user.role !== 'EMPLOYEE' &&
                <Drawer.Screen
                    name="transhumances_navigation"
                    component={RegisterForm1}
                    options={{
                        drawerLabel: "Transumâncias",
                        drawerIcon: ({color}) => <Icon name="forumbee" size={25} color={color}/>,
                    }}
                />
            }
        </Drawer.Navigator>
    );
}

export default Drawer;

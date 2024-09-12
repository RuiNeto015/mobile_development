import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AddBeehive, ApiariesList, CreateApiary} from "../screens/apiariesManagement";
import ApiaryMainDetailPage from "../screens/apiariesManagement/base/apiariesList/detailApiary/ApiaryMainDetailPage";
import BeehiveInspectionDetails
    from "../screens/apiariesManagement/base/apiariesList/detailApiary/inspectionInfo/BeehiveInspectionDetails";

function ApiariesListNavigation() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName={"apiaries_list"} screenOptions={{headerShown: false}}>
                <Stack.Screen name="apiaries_list" component={ApiariesList}/>
                <Stack.Screen name="create_apiary" component={CreateApiary}/>
                <Stack.Screen name="add_behive" component={AddBeehive}/>
                <Stack.Screen name="details_apiary" component={ApiaryMainDetailPage}/>
                <Stack.Screen name="inspection_details" component={BeehiveInspectionDetails}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default ApiariesListNavigation;

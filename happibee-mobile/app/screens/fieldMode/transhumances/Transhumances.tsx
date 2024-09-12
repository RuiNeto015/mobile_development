import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import TranshumingAll from "./transhumingAll/TranshumingAll";
import React, { useState } from "react";
import { DatabaseApiaryService } from "../../../services/db";
import { IApiary, IBeehive } from "../../../schemas/interfaces/IApiary";
import { ITranshumanceDraft } from "../../../schemas/interfaces/ITranshumance";
import { Alert } from "react-native";
import HiveSelection from "./hiveSelection/HiveSelection";
import SelectAnotherHive from "./selectAnotherHive/SelectAnotherHive";
import DatabaseTranshumanceService from "../../../services/db/DatabaseTranshumanceService";
import { formatDateToYYYYMMDD, getCurrentTime } from "../../../utils/DateUtils";

function Transhumances({ navigation, route }: NativeStackScreenProps<any>) {
  const Stack = createNativeStackNavigator();
  const parentNavigation = navigation;
  const [hives, setHives] = useState<IBeehive[]>();
  const [transhumance, setTranshumance] = useState<ITranshumanceDraft>({
    apiaryId: route.params?.apiaryId,
    apiaryName: route.params?.apiaryName,
    hives: [],
    date: formatDateToYYYYMMDD(new Date()),
    hour: getCurrentTime(),
  });

  React.useEffect(() => {
    DatabaseApiaryService.getById(route.params?.apiaryId)
      .then((apiary: IApiary | null) => {
        if (apiary) {
          setHives(apiary.beehives);
          console.log("Apiary found:", apiary);
        } else {
          console.log("Apiary not found");
        }
      })
      .catch((error) => {
        console.error("Error retrieving Apiary:", error);
      });
  }, []);

  const transhumingAll = () => {
    const hiveNames = hives?.map((hive) => hive.name);
    DatabaseTranshumanceService.saveDraft({
      apiaryId: route.params?.apiaryId,
      apiaryName: route.params?.apiaryName,
      hives: hiveNames || [],
      date: formatDateToYYYYMMDD(new Date()),
      hour: getCurrentTime(),
    })
      .then(() => {
        parentNavigation.navigate("menu");
        Alert.alert(
          "Rascunho de transumância criado",
          "Consulte a área de rascunhos de transumância para efetivar o seu registo"
        );
      })
      .catch((err) => console.log(err));
  };

  const end = () => {
    transhumance != undefined ? DatabaseTranshumanceService.saveDraft(transhumance) : null;
    parentNavigation.navigate("menu");
    Alert.alert(
      "Rascunho de transumância criado",
      "Consulte a área de rascunhos de transumância para efetivar o seu registo"
    );
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="transhuming_all" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="transhuming_all">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <TranshumingAll
              answerQuestion={(answer: string) => {
                answer == "Sim" ? transhumingAll() : navigation.navigate("hive_selection");
              }}
            ></TranshumingAll>
          )}
        </Stack.Screen>
        <Stack.Screen name="hive_selection">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <HiveSelection
              hives={hives || []}
              selectHive={(hiveName: string) => {
                for (let hive of hives || []) {
                  if (hive.name == hiveName) {
                    transhumance?.hives.push(hive.name);
                    setTranshumance(transhumance);
                    navigation.navigate("select_another_hive", { indentifiedHive: hive.name });
                  }
                }
              }}
            ></HiveSelection>
          )}
        </Stack.Screen>
        <Stack.Screen name="select_another_hive">
          {({ navigation, route }: NativeStackScreenProps<any>) => (
            <SelectAnotherHive
              answerQuestion={(answer: string) => {
                answer == "continuar" ? navigation.navigate("hive_selection") : end();
              }}
              indetifiedHive={route.params?.indentifiedHive}
            ></SelectAnotherHive>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Transhumances;

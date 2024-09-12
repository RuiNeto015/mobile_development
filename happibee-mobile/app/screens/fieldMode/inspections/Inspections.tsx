import * as React from "react";
import { useState } from "react";
import { IInspection } from "../../../schemas/interfaces/IInspection";
import HiveSelection from "./hiveSelection/HiveSelection";
import PopulationClassification from "./populationClassification/PopulationClassification";
import PolenAndHoneyLevels from "./polenAndHoneyLevels/PolenAndHoneyLevels";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import BroodPattern from "./broodPattern/BroodPattern";
import Diseases from "./diseases/Diseases";
import Temperament from "./temperament/Temperament";
import Symptoms from "./symptoms/Symptoms";
import AdditionalNotes from "./additionalNotes/AdditionalNotes";
import SelectAnotherHive from "./selectAnotherHive/SelectAnotherHive";
import { Alert } from "react-native";
import { DatabaseApiaryService, DatabaseInspectionsService } from "../../../services/db";
import { formatDateToYYYYMMDD, getCurrentTime } from "../../../utils/DateUtils";
import { IApiary, IBeehive } from "../../../schemas/interfaces/IApiary";
import History from "./History";

function Inspections({ navigation, route }: NativeStackScreenProps<any>) {
  const [hives, setHives] = useState<IBeehive[]>();
  const parentNavigation = navigation;
  const Stack = createNativeStackNavigator();
  const [iteration, setIteration] = useState(0);
  const [inspectionData, setInspectionData] = useState<IInspection>({
    apiaryId: route.params?.apiaryId,
    apiaryName: route.params?.apiaryName,
    date: formatDateToYYYYMMDD(new Date()),
    startTime: getCurrentTime(),
    endTime: "",
    hives: [],
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

  const nextIteration = () => {
    const currentHive = inspectionData.hives[iteration].hiveId;
    const updatedHives = hives?.filter((hive) => hive.name !== currentHive);
    setHives(updatedHives);
    setIteration(iteration + 1);
  };

  const endInspection = async () => {
    try {
      inspectionData.endTime = getCurrentTime();
      setInspectionData(inspectionData);
      await DatabaseInspectionsService.saveDraft(inspectionData);
    } catch (err) {
      console.log(err);
    }

    parentNavigation.navigate("menu");
    Alert.alert(
      "Rascunho de inspeção criado",
      "Consulte a área de rascunhos de inspeção para efetivar o seu registo"
    );
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="hive_selection" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="hive_selection">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <HiveSelection
              hives={hives || []}
              selectHive={(hiveId: string, hiveName: string) => {
                inspectionData.hives[iteration] = { hiveId: hiveId, hiveName: hiveName };
                setInspectionData(inspectionData);
                navigation.navigate("history");
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="history">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <History
              hiveId={inspectionData.hives[iteration].hiveId || ""}
              apiaryId={inspectionData.apiaryId || ""}
              next={() => {
                navigation.navigate("population_classification");
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="population_classification">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <PopulationClassification
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].population = answer;
                setInspectionData(inspectionData);
                navigation.navigate("polen_and_honey_levels");
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="polen_and_honey_levels">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <PolenAndHoneyLevels
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].polenAndHoneyLevels = answer;
                setInspectionData(inspectionData);
                navigation.navigate("brood_pattern");
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="brood_pattern">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <BroodPattern
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].broodPattern = answer;
                setInspectionData(inspectionData);
                navigation.navigate("diseases");
              }}
            ></BroodPattern>
          )}
        </Stack.Screen>
        <Stack.Screen name="diseases">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <Diseases
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].diseaseOrPests = answer;
                setInspectionData(inspectionData);

                answer == "Sim"
                  ? navigation.navigate("temperament")
                  : navigation.navigate("additional_notes");
              }}
            ></Diseases>
          )}
        </Stack.Screen>
        <Stack.Screen name="temperament">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <Temperament
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].temperament = answer;
                setInspectionData(inspectionData);
                navigation.navigate("symptoms");
              }}
            ></Temperament>
          )}
        </Stack.Screen>
        <Stack.Screen name="symptoms">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <Symptoms
              answerQuestion={(answer: string[]) => {
                inspectionData.hives[iteration].symptoms = answer;
                setInspectionData(inspectionData);
                navigation.navigate("additional_notes");
              }}
            ></Symptoms>
          )}
        </Stack.Screen>
        <Stack.Screen name="additional_notes">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <AdditionalNotes
              answerQuestion={(answer: string) => {
                inspectionData.hives[iteration].additionalNotes = answer;
                setInspectionData(inspectionData);
                navigation.navigate("select_another_hive");
              }}
            ></AdditionalNotes>
          )}
        </Stack.Screen>
        <Stack.Screen name="select_another_hive">
          {({ navigation }: NativeStackScreenProps<any>) => (
            <SelectAnotherHive
              allHivesDone={hives?.length == 1}
              answerQuestion={(answer: string) => {
                answer === "end"
                  ? endInspection()
                  : (nextIteration(), navigation.navigate("hive_selection"));
              }}
            ></SelectAnotherHive>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Inspections;

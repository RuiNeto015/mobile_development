import { ScrollView, Text, View } from "react-native";
import { IHiveInspection, IInspection } from "../../../../schemas/interfaces/IInspection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Button, Input, TextArea } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome6";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Select } from "native-base";
import { DatabaseInspectionsService } from "../../../../services/db";

const Dropdown = ({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: string;
  onChange: (val: string) => void;
}) => (
  <Select
    onValueChange={(val) => onChange(val)}
    minWidth="200"
    selectedValue={selected}
    accessibilityLabel="Choose Service"
    placeholder="Choose Service"
    mt={1}
  >
    {values.map((val) => (
      <Select.Item label={val} value={val} />
    ))}
  </Select>
);

function HiveInspectionReport({ navigation, route }: NativeStackScreenProps<any>) {
  const [hiveInspection, setHiveInspection] = useState<IHiveInspection>({});
  const [backupObject, setBackupObject] = useState<IHiveInspection>();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    DatabaseInspectionsService.getAll("draft").then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.id == route.params?.inspectionId) {
          for (let k = 0; k < data[i].hives.length; k++) {
            if (data[i].hives[k].hiveId == route.params?.hiveId) {
              setHiveInspection({ ...data[i].hives[k] });
            }
          }
        }
      }
    });
  }, []);

  const undo = () => {
    setHiveInspection({ ...backupObject });
  };

  const save = () => {
    hiveInspection.symptoms = symptoms;
    setBackupObject({ ...hiveInspection });
    DatabaseInspectionsService.updateInspectionEntry(route.params?.inspectionId, hiveInspection);
  };

  const updateField = <K extends keyof IHiveInspection>(field: K, value: IHiveInspection[K]) => {
    setHiveInspection((prevHiveInspection) => ({
      ...prevHiveInspection,
      [field]: value,
    }));
  };

  const [symptoms, setSymptoms] = useState(hiveInspection.symptoms || []);

  const handleInputChange = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  return (
    <ScrollView className="bg-white">
      <View className="flex flex-col h-full w-full bg-white items-center pt-5 pb-5 px-4 space-y-5">
        <View className="flex flex-col items-center">
          <Text className="text-3xl font-bold text-gray-800">Relatório de inspeção</Text>
          <Text className="text-xl text-gray-800">{route.params?.date}</Text>
        </View>
        <View className="flex flex-col self-start space-y-3">
          <View className="flex flex-row w-full">
            <Text className="text-2xl font-bold text-gray-800 mr-4">{hiveInspection.hiveName}</Text>
            {editMode == false ? (
              <Button onPress={() => {setEditMode(true); setBackupObject({ ...hiveInspection })}} className="bg-tertiary p-1 px-2 rounded-xl">
                <Icon name="pencil" size={20} color={"white"} />
              </Button>
            ) : (
              <>
                <Button
                  onPress={() => (setEditMode(false), save())}
                  className="bg-tertiary p-1 px-2 rounded-xl mr-2"
                >
                  <FeatherIcon name="save" size={20} color={"white"} />
                </Button>
                <Button
                  onPress={() => (setEditMode(false), undo())}
                  className="bg-tertiary p-1 px-2 rounded-xl"
                >
                  <AntIcon name="back" size={20} color={"white"} />
                </Button>
              </>
            )}
          </View>
          <View className="flex flex-col items-start">
            <Text className="text-md font-bold text-gray-800">Estado da população da colmeia</Text>
            {editMode ? (
              <Dropdown
                onChange={(val: string) => updateField("population", val)}
                values={["Muito boa", "Normal", "Baixa", "Muito baixa"]}
                selected={hiveInspection.population || ""}
              />
            ) : (
              <Text className="text-lg font-light text-gray-800">{hiveInspection.population}</Text>
            )}
          </View>
          <View className="flex flex-col items-start">
            <Text className="text-md font-bold text-gray-800">Níveis de mel e pólen</Text>
            {editMode ? (
              <Dropdown
                onChange={(val: string) => updateField("polenAndHoneyLevels", val)}
                values={["Muito bons", "Normais", "Baixos", "Muito baixos"]}
                selected={hiveInspection.polenAndHoneyLevels || ""}
              />
            ) : (
              <Text className="text-lg font-light text-gray-800">
                {hiveInspection.polenAndHoneyLevels}
              </Text>
            )}
          </View>
          <View className="flex flex-col items-start">
            <Text className="text-md font-bold text-gray-800">Padrão do ninho</Text>
            {editMode ? (
              <Dropdown
                onChange={(val: string) => updateField("broodPattern", val)}
                values={["Maioritariamente sólido", "Pontuado", "Muito irregular", "Sem ninhada"]}
                selected={hiveInspection.broodPattern || ""}
              />
            ) : (
              <Text className="text-lg font-light text-gray-800">
                {hiveInspection.broodPattern}
              </Text>
            )}
          </View>
          <View className="flex flex-col items-start">
            <Text className="text-md font-bold text-gray-800">Doenças/pestes indentificadas</Text>
            {editMode ? (
              <Dropdown
                onChange={(val: string) => updateField("diseaseOrPests", val)}
                values={["Sim", "Não"]}
                selected={hiveInspection.diseaseOrPests || ""}
              />
            ) : (
              <Text className="text-lg font-light text-gray-800">
                {hiveInspection.diseaseOrPests}
              </Text>
            )}
          </View>
          {hiveInspection.diseaseOrPests == "Sim" ? (
            <View className="flex flex-col items-start">
              <Text className="text-md font-bold text-gray-800">Temperamento da colmeia</Text>
              {editMode ? (
                <Dropdown
                  onChange={(val: string) => updateField("temperament", val)}
                  values={["Calmo", "Agressivo"]}
                  selected={hiveInspection.temperament || ""}
                />
              ) : (
                <Text className="text-lg font-light text-gray-800">
                  {hiveInspection.temperament}
                </Text>
              )}
            </View>
          ) : null}
          {(!editMode && hiveInspection.symptoms?.length) || 0 > 0 ? (
            <View className="flex flex-col items-start">
              <Text className="text-md font-bold text-gray-800">
                Sintomas/Doenças indentificadas
              </Text>
              {hiveInspection.symptoms?.map((symptom: string) => (
                <Text className="text-lg font-light text-gray-800">- {symptom}</Text>
              ))}
            </View>
          ) : null}
          {editMode && hiveInspection.diseaseOrPests == "Sim" ? (
            <View className="flex flex-col items-start">
              <Text className="text-md font-bold text-gray-800">
                Sintomas/Doenças indentificadas
              </Text>
              {symptoms?.map((symptom: string, index: number) => (
                <View className="mt-1 w-full">
                  <Input
                    value={symptom}
                    variant="outline"
                    placeholder={"..."}
                    onChangeText={(text) => handleInputChange(index, text)}
                  />
                </View>
              ))}
            </View>
          ) : null}
          {hiveInspection.additionalNotes != "" || editMode ? (
            <View className="flex flex-col items-start w-full">
              <Text className="text-md font-bold text-gray-800">Notas adicionais</Text>
              {editMode ? (
                <TextArea
                  value={hiveInspection.additionalNotes}
                  fontSize={"lg"}
                  autoCompleteType={false}
                  placeholder="Escreva aqui..."
                  h={"3xs"}
                  bgColor={"white"}
                  focusOutlineColor={"black"}
                  onChangeText={(val: string) => updateField("additionalNotes", val)}
                />
              ) : (
                <Text className="text-lg font-light text-gray-800">
                  {hiveInspection.additionalNotes}
                </Text>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

export default HiveInspectionReport;

import { Button, Divider, FlatList, Spinner } from "native-base";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { DatabaseInspectionsService } from "../../../services/db";
import { IHiveInspection, IInspection } from "../../../schemas/interfaces/IInspection";

const Item = ({ inspection }: { inspection: IHiveInspection }) => {
  return (
    <View className="flex flex-col w-90% border rounded-lg p-5 my-2">
      <View className="flex flex-col mb-3">
        <Text className="text-2xl text-black text-center">{inspection.date}</Text>
        <View className="flex flex-row justify-center items-center">
          <Text className="text-lg text-black text-center">{inspection.startTime}</Text>
          <Divider className="w-2/4 mx-3 bg-black" />
          <Text className="text-lg text-black text-center">{inspection.endTime}</Text>
        </View>
      </View>
      <View className="flex flex-row">
        <Text className="text-lg text-black font-bold text-center">População: </Text>
        <Text className="text-lg text-black text-center">{inspection.population}</Text>
      </View>
      <View className="flex flex-row">
        <Text className="text-lg text-black font-bold text-center">Níveis de mel e pólen: </Text>
        <Text className="text-lg text-black text-center">{inspection.polenAndHoneyLevels}</Text>
      </View>
      <View className="flex flex-row">
        <Text className="text-lg text-black font-bold text-center">Padrão de ninho: </Text>
        <Text className="text-lg text-black text-center">{inspection.broodPattern}</Text>
      </View>
      <View className="flex flex-row">
        <Text className="text-lg text-black font-bold text-center">
          Doenças ou pestes indentificadas:{" "}
        </Text>
        <Text className="text-lg text-black text-center">{inspection.diseaseOrPests}</Text>
      </View>
      {inspection.diseaseOrPests == "Sim" ? (
        <View className="flex flex-row">
          <Text className="text-lg text-black font-bold text-center">Temperamento: </Text>
          <Text className="text-lg text-black text-center">{inspection.temperament}</Text>
        </View>
      ) : null}
      {inspection.diseaseOrPests == "Sim" ? (
        <View className="flex flex-row">
          <Text className="text-lg text-black font-bold text-center">Sintomas: </Text>
          <Text className="text-lg text-black text-center">
            {inspection.symptoms ? inspection.symptoms.join(", ") : ""}
          </Text>
        </View>
      ) : null}
      <View className="flex flex-row">
        <Text className="text-lg text-black font-bold text-center">Notas adicionais: </Text>
        <Text className="text-lg text-black text-center">{inspection.additionalNotes}</Text>
      </View>
    </View>
  );
};

function History({
  next,
  hiveId,
  apiaryId,
}: {
  next: () => void;
  hiveId: string;
  apiaryId: string;
}) {
  const [history, setHistory] = useState<IHiveInspection[]>();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    DatabaseInspectionsService.getAllByTypeAndBeehiveIdAndApiaryId("registered", hiveId, apiaryId)
      .then((inspections: IInspection[] | null) => {
        if (inspections && inspections.length > 0) {
          const tmp: IHiveInspection[] = [];

          for (const inspection of inspections) {
            for (const hive of inspection.hives) {
              if (hive.hiveId == hiveId) {
                hive.date = inspection.date;
                hive.startTime = inspection.startTime;
                hive.endTime = inspection.endTime;
                tmp.push(hive);
              }
            }
          }

          setHistory(tmp);
          setLoading(false);
        } else {
          console.log("No inspections found");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error retrieving inspections:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {!loading ? (
        <View className="flex-col items-center py-10 h-full w-full bg-background px-2 space-y-5">
          <Text className="font-light text-4xl text-on_background text-center">
            Histórico de inspeções
          </Text>
          {!history ? (
            <Text className="font-light text-xl text-on_background text-center">
              Ainda não foram efetuadas inspeções a esta colmeia
            </Text>
          ) : null}
          <FlatList
            className="w-full"
            data={history}
            renderItem={({ item }) => <Item inspection={item} />}
            keyExtractor={(item) => item.hiveId || ""}
          />
          <View className="flex-col justify-center items-center w-full space-y-4">
            <Button
              _text={{ fontSize: "2xl" }}
              className="h-32 w-full bg-tertiary rounded-full"
              onPress={() => next()}
            >
              Prosseguir
            </Button>
          </View>
        </View>
      ) : (
        <View className="absolute justify-center items-center bg-gray-100 opacity-80 h-full w-full rounded-xl z-10">
          <Spinner size="lg" color="#785900" />
        </View>
      )}
    </>
  );
}

export default History;

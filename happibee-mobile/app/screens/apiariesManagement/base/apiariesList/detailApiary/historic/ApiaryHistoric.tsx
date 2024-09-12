import {Text, View} from "react-native";
import {ScrollView} from "native-base";
import {
    ApiaryEventType,
    ApiaryStatus,
    EventStateEnum,
    IApiary,
    IApiaryHistory,
} from "../../../../../../schemas/interfaces/IApiary";
import {
    formatDateStringToYYYYMMDD, formatDateToYYYYMMDD,
    formatLocalDateTimeString,
} from "../../../../../../utils/DateUtils";
import React from "react";

function getHistoricType(status: ApiaryEventType) {
    switch (status) {
        case ApiaryEventType.REQUEST_TO_CREATE:
            return "Registo de novo apiário";
        case ApiaryEventType.REQUEST_TO_TRANSHUMANCE:
            return "Pedido de transumância";
        case ApiaryEventType.DISEASE:
            return "Registo de doença"
    }
}

function getHistoricStatus(status: EventStateEnum) {
    switch (status) {
        case EventStateEnum.APPROVED:
            return "Aprovado";
        case EventStateEnum.REJECTED:
            return "Rejeitado";
        case EventStateEnum.PENDING:
            return "Pendente de aprovação";
    }
}

function getTranshumanceHistoricStatus(historic: IApiaryHistory) {
    if (historic.county === "1" && historic.parish === "1" && historic.district === "1") {
        switch (historic.status) {
            case EventStateEnum.APPROVED:
                return "Aprovado";
            case EventStateEnum.REJECTED:
                return "Rejeitado";
            case EventStateEnum.PENDING:
                return "Pendente de aprovação";
        }
    }
    if (historic.approvals!.length == 0 || historic.approvals!.length == 2) {
        switch (historic.status) {
            case EventStateEnum.APPROVED:
                return "Aprovado";
            case EventStateEnum.REJECTED:
                return "Rejeitado";
            case EventStateEnum.PENDING:
                return "Pendente de aprovação";
        }
    } else {
        if (historic.approvals![0].approved) {
            return "Pendente de aprovação";
        } else {
            return "Rejeitado";
        }
    }
}

export function giveHistoricTextColor(status: EventStateEnum): string {
    switch (status) {
        case EventStateEnum.APPROVED:
            return "text-green-500";
        case EventStateEnum.PENDING:
            return "text-yellow-500";
        case EventStateEnum.REJECTED:
            return "text-red-500";
    }
}

export function giveThranshumanceHistoricTextColor(historic: IApiaryHistory): string {
    if (historic.approvals!.length == 0 || historic.approvals!.length == 2 || (
        historic.county === "1" && historic.parish === "1" && historic.district === "1")
    ) {
        switch (historic.status) {
            case EventStateEnum.APPROVED:
                return "text-green-500";
            case EventStateEnum.REJECTED:
                return "text-red-500";
            case EventStateEnum.PENDING:
                return "text-yellow-500";
        }
    } else {
        if (historic.approvals![0].approved) {
            return "text-yellow-500";
        } else {
            return "text-red-500";
        }
    }
}

const NewApiaryItem = ({historic}: { historic: IApiaryHistory }) => (
    <View className="bg-background rounded-lg p-4 mb-5 border">
        <View className="flex-row w-full justify-center mb-3">
            <Text className="text-center text-xl font-bold text-on_background m-auto">
                {getHistoricType(historic.type)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text
                className={`text-center text-md text-on_background ${giveHistoricTextColor(
                    historic.state
                )}`}
            >
                Estado: {getHistoricStatus(historic.state)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Data registo: {formatLocalDateTimeString(historic.requestAt)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                {historic.toControlledZone ? "Pedido para uma zona controlada" : "Pedido para DGADR"}
            </Text>
        </View>
        {historic.processedAt && (
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Processado por: {historic.processedBy}
                </Text>
            </View>
        )}
        {historic.processedBy && (
            <View className="flex-row w-full justify-between">
                <Text className=" text-center text-md text-on_background">
                    Processado em: {formatLocalDateTimeString(historic.processedAt)}
                </Text>
            </View>
        )}
        {historic.observations && (
            <View className="mt-3">
                <Text className="w-full text-md text-on_background">Obervações</Text>
                <Text className="p-2  text-md text-on_background border rounded-lg mt-1">
                    {historic.observations}
                </Text>
            </View>
        )}
    </View>
);

function getStringZoneControlledTranshumance(a: string, b: string, c: string) {
    if (a === "1" && b === "1" && c === "1") {
        return "área de Zona controlada";
    } else {
        return "área da DGADR";
    }
}

const TransumanciaItem = ({historic}: { historic: IApiaryHistory }) => (
    <View className="flex flex-col bg-background rounded-lg p-4 border mb-5">
        <View className="flex-row w-full justify-center mb-3">
            <Text className="text-center text-xl font-bold text-on_background m-auto">
                {getHistoricType(historic.type)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text
                className={`text-center text-md text-on_background ${giveHistoricTextColor(
                    historic.state
                )}`}>
                Estado: {getHistoricStatus(historic.state)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Para: {getStringZoneControlledTranshumance(historic.district!, historic.county!, historic.parish!)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Pedido efetuado a: {formatDateStringToYYYYMMDD(historic.requestAt)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Data de deslocamento: {formatDateStringToYYYYMMDD(historic.travelDate?.toString() || "")}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Destino: {historic.place}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Lat: {historic.destLat}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Lon: {historic.destLong}
            </Text>
        </View>

        {historic.approvals && historic.approvals.length > 0 && (
            <View className="mt-2">
                <Text className="w-full text-md text-on_background">Aprovações:</Text>
                {historic.approvals.map(approval => (
                    <View key={JSON.stringify(approval.processedAt)}
                          className="p-2 text-md text-on_background border rounded-lg mt-1 w-full">
                        <View className="flex-row w-full justify-between">
                            {approval.approved ?
                                <Text
                                    className={`text-center text-md text-green-500`}>
                                    Aprovado
                                </Text>
                                :
                                <Text
                                    className={`text-center text-md text-red-500`}>
                                    Rejeitado
                                </Text>
                            }
                        </View>

                        <View className="flex-row w-full justify-between">
                            <Text className=" text-center text-md text-on_background">
                                Processado por: {approval.processedBy}
                            </Text>
                        </View>
                        <View className="flex-row w-full justify-between">
                            <Text className=" text-center text-md text-on_background">
                                Processado a: {formatDateToYYYYMMDD(approval.processedAt!)}
                            </Text>
                        </View>
                        <View className="flex-row w-full justify-between">
                            <Text className=" text-center text-md text-on_background">
                                Observações: {approval.observations}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )}
    </View>
);

const DiseaseItem = ({historic}: { historic: IApiaryHistory }) => (
    <View className="flex flex-col bg-background rounded-lg p-4 border mb-5">
        <View className="flex-row w-full justify-center mb-3">
            <Text className="text-center text-xl font-bold text-on_background m-auto">
                {getHistoricType(historic.type)}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Doença: {historic.disease}
            </Text>
        </View>
        <View className="flex-row w-full justify-between">
            <Text className=" text-center text-md text-on_background">
                Data de registo: {formatLocalDateTimeString(historic.requestAt)}
            </Text>
        </View>
    </View>
);

const ApiaryHistoric: React.FC<{
    apiary: IApiary;
}> = ({apiary}) => {
    // export function ApiaryHistoric({route}: any) {
    //     const {apiary, navigation}: { apiary: IApiary, navigation: any } = route.params;

    var historicArr = apiary.apiaryHistory;

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Text className="text-lg font-bold w-fit text-on_background mb-3">
                Total entradas: {historicArr.length}
            </Text>
            {historicArr.map((historic) => {
                switch (historic.type) {
                    case ApiaryEventType.REQUEST_TO_CREATE:
                        return <NewApiaryItem key={JSON.stringify(historic.requestAt)} historic={historic}/>;
                    case ApiaryEventType.REQUEST_TO_TRANSHUMANCE:
                        return <TransumanciaItem key={JSON.stringify(historic.requestAt)} historic={historic}/>;
                    case ApiaryEventType.DISEASE:
                        return <DiseaseItem key={JSON.stringify(historic.requestAt)} historic={historic}/>;
                }
            })}
        </ScrollView>
    );
};

export default ApiaryHistoric;

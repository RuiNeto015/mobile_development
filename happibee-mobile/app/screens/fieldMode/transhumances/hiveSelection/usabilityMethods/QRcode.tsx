import { Text, View } from "react-native";
import { IBeehive } from "../../../../../schemas/interfaces/IApiary";
import { RNCamera } from "react-native-camera";
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

function QRcode({
  hives,
  selectHive,
}: {
  hives: IBeehive[];
  selectHive: (hiveName: string) => void;
}) {
  const barcodeRecognized = ({ barcodes }: { barcodes: any[] }) => {
    try {
      barcodes.forEach((barcode: any) => console.log(barcode.data));
    } catch (error) {
      console.error("Error processing barcodes:", error);
    }
  };

  return (
    <View className="h-full w-full">
      <RNCamera
        style={{
          flex: 1,
          width: "100%",
        }}
        onGoogleVisionBarcodesDetected={barcodeRecognized}
        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
      ></RNCamera>
    </View>
  );
}

export default QRcode;

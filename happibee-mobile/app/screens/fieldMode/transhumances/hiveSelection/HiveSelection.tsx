import { IBeehive } from "../../../../schemas/interfaces/IApiary";
import QRcode from "./usabilityMethods/QRcode";

function HiveSelection({
  hives,
  selectHive,
}: {
  hives: IBeehive[];
  selectHive: (hiveName: string) => void;
}) {
  return (
    <QRcode
      hives={hives}
      selectHive={(hiveName: string) => selectHive(hiveName)}
    />
  );
}

export default HiveSelection;

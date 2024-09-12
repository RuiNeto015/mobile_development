import { IBeehive } from "../../../../schemas/interfaces/IApiary";
import Touch from "./usabilityMethods/Touch";

function HiveSelection({
  hives,
  selectHive,
}: {
  hives: IBeehive[];
  selectHive: (hiveId: string, hiveName: string) => void;
}) {
  return (
    <Touch
      hives={hives}
      selectHive={(hiveId: string, hiveName: string) => selectHive(hiveId, hiveName)}
    />
  );
}

export default HiveSelection;

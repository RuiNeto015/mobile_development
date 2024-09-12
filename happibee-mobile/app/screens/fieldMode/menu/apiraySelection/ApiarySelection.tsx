import { useEffect, useState } from "react";
import Touch from "./usabilityMethods/Touch";
import { DatabaseApiaryService } from "../../../../services/db";
import {ApiaryStatus, IApiary} from "../../../../schemas/interfaces/IApiary";

function ApiarySelection({
  selectApiary,
}: {
  selectApiary: (apiary: { apiaryId: string; apiaryName: string }) => void;
}) {
  const [apiaries, setApiaries] = useState<IApiary[]>([]);

  useEffect(() => {
    DatabaseApiaryService.getAll()
        .then((apiaries: IApiary[]) => apiaries.filter(apiary => apiary.status === ApiaryStatus.ACTIVE))
        .then((activeApiaries: IApiary[]) => setApiaries(activeApiaries));
  }, []);

  return (
    <Touch
      apiaries={apiaries}
      selectApiary={(apiary: { apiaryId: string; apiaryName: string }) => selectApiary(apiary)}
    />
  );
}

export default ApiarySelection;

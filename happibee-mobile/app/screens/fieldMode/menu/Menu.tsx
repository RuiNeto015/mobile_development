import { useEffect } from "react";
import Touch from "./usabilityMethods/Touch";

function Menu({
  navigate,
  apiary,
}: {
  navigate: (dest: string, apiary: { apiaryId: string; apiaryName: string }) => void;
  apiary: { apiaryId: string; apiaryName: string };
}) {
  useEffect(() => {
    console.log(apiary);
  }, []);

  return (
    <Touch
      apiary={apiary}
      navigate={(dest: string, apiary: { apiaryId: string; apiaryName: string }) =>
        navigate(dest, apiary)
      }
    />
  );
}

export default Menu;

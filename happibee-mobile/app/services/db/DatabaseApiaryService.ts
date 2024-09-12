import getRealm from "../../infrastructure/realm";
import { IApiary, IApiaryHistory } from "../../schemas/interfaces/IApiary";

class DatabaseApiaryService {
  async save(data: IApiary) {
    const realm = await getRealm();

    realm.write(() => {
      realm.create("Apiary", data);
    });
  }

  async getAll(): Promise<IApiary[]> {
    const realm = await getRealm();
    const data = realm.objects<IApiary>("Apiary");
    const apiaries: IApiary[] = Array.from(data);
    console.log(JSON.stringify(apiaries));
    return apiaries;
  }

  async deleteAll() {
    try {
      const realm = await getRealm();
      const apiariesToDelete = realm.objects<IApiary>("Apiary");

      realm.write(() => {
        realm.delete(apiariesToDelete);
      });

      console.log("All apiaries deleted successfully");
    } catch (error) {
      console.error("Error deleting apiaries:", error);
    }
  }

  async getById(id: string): Promise<IApiary | null> {
    try {
      const realm = await getRealm();
      const apiary = realm.objectForPrimaryKey<IApiary>("Apiary", id);

      return apiary ? { ...apiary } : null;
    } catch (error) {
      console.error("Error retrieving Apiary by ID:", error);
      return null;
    }
  }

  async addHistory(history: IApiaryHistory): Promise<any> {
    try {
      const realm = await getRealm();
      const apiary = realm.objectForPrimaryKey<IApiary>("Apiary", history.apiaryId || "");

      realm.write(() => {
        apiary?.apiaryHistory.push(history);
      });
    } catch (error) {
      console.log("Error adding history:", error);
    }
  }
}

export default new DatabaseApiaryService();

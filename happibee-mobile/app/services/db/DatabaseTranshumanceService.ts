import getRealm from "../../infrastructure/realm";
import { ITranshumanceDraft } from "../../schemas/interfaces/ITranshumance";
import { v4 as uuidv4 } from "uuid";

class DatabaseTranshumanceService {
  async saveDraft(data: ITranshumanceDraft) {
    data.id = uuidv4();
    const realm = await getRealm();

    realm.write(() => {
      realm.create("TranshumanceDraft", data);
    });
  }

  async getDrafts(): Promise<ITranshumanceDraft[]> {
    const realm = await getRealm();
    const drafts = realm.objects<ITranshumanceDraft>("TranshumanceDraft");
    return Array.from(drafts);
  }

  async deleteDraft(id: string) {
    const realm = await getRealm();

    const draftToDelete = realm.objectForPrimaryKey("TranshumanceDraft", id);

    console.log(draftToDelete);

    if (draftToDelete) {
      realm.write(() => {
        realm.delete(draftToDelete);
      });
    } else {
      console.warn(`Draft with id ${id} not found.`);
    }
  }
}

export default new DatabaseTranshumanceService();

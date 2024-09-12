import getRealm from "../../infrastructure/realm";
import {IHiveInspection, IInspection} from "../../schemas/interfaces/IInspection";
import {v4 as uuidv4} from "uuid";

class DatabaseInspectionsService {
    async saveDraft(data: IInspection) {
        data.id = uuidv4();
        data.type = "draft";
        const realm = await getRealm();

        realm.write(() => {
            realm.create("Inspection", data);
        });
    }

    async save(data: IInspection) {
        const realm = await getRealm();

        realm.write(() => {
            realm.create("Inspection", data);
        });
    }

    async convertDraft(id: string) {
        const realm = await getRealm();
        const inspectionToConvert = realm.objectForPrimaryKey("Inspection", id);

        if (inspectionToConvert) {
            realm.write(() => {
                inspectionToConvert.type = "registered";
            });
        }
    }

    async getAll(type: string): Promise<IInspection[]> {
        const realm = await getRealm();
        const data = realm.objects<IInspection>("Inspection").filtered(`type = "${type}"`);;
        const inspectionDrafts: IInspection[] = Array.from(data);
        return inspectionDrafts;
    }

    async getAllByTypeAndBeehiveIdAndApiaryId(type: string, idBeehive: string, idApiary: string): Promise<IInspection[]> {
        const realm = await getRealm();
        const data = realm
            .objects<IInspection>("Inspection")
            .filtered(`type = "${type}" AND hives.hiveId = "${idBeehive}" AND apiaryId = "${idApiary}"`);

        return Array.from(data);
    }

    async delete(id: string) {
        const realm = await getRealm();
        const inspectionToDelete = realm.objectForPrimaryKey("Inspection", id);

        if (inspectionToDelete) {
            realm.write(() => {
                realm.delete(inspectionToDelete);
            });
        }
    }

    async deleteAll(type: string) {
        try {
            const realm = await getRealm();
            const inspectionsToDelete = realm.objects<IInspection>("Inspection").filtered(`type = "${type}"`);

            realm.write(() => {
                realm.delete(inspectionsToDelete);
            });

            console.log(`All inspections of type "${type}" deleted successfully`);
        } catch (error) {
            console.error("Error deleting inspections:", error);
        }
    }

    async update(id: string, inspectedHives: IHiveInspection[]) {
        try {
            const realm = await getRealm();
            const inspectionToUpdate = realm.objectForPrimaryKey<IInspection>("Inspection", id);

            if (!inspectionToUpdate) {
                console.error("Inspection not found");
                return;
            }

            realm.write(() => {
                inspectionToUpdate.hives = inspectedHives;
            });

            console.log("Inspection updated successfully");
        } catch (error) {
            console.error("Error updating inspection:", error);
        }
    }

    async updateInspectionEntry(inspectionId: string, entry: IHiveInspection) {
        try {
            const realm = await getRealm();
            const inspection = realm.objectForPrimaryKey<IInspection>("Inspection", inspectionId);

            if (!inspection) {
                console.error("Inspection not found");
                return;
            }

            const hiveIndex = inspection.hives.findIndex((hive) => hive.hiveId === entry.hiveId);

            if (hiveIndex === -1) {
                console.error("Hive inspection not found");
                return;
            }

            realm.write(() => {
                inspection.hives[hiveIndex] = entry;
            });

            console.log("Hive inspection updated successfully");
        } catch (error) {
            console.error("Error updating hive inspection:", error);
        }
    }
}

export default new DatabaseInspectionsService();

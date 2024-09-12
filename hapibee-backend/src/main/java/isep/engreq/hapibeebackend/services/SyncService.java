package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.documents.InspectionDocument;
import isep.engreq.hapibeebackend.dtos.ApiaryDto;
import isep.engreq.hapibeebackend.dtos.SyncRequestDto;
import isep.engreq.hapibeebackend.dtos.SyncResponseDto;
import isep.engreq.hapibeebackend.models.apiary.ApiaryEvent;
import isep.engreq.hapibeebackend.models.beehive.Beehive;
import isep.engreq.hapibeebackend.models.beehive.HiveInspection;
import isep.engreq.hapibeebackend.repositories.ApiaryRepository;
import isep.engreq.hapibeebackend.repositories.InspectionRepository;
import isep.engreq.hapibeebackend.utils.MD5Utils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SyncService {

    @Autowired
    private ApiaryRepository apiaryRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private MD5Utils md5Utils;

    private final ModelMapper mapper = new ModelMapper();

    public SyncResponseDto syncInformation(SyncRequestDto request) {
        List<ApiaryDocument> newApiaries = new ArrayList<>();
        List<InspectionDocument> newInspections = new ArrayList<>();
        List<InspectionDocument> newInspectionsToSaveInDb = new ArrayList<>();

        List<ApiaryDocument> cloudApiaries = this.apiaryRepository.findAllByTenantId(request.getTenantId());
        List<ApiaryDto> localApiaries = request.getApiaries();
        List<InspectionDocument> localInspections = request.getInspections();

        //for each cloud apiary
        for (ApiaryDocument cloudApiary : cloudApiaries) {
            ApiaryDto matchLocalApiaryDto = this.searchApiaryInRequest(localApiaries, cloudApiary.getId());

            //if the apiary not exists locally, only on the cloud
            if (matchLocalApiaryDto == null) {
                newApiaries.add(cloudApiary);
                List<InspectionDocument> cloudInspectionsApiary = inspectionRepository.findAllByApiaryId(cloudApiary.getId());
                newInspections.addAll(cloudInspectionsApiary);
                continue;
            }

            //maps the local apiary to the document
            ApiaryDocument matchLocalApiary = this.generateApiaryDocument(matchLocalApiaryDto);

            //if both has the same MD5 - means no change
            String md5Local = md5Utils.getMd5Hash(matchLocalApiary);
            String md5Cloud = md5Utils.getMd5Hash(cloudApiary);
            if (md5Cloud.equals(md5Local)) {
                newApiaries.add(cloudApiary);
                List<InspectionDocument> cloudInspectionsOfApiary = inspectionRepository.findAllByApiaryId(cloudApiary.getId());
                newInspections.addAll(cloudInspectionsOfApiary);

                //if the MD5S is not the same
            } else {

                //check for differences in inspections
                List<InspectionDocument> localApiaryInspections = searchInspectionByApiaryId(localInspections, cloudApiary.getId());
                List<InspectionDocument> cloudApiaryInspections = this.inspectionRepository.findAllByApiaryId(cloudApiary.getId());
                if (localApiaryInspections.size() != cloudApiaryInspections.size()) {
                    Map<String, InspectionDocument> hashMapControl = new HashMap<>();

                    //populate the hashmap with both list of inspections in order to make it merge into one
                    for (InspectionDocument inspection : cloudApiaryInspections) {
                        if (!hashMapControl.containsKey(inspection.getId())) {
                            hashMapControl.put(inspection.getId(), inspection);
                        }
                    }
                    for (InspectionDocument inspection : localApiaryInspections) {
                        if (!hashMapControl.containsKey(inspection.getId())) {
                            hashMapControl.put(inspection.getId(), inspection);
                        }
                    }
                    //merge into one array and change the beehives information
                    this.clearInspectionCountOnBeehives(cloudApiary);
                    for (Map.Entry<String, InspectionDocument> entry : hashMapControl.entrySet()) {
                        for (HiveInspection hiveInspection : entry.getValue().getHives()) {
                            this.addOneInspectionToBeehive(cloudApiary, hiveInspection.getHiveName());
                        }
                        newInspections.add(entry.getValue());
                        //if is new to the cloud apiary add it
                        if (this.isInspectionNew(cloudApiaryInspections, entry.getKey())) {
                            newInspectionsToSaveInDb.add(entry.getValue());
                        }
                    }
                    cloudApiary.setMd5(md5Utils.getMd5Hash(cloudApiary));
                    cloudApiary.setChangedAt(LocalDateTime.now());
                } else {
                    newInspections.addAll(cloudApiaryInspections);
                }
                newApiaries.add(cloudApiary);
                //given that the events are always updated on the backend size, we can do overwritten always
            }
        }
        //send back the updated info
        this.inspectionRepository.saveAll(newInspectionsToSaveInDb);
        SyncResponseDto syncRequestDto = new SyncResponseDto();
        syncRequestDto.setApiaries(newApiaries);
        syncRequestDto.setInspections(newInspections);
        return syncRequestDto;
    }

    private ApiaryDocument generateApiaryDocument(ApiaryDto apiaryDto) {
        ApiaryDocument apiaryDocument = new ApiaryDocument();
        apiaryDocument.setId(apiaryDto.getId());
        apiaryDocument.setName(apiaryDto.getName());
        apiaryDocument.setTenantId(apiaryDto.getTenantId());
        apiaryDocument.setBeehives(apiaryDto.getBeehives());
        apiaryDocument.setTown(apiaryDto.getTown());
        apiaryDocument.setGeoLocation(apiaryDto.getGeoLocation());
        apiaryDocument.setNameOfLocal(apiaryDto.getNameOfLocal());
        apiaryDocument.setIntensiveCultivation(apiaryDto.isIntensiveCultivation());
        apiaryDocument.setInControlledZone(apiaryDto.isInControlledZone());
        apiaryDocument.setControlledZoneName(apiaryDto.getControlledZoneName());
        apiaryDocument.setBeehivesCount(apiaryDto.getBeehivesCount());
        apiaryDocument.setCoresCount(apiaryDto.getCoresCount());
        apiaryDocument.setCreationDate(apiaryDto.getCreationDate());
        apiaryDocument.setApiaryHistory(apiaryDto.getApiaryHistory());
        apiaryDocument.setMd5(apiaryDto.getMd5());
        apiaryDocument.setChangedAt(apiaryDto.getChangedAt());
        apiaryDocument.setStatus(apiaryDto.getStatus());
        return apiaryDocument;
    }

    private ApiaryDto searchApiaryInRequest(List<ApiaryDto> requestApiaries, String id) {
        for (ApiaryDto dbApiary : requestApiaries) {
            if (dbApiary.getId().equals(id)) {
                return dbApiary;
            }
        }
        return null;
    }

    private Beehive searchBeehiveInRequest(List<Beehive> beehives, String name) {
        for (Beehive beehive : beehives) {
            if (beehive.getName().equals(name)) {
                return beehive;
            }
        }
        return null;
    }

    private ApiaryEvent searchEventInRequest(List<ApiaryEvent> events, String id) {
        for (ApiaryEvent event : events) {
            if (event.getId().equals(id)) {
                return event;
            }
        }
        return null;
    }

    private List<InspectionDocument> searchInspectionByApiaryId(List<InspectionDocument> documents, String id) {
        List<InspectionDocument> result = new ArrayList<>();
        for (InspectionDocument document : documents) {
            if (document.getApiaryId().equals(id)) {
                result.add(document);
            }
        }
        return result;
    }

    private void addOneInspectionToBeehive(ApiaryDocument apiaryDocument, String name) {
        for (var beehive : apiaryDocument.getBeehives()) {
            if (beehive.getName().equals(name)) {
                beehive.setInspectionsCount(beehive.getInspectionsCount() + 1);
            }
        }
    }

    private void clearInspectionCountOnBeehives(ApiaryDocument apiaryDocument) {
        for (var beehive : apiaryDocument.getBeehives()) {
            beehive.setInspectionsCount(0);
        }
    }

    private boolean isInspectionNew(List<InspectionDocument> documents, String id) {
        for (var document : documents) {
            if (document.getId().equals(id)) {
                return false;
            }
        }
        return true;
    }

}

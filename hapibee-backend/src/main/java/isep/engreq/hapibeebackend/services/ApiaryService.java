package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.clients.PortalWebClient;
import isep.engreq.hapibeebackend.clients.dtos.ApiaryInfoDto;
import isep.engreq.hapibeebackend.clients.dtos.RequestCreationNewApiaryDto;
import isep.engreq.hapibeebackend.dtos.*;
import isep.engreq.hapibeebackend.models.apiary.ApiaryDiseaseEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryTranshumanceEvent;
import isep.engreq.hapibeebackend.models.beehive.Beehive;
import isep.engreq.hapibeebackend.utils.GeneralUtils;
import isep.engreq.hapibeebackend.utils.MD5Utils;
import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.models.apiary.ApiaryCreationEvent;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import isep.engreq.hapibeebackend.repositories.ApiaryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ApiaryService {

    @Autowired
    private ApiaryRepository apiaryRepository;

    @Autowired
    private PortalWebClient portalClient;

    @Autowired
    private MD5Utils md5Utils;

    private final ModelMapper mapper = new ModelMapper();

    public List<ApiaryDto> getAllApiaries() {
        List<ApiaryDocument> apiaryDocuments = apiaryRepository.findAll();
        List<ApiaryDto> apiaryDtos = new ArrayList<>();

        for (ApiaryDocument apiaryDocument : apiaryDocuments) {
            apiaryDtos.add(this.mapper.map(apiaryDocument, ApiaryDto.class));
        }
        return apiaryDtos;
    }

    public List<ApiaryDto> getAllApiaries(String tenantId) {
        List<ApiaryDocument> apiaryDocuments = apiaryRepository.findAllByTenantId(tenantId);
        List<ApiaryDto> apiaryDtos = new ArrayList<>();

        for (ApiaryDocument apiaryDocument : apiaryDocuments) {
            apiaryDtos.add(this.mapper.map(apiaryDocument, ApiaryDto.class));
        }
        return apiaryDtos;
    }

    public ApiaryDto createApiary(CreateApiaryDto createApiaryDto) {
        //if tenantId has an apiary with the same name
        if (this.apiaryRepository.findByTenantIdAndName(createApiaryDto.getTenantId(), createApiaryDto.getName()).isPresent()) {
            throw new IllegalArgumentException("Já existe um apiário com esse nome associado ao tenant!");
        }

        //map the DTO to the db document
        ApiaryDocument apiaryDocument = new ApiaryDocument();
        apiaryDocument.setId(UUID.randomUUID().toString());
        apiaryDocument.setTenantId(createApiaryDto.getTenantId());
        apiaryDocument.setApiaryHistory(new ArrayList<>());
        apiaryDocument.setName(createApiaryDto.getName());
        apiaryDocument.setNameOfLocal(createApiaryDto.getNameOfLocal());
        apiaryDocument.setCreationDate(LocalDateTime.now());
        apiaryDocument.setTown(createApiaryDto.getTown());
        apiaryDocument.setIntensiveCultivation(createApiaryDto.isIntensiveCultivation());
        apiaryDocument.setGeoLocation(createApiaryDto.getGeoLocation());
        apiaryDocument.setInControlledZone(createApiaryDto.isInControlledZone());
        //logic for beehives
        if (!createApiaryDto.getBeehives().isEmpty()) {
            List<Beehive> beehiveList = new ArrayList<>();
            for (CreateBeehiveDto createBeehiveDto : createApiaryDto.getBeehives()) {
                Beehive parsedBeehive = this.mapper.map(createBeehiveDto, Beehive.class);
                parsedBeehive.setId(createBeehiveDto.getName());
                parsedBeehive.setDateOfImplantation(LocalDate.now());
                beehiveList.add(parsedBeehive);
            }
            apiaryDocument.setBeehives(beehiveList);
        } else {
            throw new IllegalArgumentException("Colmeias vazias");
        }

        //generate the id to be common on the both sides
        String requestId = UUID.randomUUID().toString();

        //prepare the request to be sent to the portal
        RequestCreationNewApiaryDto request = new RequestCreationNewApiaryDto();
        request.setRequestId(requestId);
        request.setUserId(UUID.randomUUID().toString());
        request.setApiaryDto(this.mapper.map(apiaryDocument, ApiaryInfoDto.class));

        //instantiate the create event to be attached to the apiary document
        ApiaryCreationEvent apiaryCreationEvent = new ApiaryCreationEvent();
        apiaryCreationEvent.setId(requestId);
        apiaryCreationEvent.setRequestAt(LocalDateTime.now());
        apiaryCreationEvent.setState(EventStateEnum.PENDING);
        apiaryCreationEvent.setObservations(null);
        apiaryCreationEvent.setProcessedBy(null);
        apiaryCreationEvent.setToControlledZone(createApiaryDto.isInControlledZone());
        apiaryCreationEvent.setProcessedAt(null);

        //sends the request to the portal server
        ResponseEntity<String> portalRequestResponse;
        try {
            if (createApiaryDto.isInControlledZone()) {
                request.setInControlledZone(true);
                portalRequestResponse = this.portalClient.requestCreateApiaryToControlledZone(request);
                apiaryDocument.setControlledZoneName(GeneralUtils.getControlledZone());
                apiaryDocument.setStatus(ApiaryStateEnum.WAITING_CZ);
            } else {
                request.setInControlledZone(false);
                portalRequestResponse = this.portalClient.requestCreateApiaryToDgadr(request);
                apiaryDocument.setStatus(ApiaryStateEnum.WAITING_DGADR);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Erro na comunicação com o portal! Tente mais tarde!");
        }

        //checks if the communication to the portal was 200 (OK)
        if (portalRequestResponse.getStatusCode() != HttpStatus.OK) {
            throw new IllegalArgumentException("Erro na comunicação com o portal! Tente mais tarde!");
        }

        //add complementary information
        apiaryDocument.addEvent(apiaryCreationEvent);
        apiaryDocument.setMd5(null);
        apiaryDocument.setChangedAt(null);
        apiaryDocument.setMd5(md5Utils.getMd5Hash(apiaryDocument));
        apiaryDocument.setChangedAt(LocalDateTime.now());
        apiaryRepository.save(apiaryDocument);

        return this.mapper.map(apiaryDocument, ApiaryDto.class);
    }

    public TranshumanceDto createTranshumance(CreateTranshumanceDto createDto) {
        Optional<ApiaryDocument> apiaryData = this.apiaryRepository.findById(createDto.getApiaryId());
        boolean controlledZone;

        if (apiaryData.isEmpty()) {
            throw new IllegalArgumentException("Apiário inválido!");
        }

        ApiaryDocument apiaryDocument = apiaryData.get();

        String place;
        if (Objects.equals(createDto.getDistrict(), "1") && Objects.equals(createDto.getCounty(), "1")
                && Objects.equals(createDto.getParish(), "1")) { // controlled zone
            controlledZone = true;
            place = "Bragança";
        } else { // not controlled zone
            place = "Évora";
            controlledZone = false;
        }

        ApiaryTranshumanceEvent event = new ApiaryTranshumanceEvent(createDto.getDistrict(), createDto.getCounty(),
                createDto.getParish(), createDto.getDestLat(), createDto.getDestLong(), createDto.getCarPlate(),
                createDto.getTravelDate(), createDto.getTravelDuration(), controlledZone, place);


        event.setId(UUID.randomUUID().toString());
        if (controlledZone) {
            event.setState(EventStateEnum.PENDING);
        } else {
            event.setState(EventStateEnum.APPROVED);
        }

        event.setRequestAt(LocalDateTime.now());
        apiaryDocument.addEvent(event);
        apiaryDocument.setMd5(md5Utils.getMd5Hash(apiaryDocument));
        this.apiaryRepository.save(apiaryDocument);
        return new TranshumanceDto(event.getDistrict(), event.getCounty(), event.getParish(), event.getDestLat(),
                event.getDestLong(), event.getCarPlate(), event.getTravelDate(), event.getTravelDuration(),
                event.isControlledZone());
    }

    public void registerDisease(RegisterDiseaseDTO diseaseDTO) {
        Optional<ApiaryDocument> apiaryData = this.apiaryRepository.findByTenantIdAndName(diseaseDTO.tenantId, diseaseDTO.apiary);

        if (apiaryData.isEmpty()) {
            throw new IllegalArgumentException("Apiário inválido!");
        }

        ApiaryDocument apiaryDocument = apiaryData.get();
        ApiaryDiseaseEvent event = new ApiaryDiseaseEvent(diseaseDTO.disease);
        event.setRequestAt(LocalDateTime.now());
        apiaryDocument.addEvent(event);
        apiaryDocument.setMd5(md5Utils.getMd5Hash(apiaryDocument));
        this.apiaryRepository.save(apiaryDocument);
    }
}

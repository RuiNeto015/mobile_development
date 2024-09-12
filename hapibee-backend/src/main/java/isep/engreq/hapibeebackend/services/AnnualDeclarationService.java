package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.clients.PortalWebClient;
import isep.engreq.hapibeebackend.clients.dtos.RequestAnnualDeclaration;
import isep.engreq.hapibeebackend.documents.AnnualDeclarationDocument;
import isep.engreq.hapibeebackend.dtos.AnnualDeclarationApiaryDto;
import isep.engreq.hapibeebackend.dtos.AnnualDeclarationDto;
import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEmissionEvent;
import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEvent;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import isep.engreq.hapibeebackend.repositories.AnnualDeclarationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AnnualDeclarationService {

    @Autowired
    private final AnnualDeclarationRepository annualDeclarationRepository;

    @Autowired
    private PortalWebClient portalClient;

    private final ModelMapper mapper = new ModelMapper();

    public AnnualDeclarationService(AnnualDeclarationRepository annualDeclarationRepository) {
        this.annualDeclarationRepository = annualDeclarationRepository;
    }

    public List<AnnualDeclarationDto> getAnnualDeclarationsByTenant(String tenantId) {
        List<AnnualDeclarationDocument> annualDeclarationDocuments = annualDeclarationRepository.findAllByTenantId(tenantId);
        List<AnnualDeclarationDto> annualDeclarationDtos = new ArrayList<>();

        for (AnnualDeclarationDocument annualDeclarationDocument : annualDeclarationDocuments) {
            annualDeclarationDtos.add(this.mapper.map(annualDeclarationDocument, AnnualDeclarationDto.class));
        }
        return annualDeclarationDtos;
    }

    public AnnualDeclarationDto createAnnualDeclaration(AnnualDeclarationDto annualDeclarationDto) {

        AnnualDeclarationDocument annualDeclarationDocument = new AnnualDeclarationDocument();
        annualDeclarationDocument.setId(UUID.randomUUID().toString());
        annualDeclarationDocument.setTenantId(annualDeclarationDto.getTenantId());
        annualDeclarationDocument.setType(annualDeclarationDto.getType());
        annualDeclarationDocument.setActivityStartDate(annualDeclarationDto.getActivityStartDate());
        annualDeclarationDocument.setActivityEndDate(annualDeclarationDto.getActivityEndDate());
        annualDeclarationDocument.setUser(annualDeclarationDto.getUser());
        annualDeclarationDocument.setApiariesList(annualDeclarationDto.getApiariesList());
        annualDeclarationDocument.setAnnualDeclarationHistory(new ArrayList<>());
        annualDeclarationDocument.setState(annualDeclarationDto.getState());

        if (!annualDeclarationDto.getApiariesList().isEmpty()) {
            List<AnnualDeclarationApiaryDto> annualDeclarationApiaryDtos = new ArrayList<>();
            for (AnnualDeclarationApiaryDto annualDeclarationApiaryDto : annualDeclarationDto.getApiariesList()) {
                if (annualDeclarationApiaryDto.getState() != ApiaryStateEnum.WAITING_CZ
                        && annualDeclarationApiaryDto.getState() != ApiaryStateEnum.WAITING_DGADR) {
                    AnnualDeclarationApiaryDto parsedAnnualDeclarationApiaryDto = this.mapper
                            .map(annualDeclarationApiaryDto, AnnualDeclarationApiaryDto.class);
                    annualDeclarationApiaryDtos.add(parsedAnnualDeclarationApiaryDto);
                } else {
                    throw new IllegalArgumentException("Há apiários pendentes");
                }

            }
            annualDeclarationDocument.setApiariesList(annualDeclarationApiaryDtos);
        } else {
            throw new IllegalArgumentException("Não há apiários");
        }

        // generate the id to be common on the both sides
        String requestId = UUID.randomUUID().toString();

        // prepare the request to be sent to the portal
        RequestAnnualDeclaration request = new RequestAnnualDeclaration();
        request.setRequestId(requestId);
        request.setAnnualDeclarationDto(this.mapper.map(annualDeclarationDocument, AnnualDeclarationDto.class));

        // instantiate the create event to be attached to the annualDeclaration document
        AnnualDeclarationEvent annualDeclarationEvent = new AnnualDeclarationEvent();
        annualDeclarationEvent.setId(requestId);
        annualDeclarationEvent.setRequestAt(LocalDateTime.now());
        annualDeclarationEvent.setState(EventStateEnum.PENDING);

        // sends the request to the portal server
        ResponseEntity<String> portalRequestResponse;
        try {
            portalRequestResponse = this.portalClient.requestAnnualDeclarationEmission(request);
        } catch (Exception e) {
            throw new IllegalArgumentException("Erro na comunicação com o portal! Tente mais tarde!");
        }

        // checks if the communication to the portal was 200 (OK)
        if (portalRequestResponse.getStatusCode() != HttpStatus.OK) {
            throw new IllegalArgumentException("Erro na comunicação com o portal! Tente mais tarde!");
        }

        // add complementary information
        annualDeclarationDocument.addEvent(annualDeclarationEvent);
        annualDeclarationDocument.setChangedAt(LocalDateTime.now());
        annualDeclarationRepository.save(annualDeclarationDocument);

        return this.mapper.map(annualDeclarationDocument, AnnualDeclarationDto.class);
    }
}
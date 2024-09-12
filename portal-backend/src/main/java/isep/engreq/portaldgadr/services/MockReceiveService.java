package isep.engreq.portaldgadr.services;

import isep.engreq.portaldgadr.documents.CreateApiaryRequestDocument;
import isep.engreq.portaldgadr.documents.EmitAnnualDeclarationRequestDocument;
import isep.engreq.portaldgadr.dtos.AnnualDeclarationDto;
import isep.engreq.portaldgadr.dtos.RequestAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.RequestCreationNewApiaryDto;
import isep.engreq.portaldgadr.models.ApiaryInfo;
import isep.engreq.portaldgadr.models.enums.RequestAnnualDeclarationEmissionStatus;
import isep.engreq.portaldgadr.models.enums.RequestCreationNewApiaryStatus;
import isep.engreq.portaldgadr.repositories.AnnualDeclarationRepository;
import isep.engreq.portaldgadr.repositories.RequestsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MockReceiveService {

    private final RequestsRepository repository;

    private final AnnualDeclarationRepository annualDeclarationRepository;

    private final ModelMapper mapper = new ModelMapper();

    public void registerRequest(RequestCreationNewApiaryDto request) {
        ApiaryInfo apiaryInfo = this.mapper.map(request.getApiaryDto(), ApiaryInfo.class);
        CreateApiaryRequestDocument document = new CreateApiaryRequestDocument();
        document.setId(request.getRequestId());
        document.setApiaryDto(request.getApiaryDto());
        document.setRegisteredAt(LocalDateTime.now());
        document.setStatus(RequestCreationNewApiaryStatus.PENDING);
        document.setInControlledZone(request.isInControlledZone());
        document.setApiaryDto(apiaryInfo);
        repository.save(document);
    }

    public void registerAnnualDeclarationEmissionRequest(RequestAnnualDeclaration request) {
        AnnualDeclarationDto annualDeclarationDto = this.mapper.map(request.getAnnualDeclarationDto(),
                AnnualDeclarationDto.class);
        EmitAnnualDeclarationRequestDocument document = new EmitAnnualDeclarationRequestDocument();
        document.setId(request.getRequestId());
        document.setAnnualDeclaration(request.getAnnualDeclarationDto());
        document.setRegisteredAt(LocalDateTime.now());
        document.setStatus(RequestAnnualDeclarationEmissionStatus.PENDING);
        document.setAnnualDeclaration(annualDeclarationDto);
        annualDeclarationRepository.save(document);
    }

}

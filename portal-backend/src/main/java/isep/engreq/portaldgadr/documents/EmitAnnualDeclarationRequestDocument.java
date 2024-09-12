package isep.engreq.portaldgadr.documents;

import isep.engreq.portaldgadr.models.enums.RequestAnnualDeclarationEmissionStatus;
import isep.engreq.portaldgadr.dtos.AnnualDeclarationDto;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Data
@Document(collection = "annualDeclarationRequests")
public class EmitAnnualDeclarationRequestDocument {

    @MongoId
    private String id;

    private AnnualDeclarationDto annualDeclaration;
    private LocalDateTime registeredAt;
    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;
    private RequestAnnualDeclarationEmissionStatus status;

}
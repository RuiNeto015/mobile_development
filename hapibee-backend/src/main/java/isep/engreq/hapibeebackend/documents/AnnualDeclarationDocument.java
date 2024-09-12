package isep.engreq.hapibeebackend.documents;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import isep.engreq.hapibeebackend.dtos.AnnualDeclarationApiaryDto;
import isep.engreq.hapibeebackend.dtos.UserDto;
import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEvent;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationState;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationType;
import lombok.Data;

@Data
@Document(collection = "annualDeclarations")
public class AnnualDeclarationDocument {

    @MongoId
    private String id;
    private String tenantId;
    private AnnualDeclarationType type;
    private LocalDate activityStartDate;
    private LocalDate activityEndDate;
    private UserDto user;
    private List<AnnualDeclarationApiaryDto> apiariesList;
    private List<AnnualDeclarationEvent> annualDeclarationHistory;
    private LocalDateTime changedAt;
    private AnnualDeclarationState state;

    public void addEvent(AnnualDeclarationEvent event) {
        this.annualDeclarationHistory.add(event);
    }
}

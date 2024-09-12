package isep.engreq.hapibeebackend.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEvent;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationState;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationType;
import lombok.Data;

@Data
public class AnnualDeclarationDto {

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
}

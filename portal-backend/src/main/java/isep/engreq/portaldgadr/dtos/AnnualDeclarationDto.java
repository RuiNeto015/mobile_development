package isep.engreq.portaldgadr.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import isep.engreq.portaldgadr.models.enums.AnnualDeclarationState;
import isep.engreq.portaldgadr.models.enums.AnnualDeclarationType;
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
    private LocalDateTime changedAt;
    private AnnualDeclarationState state;
}

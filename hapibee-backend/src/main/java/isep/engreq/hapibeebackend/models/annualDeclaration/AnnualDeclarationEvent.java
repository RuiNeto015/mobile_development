package isep.engreq.hapibeebackend.models.annualDeclaration;

import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnnualDeclarationEvent {

    private String id;
    private LocalDateTime requestAt;
    private EventStateEnum state;
}
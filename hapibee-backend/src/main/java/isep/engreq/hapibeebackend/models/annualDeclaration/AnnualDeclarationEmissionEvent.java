package isep.engreq.hapibeebackend.models.annualDeclaration;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
public class AnnualDeclarationEmissionEvent extends AnnualDeclarationEvent {

    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;
}
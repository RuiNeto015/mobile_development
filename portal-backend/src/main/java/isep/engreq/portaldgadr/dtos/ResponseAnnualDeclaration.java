package isep.engreq.portaldgadr.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseAnnualDeclaration {

    private String requestId;
    private String annualDeclarationId;
    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;

}

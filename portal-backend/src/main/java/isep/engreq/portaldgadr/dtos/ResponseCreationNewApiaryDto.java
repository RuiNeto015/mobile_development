package isep.engreq.portaldgadr.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseCreationNewApiaryDto {

    private String requestId;
    private String apiaryId;
    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;

}

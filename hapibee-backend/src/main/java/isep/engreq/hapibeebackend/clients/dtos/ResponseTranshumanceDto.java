package isep.engreq.hapibeebackend.clients.dtos;

import lombok.Data;

import java.util.Date;

@Data
public class ResponseTranshumanceDto {

    private String tenentId;
    private String apiaryId;
    private String requestId;
    private String processedBy;
    private String observations;
    private Date processedAt;
    private Boolean approved;
}

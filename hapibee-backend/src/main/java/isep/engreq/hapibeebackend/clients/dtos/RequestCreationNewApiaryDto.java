package isep.engreq.hapibeebackend.clients.dtos;

import lombok.Data;

@Data
public class RequestCreationNewApiaryDto {

    private String requestId;
    private String userId;
    private ApiaryInfoDto apiaryDto;
    private boolean inControlledZone;
}
